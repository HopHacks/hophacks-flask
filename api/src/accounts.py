'''
Endpoints related to creating and managing user accounts
'''

from db import db
from mail import mail
from util.reset_tokens import *
from util.decorators import check_admin

from flask import Blueprint, request, Response, current_app, render_template, jsonify, Flask
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message, Mail
from registrations import send_apply_confirm
from config.event import EVENT_NAME

import bcrypt
import json
import jwt
import re
import datetime
from bson import ObjectId
from urllib.parse import urlsplit
import pytz


accounts_api = Blueprint('accounts', __name__)
# app = Flask(__name__)
# app.config.from_json("config/config.json")
# mail = Mail(app)
# email_client_accounts = email_client()

# MLH-required profile fields, enforced at account creation. Optional demographic
# fields (gender, pronouns, race_ethnicity, dietary_restrictions, major, shipping,
# etc.) are stored verbatim when present but are not required here.
profile_keys = ["first_name", "last_name", "age", "phone_number",
                "school", "level_of_study", "country",
                "dietary_restrictions", "tshirt_size"]

# MLH consent checkboxes that MUST be affirmatively accepted to register.
mlh_required_consents = ["mlh_code_of_conduct", "mlh_data_sharing"]

# Application essays, required at account creation (the signup form enforces
# the same word limit client-side).
required_essay_keys = ["essay_project", "essay_team"]
essay_word_limit = 300

# Server-side account constraints. bcrypt only uses the first 72 bytes of a
# password, so longer inputs are rejected instead of silently truncated.
email_re = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
password_min_length = 8
password_max_bytes = 72

# Upper bound on the JSON-serialized profile, so a direct API call cannot
# mass-assign an arbitrarily large document into the user record.
profile_max_json_bytes = 50000


# Emailed confirm/reset links are built from a client-supplied URL, so its
# origin must be one of ours (LINK_ORIGINS, set in app.py). Otherwise an
# unauthenticated caller could make us send users an official-looking email
# whose link delivers a live token to an attacker's server.
def link_url_allowed(url):
    try:
        parts = urlsplit(url)
    except ValueError:
        return False
    if (parts.scheme not in ('http', 'https') or not parts.netloc):
        return False
    origin = (parts.scheme + '://' + parts.netloc).lower()
    return origin in current_app.config['LINK_ORIGINS']


# Case-insensitive exact-match filter for usernames. Login matches usernames
# case-insensitively, so duplicate checks and lookups must do the same
# (accounts created before emails were normalized can be stored mixed-case).
def username_filter(username):
    return {'username': re.compile('^' + re.escape(username) + '$', re.IGNORECASE)}


# Sends confirmation email with JWT-Token in URL for verification, returns secret key used
# Note this secret key is based of the current user's hashed password, this way when the Password
# is changed the link becomes invalid!
def send_reset_email(email, hashed, base_url, first_name):
    eastern = pytz.timezone("America/New_York")
    secret = hashed.decode('utf-8') + '-' + str(pytz.utc.localize(datetime.datetime.utcnow()).astimezone(eastern).timestamp())
    token = create_reset_token(email, secret)
    link = base_url + "/" + token.decode('utf-8')

    msg = Message("Reset Your Password - HopHacks.com",
      recipients=[email])

    msg.body = 'Hello,\nYou or someone else has requested that a new password '\
               'be generated for your account. If you made this request, then '\
               'please follow this link: ' + link
    msg.html = render_template('email_reset.html', link=link, first_name=first_name)
    mail.send(msg)

    return secret

# Sends confirmation email with JWT-Token in URL for verification, returns the secret key used
def send_confirmation_email(email, hashed, base_url, firstName):
    eastern = pytz.timezone("America/New_York")
    confirm_secret = hashed.decode('utf-8') + '-' + str(pytz.utc.localize(datetime.datetime.utcnow()).astimezone(eastern).timestamp())
    token = create_confirm_token(email, confirm_secret)
    link = base_url + "/" + token.decode('utf-8')

    msg = Message("Confirm your Email - HopHacks.com",
      recipients=[email])

    msg.body = 'Hello,\nClick the following link to confirm your email ' + link
    msg.html = render_template('email_confirmation.html', link=link, first_name=firstName)
    mail.send(msg)

    return confirm_secret

# validate profile information
def validate_profile(request):
    if ('profile' not in request.json): return False

    profile = request.json['profile']
    for key in profile_keys:
        if (key not in profile):
            return False

    # TODO do more here?

    return True

@accounts_api.route('/create', methods = ['POST'])
def create():
    """Create an account with a username (email) and password

    :reqjson username: email of the new account
    :reqjson password: password of the new accont
    :reqjson confirm_url: URL that the confirmation link should start with.
    :reqjson profile: Profile/personal infomration. See following example


    The confirm token is appended to `confirm_url`, so it can be intepreted 
    as a URL param by react. (this should be filled in by the frontend 
    code, and not the client)

    Example input:

    .. sourcecode:: json

        {
            "username": "awong@jhu.edu",
            "password": "gohop",
            "confirm_url": "http://hophacks.com/confirm_email",
            "profile": {
                "first_name": "Andrew",
                "last_name": "Wong",
                "gender": "male",
                "major": "Computer Science",
                "phone_number": "8888888888",
                "school": "Cornell University",
                "ethnicity": "Asian/Pacific Islander",
                "grad": "ugrad",
                "is_jhu": false,
                "grad_month": "05",
                "grad_year": "2022"
                "first_hackathon": "yes"
                "first_hophacks": "yes"
                "learn_about_us": "friend"
            },
            "updated" : True
        }

    Given the request from above, the user will get an email with a link in the following format:

    .. sourcecode:: html

        Click <a href="http://hophacks.com/confirm_email/<token>">here</a> to confirm your email...

    :status 200: User was added
    :status 400: No json or ``application/json`` header, or field missing
    :status 409: User alreay exists

    """
    if (request.json is None):
        return Response('Data not in json format', status=400)

    username = request.json.get('username')
    password = request.json.get('password')
    confirm_url = request.json.get('confirm_url')
    profile = request.json.get('profile')

    if (username is None or password is None or confirm_url is None or profile is None):
        return Response('Missing required field', status=400)

    if (not isinstance(confirm_url, str) or not link_url_allowed(confirm_url)):
        return Response('confirm_url origin is not allowed', status=400)

    # Normalize the email so letter-casing can never create duplicate accounts
    # (login matches the username case-insensitively).
    username = str(username).strip().lower()

    if (not email_re.match(username)):
        return Response('Username must be a valid email address', status=400)

    if (not isinstance(password, str) or len(password) < password_min_length):
        return Response('Password must be at least 8 characters', status=400)
    if (len(password.encode()) > password_max_bytes):
        return Response('Password is too long', status=400)

    if (not isinstance(profile, dict)):
        return Response('Invalid profile', status=400)

    if (not validate_profile(request)):
        return Response('Missing required profile field', status=400)

    # MLH Member Events require affirmative agreement to the Code of Conduct and
    # the data-sharing/privacy terms before a registration is valid.
    for consent in mlh_required_consents:
        if (profile.get(consent) is not True):
            return Response('Required MLH agreement not accepted', status=400)

    # Essays are required to apply; enforce the same word limit as the form.
    for key in required_essay_keys:
        essay = profile.get(key)
        if (not isinstance(essay, str) or not essay.strip()):
            return Response('Missing required essay', status=400)
        if (len(essay.split()) > essay_word_limit):
            return Response('Essay is over the word limit', status=400)

    # Bound the overall profile size (stored verbatim otherwise).
    if (len(json.dumps(profile)) > profile_max_json_bytes):
        return Response('Profile is too large', status=400)

    if (db.users.find_one(username_filter(username))):
        return Response('User already exists!', status=409)

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(), salt)
    confirm_secret = send_confirmation_email(username, hashed, confirm_url, profile["first_name"])

    db.users.insert_one({
        'username': username,
        'hashed': hashed,
        'refresh_tokens': [],
        'profile': profile,
        'email_confirmed': False,
        'confirm_secret': confirm_secret,
        'reset_secret': '',
        'is_admin': False,
        'registrations': [],
        'resume': '',
        "updated": True,
    })

    return jsonify({"msg": "user added"}), 200

@accounts_api.route('/check/<username>', methods = ['GET'])
def check_user(username):
    """ Check if an user exists

    :reqjson email: email address

    :resjson profile: profile information

    Example request:

    .. sourcecode:: json

        {
            "username": awong@jhu.edu
        }

    Example reponse:

    .. sourcecode:: json

        {
            "exist": False
        }

    :status 200: email check successful
    :status 400: username is missing
    
    """
    if (username is None):
        return Response('no query username', status=400)

    user = db.users.find_one(username_filter(username.strip()))
    if (user is None):
        return jsonify({"exist": False}), 200

    return jsonify({'exist': True}), 200


@accounts_api.route('/profile/get', methods = ['GET'])
@jwt_required
def get_profile():
    """ Get own profile information

    :reqheader Authorization: ``Bearer <JWT Token>``

    :resjson profile: profile information

    Example reponse:

    .. sourcecode:: json

        {
            "profile": {
                "first_name": "Andrew",
                "last_name": "Wong",
                "gender": "male",
                "major": "Computer Science",
                "phone_number": "8888888888",
                "school": "Cornell University",
                "ethnicity": "Asian/Pacific Islander",
                "grad": "ugrad",
                "is_jhu": false,
                "grad_month": "05",
                "grad_year": "2022"
                "first_hackathon": "yes"
                "first_hophacks": "yes"
                "learn_about_us": "friend"
            }
        }

    :status 200: Profile retrieved successfully
    :status 422: Not logged in

    """
    id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(id)})
    if (user is None):
        return jsonify({"msg": "user not found?"}), 404

    return jsonify({'profile': user['profile']}), 200

@accounts_api.route('/updatedAccount/get', methods = ['GET'])
@jwt_required
def get_up_to_date_status():
    """ 
    Now that accounts can persist across years, this double checks if a current account has been updated this year.

    """
    id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(id)})
    if (user is None):
        return jsonify({"msg": "user not found?"}), 404

    if 'updated' not in user:
        return jsonify({'updated': False}), 200
    return jsonify({'updated': user['updated']}), 200

@accounts_api.route('/updatedAccount/post', methods = ['POST'])
@jwt_required
def updaate_up_to_date_status():
    """Update profile information

    :reqheader Authorization: ``Bearer <JWT Token>``

    :reqjson profile: Profile/personal information. See following example.

    Example request json:

    .. sourcecode:: json

        {
            "profile": {
                "first_name": "Andrew",
                "last_name": "Wong",
                "gender": "male",
                "major": "Computer Science",
                "phone_number": "8888888888",
                "school": "Cornell University",
                "ethnicity": "Asian/Pacific Islander",
                "grad": "ugrad",
                "is_jhu": false,
                "grad_month": "05",
                "grad_year": "2022"
                "first_hackathon": "yes"
                "first_hophacks": "yes"
                "learn_about_us": "friend"
            }
        }

    :status 200: Profile edited successfully
    :status 400: No json or ``application/json`` header, or field missing
    :status 422: Not logged in

    """
    id = get_jwt_identity()

    db.users.update_one({'_id': ObjectId(id)}, {'$set': {'updated' : True}})
    db.users.update_one({'_id': ObjectId(id)}, {'$set': {'resume' : ''}})

    return jsonify({"msg": "updated!"}), 200

@accounts_api.route('/profile/update', methods = ['POST'])
@jwt_required
def update_profile():
    """Update profile information

    :reqheader Authorization: ``Bearer <JWT Token>``

    :reqjson profile: Profile/personal information. See following example.

    Example request json:

    .. sourcecode:: json

        {
            "profile": {
                "first_name": "Andrew",
                "last_name": "Wong",
                "gender": "male",
                "major": "Computer Science",
                "phone_number": "8888888888",
                "school": "Cornell University",
                "ethnicity": "Asian/Pacific Islander",
                "grad": "ugrad",
                "is_jhu": false,
                "grad_month": "05",
                "grad_year": "2022"
                "first_hackathon": "yes"
                "first_hophacks": "yes"
                "learn_about_us": "friend"
            }
        }

    :status 200: Profile edited successfully
    :status 400: No json or ``application/json`` header, or field missing
    :status 422: Not logged in

    """
    id = get_jwt_identity()

    if not validate_profile(request):
        return Response("invalid profile object", status=400)

    db.users.update_one({'_id': ObjectId(id)}, {'$set': {'profile' : request.json['profile']}})
    return jsonify({"msg": "updated!"}), 200


@accounts_api.route('/delete', methods = ['POST'])
@jwt_required
@check_admin
def delete_profiles():
    """Delete a profile as an admin by providing the id of the user

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin accunt

    :reqjson user: User id (from mongo) to delete

    Example input:

    .. sourcecode:: json

        {
            "user": "XuiJJ8rJRrbNJZ3Nb"
        }

    :status 200: Profile deleted successfully
    :status 401: Need admin access
    :status 404: User not found
    :status 422: Not logged in

    """
    id = request.json['user']
    result = db.users.delete_one({'_id': ObjectId(id)})

    if (result.deleted_count == 0):
        return jsonify({"msg": "user not found?"}), 404

    return jsonify({"msg": "deleted successfully"}), 200

@accounts_api.route('/profile/search', methods = ['GET'])
@jwt_required
@check_admin
def search_profile():
    """Get all profiles that applied to a certain event, with filters

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin accunt

    :reqjson event: Event that users are applied to
    :reqjson filters: Filters to search by

    :resjson users: List of profiles

    Example input:

    .. sourcecode:: json

        {
            "event": "Spring_2020"
            "filters": {
                "first_name": "..."
                "last_name": "..."
            }
        }

    :status 200: Sucessful
    :status 401: Need admin access
    :status 422: Not logged in

    """
    return Response("NOT IMPLEMENTED", status=400)


@accounts_api.route('/confirm_email/request', methods = ['POST'])
@jwt_required
def confirm_email_req():
    """Request a new confirmation email. Must be logged in (ie. have an auth JWT token,
    see ``/auth/login``) to make this request. See ``/accounts/create`` for example
    ``confirm_url`` and the resulting email link.

    :reqheader Authorization: Should be in the form of ``Bearer <JWT>``

    :reqjson confirm_url: URL that the confirmation link should start with.

    :status 200: Email sent
    :status 400: Email was already confirmed
    :status 422: Not logged in or bad token

    """
    id = get_jwt_identity()
    confirm_url = request.json.get('confirm_url') if request.json else None

    if (not isinstance(confirm_url, str) or not link_url_allowed(confirm_url)):
        return jsonify({"msg": "Missing or disallowed confirm_url"}), 400

    user = db.users.find_one({'_id': ObjectId(id)})
    if (user is None):
        return jsonify({"msg": "Account not found"}), 404

    if (user["email_confirmed"]):
        return jsonify({"msg": "Email already confirmed" }), 400

    confirm_secret = send_confirmation_email(user['username'], user['hashed'], confirm_url, user['profile'].get('first_name', ''))

    db.users.update_one(
        {'_id': ObjectId(id)},
        {'$set': {'confirm_secret': confirm_secret}}
    )
    return jsonify({"msg": "email sent"}), 200

@accounts_api.route('/reset_password/request', methods = ['POST'])
def reset_password_req():
    """Request a password reset (ie. in a forgot password form).

    :reqjson username: email of user
    :reqjson reset_url: URL that the reset link should start with.

    Example input:

    .. sourcecode:: json

        {
            "username": "awong@jhu.edu",
            "reset_url": "http://hophacks.com/reset_password"
        }

    Given the request from above, the user will get an email with a link in the following format:

    .. sourcecode:: html

        Click <a href="http://hophacks.com/reset_password/<token>">here</a> to reset your password...


    Note this endpoint will always return 200, even if the user does not exist, since we want
    to keep the fact that a user exists secret from inquisitive folk.

    :status 200: (unless server error occurs)

    """

    email = request.json.get('username') if request.json else None
    reset_url = request.json.get('reset_url') if request.json else None

    if (not isinstance(email, str) or not isinstance(reset_url, str)):
        return jsonify({"msg": "Missing username or reset_url"}), 400

    if (not link_url_allowed(reset_url)):
        return jsonify({"msg": "reset_url origin is not allowed"}), 400

    # Match the username case-insensitively, like login does, so a user who
    # types their email with different casing still gets the reset email.
    user = db.users.find_one(username_filter(email.strip()))

    # Note we don't want to reveal if user exists
    if (user is None):
        return jsonify({"msg": "email sent"}), 200

    reset_secret = send_reset_email(
        user['username'], user['hashed'], reset_url,
        user.get('profile', {}).get('first_name', '')
    )
    db.users.update_one(
        {'_id': ObjectId(user['_id'])},
        {'$set': {'reset_secret': reset_secret}}
    )
    return jsonify({"msg": "email sent"}), 200

@accounts_api.route('/confirm_email', methods = ['POST'])
def confirm_email():
    """Confirm email using the token from the email sent by ``/api/accounts/create``
    and ``/api/accounts/confirm_email/request``. Confirming completes the user's application.

    :reqjson confirm_token: Token from confirmation email link.

    :status 200: Email confirmed
    :status 400: Link is bad

    """

    token = request.json.get('confirm_token') if request.json else None
    if (not isinstance(token, str)):
        return jsonify({"msg": "Bad request"}), 400

    # The unverified payload only locates the user; the token signature is
    # verified against that user's stored secret below.
    try:
        email = jwt.decode(token, verify=False).get('id')
    except jwt.PyJWTError:
        return jsonify({"msg": "Bad request"}), 400

    if (not isinstance(email, str)):
        return jsonify({"msg": "Bad request"}), 400

    user = db.users.find_one({'username': email})
    if (user is None):
        return jsonify({"msg": "Bad request"}), 400

    # Idempotent: re-clicking a confirmation link (refresh, second tab) must
    # not surface an error after the email was already confirmed.
    if (user['email_confirmed']):
        return jsonify({"msg": "Email already confirmed", "email": email}), 200

    # An empty confirm_secret means no confirmation is outstanding. Reject
    # before signature verification: PyJWT verifies HS256 against the empty
    # string, so a token self-signed with '' would otherwise pass.
    if (not user.get('confirm_secret')):
        return jsonify({"msg": "Bad request"}), 400

    if (not read_confim_token(token, user['confirm_secret'])):
        return jsonify({"msg": "Bad request"}), 400

    db.users.update_one(
        {'_id': ObjectId(user['_id'])},
        {'$set': {'confirm_secret': '', 'email_confirmed': True}}
    )

    eastern = pytz.timezone("America/New_York")

    # Confirming email completes the application (the full profile was already
    # captured at account creation), so create the event registration in the
    # "applied" state. Re-confirming must not create a duplicate registration.
    user = db.users.find_one({'username': email})
    already_registered = any(
        reg.get('event') == EVENT_NAME for reg in user.get('registrations', [])
    )

    if (not already_registered):
        new_reg = {
            "event": EVENT_NAME,
            "apply_at": pytz.utc.localize(datetime.datetime.utcnow()).astimezone(eastern),
            "accept": False,
            "checkin": False,
            "rsvp": False,
            "status": "applied"
        }
        db.users.update_one({'username': email}, {'$push': {'registrations': new_reg}})
        send_apply_confirm(user['username'], user['profile'].get('first_name', ''))

    return jsonify({"msg": "Email Confirmed", "email": email}), 200

@accounts_api.route('/reset_password', methods = ['POST'])
def reset_password():
    """Change password using the token from the email sent by
    and ``/api/accounts/reset_password/request``

    :reqjson confirm_token: token from reset password email link
    :reqjson password: new password

    :status 200: Email confirmed
    :status 400: Link is bad/expired

    """

    password = request.json.get('password') if request.json else None
    token = request.json.get('reset_token') if request.json else None

    if (not isinstance(password, str) or not isinstance(token, str)):
        return jsonify({"msg": "Bad request"}), 400

    if (len(password) < password_min_length):
        return jsonify({"msg": "Password must be at least 8 characters"}), 400
    if (len(password.encode()) > password_max_bytes):
        return jsonify({"msg": "Password is too long"}), 400

    # The unverified payload only locates the user; the token signature is
    # verified against that user's stored secret below.
    try:
        email = jwt.decode(token, verify=False).get('id')
    except jwt.PyJWTError:
        return jsonify({"msg": "Bad request"}), 400

    if (not isinstance(email, str)):
        return jsonify({"msg": "Bad request"}), 400

    user = db.users.find_one({'username': email})
    if (user is None):
        return jsonify({"msg": "Bad request"}), 400

    # Users who never requested a reset (or whose reset was consumed) have
    # reset_secret == ''. Reject before signature verification: PyJWT
    # verifies HS256 against the empty string, so a token self-signed with
    # '' would otherwise take over any such account.
    if (not user.get('reset_secret')):
        return jsonify({"msg": "Bad request"}), 400

    if (not read_reset_token(token, user['reset_secret'])):
        return jsonify({"msg": "Bad request"}), 400

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(), salt)

    db.users.update_one(
        {'_id': ObjectId(user['_id'])},
        {'$set': {'reset_secret': '', 'hashed': hashed}}
    )
    return jsonify({"msg": "Password Reset"}), 200


@accounts_api.route('/profile/email_confirmed', methods = ['GET'])
@jwt_required
def get_email_confirmed():
    """Get if a specific user have his/her email confirmed. Return a boolean

    :reqheader Authorization: ``Bearer <JWT Token>``

    :resjson email_confirmed: email_confirmed information
    
    :status 200: Get email_confirmed successfully
    :status 404: User not found

    """
    id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(id)})
    if (user is None):
        return jsonify({"msg": "user not found?"}), 404

    return jsonify({'email_confirmed': user['email_confirmed']}), 200
