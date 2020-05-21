from app import mongo, app, api

from auth import jwt, User

from flask import Blueprint, request, Response
from flask_jwt_extended import (jwt_required, get_jwt_identity)
import bcrypt

# TODO Replace
from auth import users

api = Blueprint('api', __name__)

@api.route('/register', methods = ['POST'])
def register():
    if (request.json is None):
        return Response("Data not in json format", status=400)

    username = request.json['username']
    password = request.json['password'].encode()

    # TODO replace with db
    if (username in users):
        return Response("User already exists!", status=409)

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    users[username] = User(username, username, hashed)
    print(users)

    return("User added")


@api.route('/protected', methods = ['GET'])
@jwt_required
def protected():
    return("logged in")
