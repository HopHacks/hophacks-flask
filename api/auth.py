from app import mongo, app, api

from flask import Flask, jsonify, request, Blueprint
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, set_refresh_cookies, unset_refresh_cookies,
    get_raw_jwt, get_jti
)
import bcrypt

jwt = JWTManager(app)

# TODO replace with db
users = {}

MAX_TOKENS = 10

class User():
    def __init__(self, id, username, hashed):
        self.id = id
        self.username = username
        self.hashed = hashed
        self.refresh_tokens = []


def authenticate(username, password):
    # Todo replace with db
    if (username not in users): return None
    user = users[username];
    if bcrypt.checkpw(password.encode('utf-8'), user.hashed):
        return user

    return None

@api.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    user = authenticate(username, password)

    if (user is None):
        return jsonify({"msg": "Bad username or password"}), 401

    ret = {
        'access_token': create_access_token(identity=user.id),
    }
    refresh_token = create_refresh_token(identity=user.id)

    # TODO replace with db
    # Register refresh token with account
    user.refresh_tokens.append(get_jti(refresh_token))
    if (len(user.refresh_tokens) > 10):
        user.refresh_tokens.pop(0)

    resp = jsonify(ret)
    # secure = true?, max_age?
    set_refresh_cookies(resp, refresh_token)

    return resp, 200


@auth.route('/session/refresh', methods=['GET'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()

    # TODO DB
    user = users[current_user]
    jti =  get_raw_jwt()['jti']
    if (jti not in user.refresh_tokens):
        return jsonify({"msg": "Expired login"}), 401

    ret = {
        'access_token': create_access_token(identity=current_user),
    }

    return jsonify(ret), 200

@api.route('/session/logout', methods=['GET'])
@jwt_refresh_token_required
def logout():
    # TODO DB
    user = users[get_jwt_identity()];
    jti = get_raw_jwt()['jti']
    user.refresh_tokens.remove(jti)

    resp = jsonify({'logout': True})
    unset_refresh_cookies(resp)
    return resp, 200
