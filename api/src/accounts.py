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

import bcrypt
import jwt
import json
import datetime
from bson import ObjectId
import pytz

import boto3
from werkzeug.utils import secure_filename


accounts_api = Blueprint('accounts', __name__)
# app = Flask(__name__)
# app.config.from_json("config/config.json")
# mail = Mail(app)
# email_client_accounts = email_client()

profile_keys = ["first_name", "last_name", "gender", "major", "phone_number",
"ethnicity", "grad", "is_jhu", "grad_month", "grad_year"]

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
BUCKET = 'hophacks-resume'

# remove weird directories just in case
def check_filename(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Sends confirmation email with JWT-Token in URL for verification, returns secret key used
# Note this secret key is based of the current user's hashed password, this way when the Password
# is changed the link becomes invalid!
def send_reset_email(email, hashed, base_url):
    eastern = pytz.timezone("America/New_York")
    secret = hashed.decode('utf-8') + '-' + str(pytz.utc.localize(datetime.datetime.utcnow()).astimezone(eastern).timestamp())
    token = create_reset_token(email, secret)
    link = base_url + "/" + token.decode('utf-8')

    msg = Message("Reset Your Password - HopHacks.com",
      sender="team@hophacks.com",
      recipients=[email])

    msg.body = 'Hello,\nYou or someone else has requested that a new password'\
               'be generated for your account. If you made this request, then '\
               'please follow this link: ' + link
    msg.html = render_template('email_reset.html', link=link)
    mail.send(msg)

    return secret

# Sends confirmation email with JWT-Token in URL for verification, returns the secret key used
def send_confirmation_email(email, hashed, base_url, firstName):
    eastern = pytz.timezone("America/New_York")
    confirm_secret = hashed.decode('utf-8') + '-' + str(pytz.utc.localize(datetime.datetime.utcnow()).astimezone(eastern).timestamp())
    token = create_confirm_token(email, confirm_secret)
    link = base_url + "/" + token.decode('utf-8')

    msg = Message("Confirm your Email - HopHacks.com",
      sender="team@hophacks.com",
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
            }
        }

    Given the request from above, the user will get an email with a link in the following format:

    .. sourcecode:: html

        Click <a href="http://hophacks.com/confirm_email/<token>">here</a> to confirm your email...

    :status 200: User was added
    :status 400: No json or ``application/json`` header, or field missing
    :status 409: User alreay exists

    """


    if 'json_file' not in request.form:
        return Response('Data not in json format', status=400)

    json_info = json.loads(request.form['json_file'])

    username = json_info['username']
    password = json_info['password'].encode()
    confirm_url = json_info['confirm_url']
    profile = json_info['profile']


    if (db.users.find_one({'username': username})):
        return Response('User already exists!', status=409)

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    confirm_secret = send_confirmation_email(username, hashed, confirm_url, profile["first_name"])

    resume_link = ''
    if 'file' in request.files:
        
        file = request.files['file']

        file_name = file.filename

        if file.filename == '':
            file_name = 'resume'

        file_name = secure_filename(file_name)
        if (file and check_filename(file.filename)):

            s3 = boto3.client('s3')
            object_name = 'Fall-2024/{}-{}'.format(id, file_name)
            s3.upload_fileobj(file, BUCKET, object_name)

            resume_link = file_name
    
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
        'resume': resume_link
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

    user = db.users.find_one({'username': username})
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
    confirm_url = request.json['confirm_url']

    user = db.users.find_one({'_id': ObjectId(id)})

    if (user["email_confirmed"]):
        return jsonify({"msg": "Email already confirmed" }), 400

    confirm_secret = send_confirmation_email(user['username'], user['hashed'], confirm_url, user['profile']['first_name'])

    db.users.update(
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

    email = request.json['username']
    reset_url = request.json['reset_url']

    user = db.users.find_one({'username': email})

    # Note we don't want to reveal if user exists
    if (user is None):
        return jsonify({"msg": "email sent"}), 200

    reset_secret = send_reset_email(user['username'], user['hashed'], reset_url)
    db.users.update(
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

    token = request.json['confirm_token'];
    email = jwt.decode(token, verify=False)['id']
    user = db.users.find_one({'username': email})

    if (not read_confim_token(token, user['confirm_secret'])):
        return jsonify({"msg": "Bad request"}), 400

    db.users.update_one(
        {'_id': ObjectId(user['_id'])},
        {'$set': {'confirm_secret': '', 'email_confirmed': True}}
    )

    eastern = pytz.timezone("America/New_York")

    eventFile = open("event.txt", "r")
    
    new_reg = {
        "event": eventFile.read(), # update 
        "apply_at": pytz.utc.localize(datetime.datetime.utcnow()).astimezone(eastern),
        "accept": False,
        "checkin": False,
        "status": "applied"
    }


    id = get_jwt_identity()
    result = db.users.update_one({'username' : email}, {'$push': {'registrations': new_reg}})
    send_apply_confirm(user['username'], user['profile']['first_name'])
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

    password = request.json['password'].encode()

    token = request.json['reset_token']
    email = jwt.decode(token, verify=False)['id']

    user = db.users.find_one({'username': email})

    if (not read_reset_token(token, user['reset_secret'])):
        return jsonify({"msg": "Bad request"}), 400

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)

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
