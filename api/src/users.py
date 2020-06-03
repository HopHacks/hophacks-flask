from db import db
from mail import mail
from util.reset_tokens import create_confirm_token

from flask import Blueprint, request, Response, current_app, render_template, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message

import bcrypt
import jwt
import json
import datetime

users_api = Blueprint('users', __name__)


def send_confirmation_email(email, hashed):
    confirm_secret = hashed.decode('utf-8') + '-' + str(datetime.datetime.utcnow().timestamp())
    token = create_confirm_token(email, confirm_secret)
    link = current_app.config['BASE_URL'] + "confirm/" + token.decode('utf-8')

    msg = Message("Confirm your Email - HopHacks.com",
      sender="team@hophacks.com",
      recipients=[email])

    msg.body = 'Hello,\nYou or someone else has requested that a new password'\
               'be generated for your account. If you made this request, then '\
               'please follow this link: ' + link
    msg.html = render_template('email_confirmation.html', link=link)
    mail.send(msg)

    return confirm_secret

@users_api.route('/register', methods = ['POST'])
def register():
    if (request.json is None):
        return Response('Data not in json format', status=400)

    username = request.json['username']
    password = request.json['password'].encode()

    if (db.users.find_one({'username': username})):
        return Response('User already exists!', status=409)

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)

    confirm_secret = send_confirmation_email(username, hashed)

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
    return jsonify({"msg:" "user added"}, status=200)
