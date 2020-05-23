from db import db

from flask import Blueprint, request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
import bcrypt
import json

users_api = Blueprint('users', __name__)

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

    db.users.insert_one({
        'username': username,
        'hashed': hashed,
        'refresh_tokens': [],
        'profile': {},
        'is_admin': False
    })

    return('User added')


@users_api.route('/protected', methods = ['GET'])
@jwt_required
def protected():
    return('logged in')
