from app import app, api, db

from flask import Flask, jsonify, request, Blueprint
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, set_refresh_cookies, unset_refresh_cookies,
    get_raw_jwt, get_jti
)
import bcrypt
from bson.objectid import ObjectId


jwt = JWTManager(app)

MAX_TOKENS = 10

@api.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    user = db.users.find_one({'username': username})
    print(user)
    if (user is None):
        return jsonify({'msg': 'Bad username or password'}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user['hashed']):
        return jsonify({'msg': 'Bad username or password'}), 401

    id = str(user['_id'])
    ret = {
        'access_token': create_access_token(identity=id),
    }
    refresh_token = create_refresh_token(identity=id)

    # Register refresh token with account and limit to MAX_TOKENS
    # Negative is to keep the last MAX_TOKENS (since we push onto end of array)
    res = db.users.update_one(
        { '_id': ObjectId(id) },
        { '$push': {
            'refresh_tokens': {
                 '$each': [ get_jti(refresh_token) ],
                 '$slice': -MAX_TOKENS
            }
        }}
    )

    print(res)
    resp = jsonify(ret)

    # secure = true?, max_age?
    set_refresh_cookies(resp, refresh_token)

    return resp, 200


@api.route('/session/refresh', methods=['GET'])
@jwt_refresh_token_required
def refresh():
    id = get_jwt_identity()
    jti =  get_raw_jwt()['jti']

    user = db.users.find_one({ '_id' : ObjectId(id)});

    if (user is None):
        return jsonify({'msg': 'User not found'}), 404

    print(user)

    if (jti not in user['refresh_tokens']):
        return jsonify({'msg': 'Expired login'}), 401

    ret = {
        'access_token': create_access_token(identity=id),
    }

    return jsonify(ret), 200

@api.route('/session/logout', methods=['GET'])
@jwt_refresh_token_required
def logout():
    # TODO DB
    id = get_jwt_identity()
    jti = get_raw_jwt()['jti']

    db.users.update_one(
        { '_id' : ObjectId(id) },
        { '$pull': { 'refresh_tokens' : { '$in': [ jti ] } } },
    )

    resp = jsonify({'logout': True})
    unset_refresh_cookies(resp)
    return resp, 200
