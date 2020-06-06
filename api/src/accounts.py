'''
Endpoints related to creating and managing user accounts
'''

from db import db
from mail import mail
from util.reset_tokens import *

from flask import Blueprint, request, Response, current_app, render_template, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message

import bcrypt
import jwt
import json
import datetime
from bson import ObjectId

accounts_api = Blueprint('accounts', __name__)

# Sends confirmation email with JWT-Token in URL for verification, returns secret key used
# Note this secret key is based of the current user's hashed password, this way when the Password
# is changed the link becomes invalid!
def send_reset_email(email, hashed, base_url):
    secret = hashed.decode('utf-8') + '-' + str(datetime.datetime.utcnow().timestamp())
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
def send_confirmation_email(email, hashed, base_url):
    confirm_secret = hashed.decode('utf-8') + '-' + str(datetime.datetime.utcnow().timestamp())
    token = create_confirm_token(email, confirm_secret)
    link = base_url + "/" + token.decode('utf-8')

    msg = Message("Confirm your Email - HopHacks.com",
      sender="team@hophacks.com",
      recipients=[email])

    msg.body = 'Hello,\nClick the following link to confirm your email ' + link
    msg.html = render_template('email_confirmation.html', link=link)
    mail.send(msg)

    return confirm_secret

@accounts_api.route('/register', methods = ['POST'])
def register():
    """Create an account with a username (email) and password

    :reqjson username: email of the new account
    :reqjson password: password of the new accont
    :reqjson confirm_url: URL that the confirmation link should start with.
    The confirm token is appended to it, so it can be intepreted as a URL
    param by react. (this should be filled in by the frontend code, and
    not the client)

    **TODO**: Add profile information

    Example input:

    .. sourcecode:: json

        {
            "username": "jaythebluejay@jhu.edu",
            "password": "gohop",
            "confirm_url": "http://hophacks.com/confirm_email"
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

    username = request.json['username']
    password = request.json['password'].encode()
    confirm_url = request.json['confirm_url']

    if (db.users.find_one({'username': username})):
        return Response('User already exists!', status=409)

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)

    confirm_secret = send_confirmation_email(username, hashed, confirm_url)

    db.users.insert_one({
        'username': username,
        'hashed': hashed,
        'refresh_tokens': [],
        'profile': {},
        'email_confirmed': False,
        'confirm_secret': confirm_secret,
        'reset_secret': '',
        'is_admin': False
    })
    return jsonify({"msg": "user added"}), 200

@accounts_api.route('/confirm_email/request', methods = ['POST'])
@jwt_required
def confirm_email_req():
    """Request a new confirmation email. Must be logged in (ie. have an auth JWT token,
    see ``/auth/login``) to make this request. See ``/accounts/register`` for example
    ``confirm_url`` and the resulting email link.

    :reqheader Authorization: Should be in the form of ``Bearer: JWT``

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

    confirm_secret = send_confirmation_email(user['username'], user['hashed'], confirm_url)

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
            "username": "jaythebluejay@jhu.edu",
            "confirm_url": "http://hophacks.com/confirm_email"
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
    """Confirm email using the token from the email sent by ``/api/accounts/register``
    and ``/api/accounts/confirm_email/request``

    :reqjson confirm_token: Token from confirmation email link.

    :status 200: Email confirmed
    :status 400: Link is bad

    """

    token = request.json['confirm_token'];
    email = jwt.decode(token, verify=False)['id']
    user = db.users.find_one({'username': email})

    if (not read_confim_token(token, user['confirm_secret'])):
        return jsonify({"msg": "Bad request"}), 400

    db.users.update(
        {'_id': ObjectId(user['_id'])},
        {'$set': {'confirm_secret': '', 'email_confirmed': True}}
    )
    return jsonify({"msg": "Email Confirmed"}), 200

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

    db.users.update(
        {'_id': ObjectId(user['_id'])},
        {'$set': {'reset_secret': '', 'hashed': hashed}}
    )
    return jsonify({"msg": "Password Reset"}), 200
