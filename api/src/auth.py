from db import db
import re

from flask import Flask, jsonify, request, Blueprint
from flask_jwt_extended import (
    jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, set_refresh_cookies, unset_refresh_cookies,
    get_raw_jwt, get_jti
)
import bcrypt
from bson.objectid import ObjectId

auth_api = Blueprint('auth', __name__)

MAX_TOKENS = 10

@auth_api.route('/login', methods=['POST'])
def login():
    '''Login into a user account with a username (email) and password. Gives a
    short lived access token in the response body, but also sets a refresh token
    to be saved automatically by the browser. This refresh token can be used on
    the ``/auth/session/refresh`` endpoint.

    Example Request JSON:

    .. sourcecode:: json

        {
            "username": "jz@jhu.edu",
            "password": "goodluckatmongo"
        }

    Example Response:

    .. sourcecode:: json

        {
            "access_token": "eyJ0eX...",
        }

    :reqjson username: email of account
    :reqjson password: password of account

    :resjson access_token: actual token used for other endpoints

    :resheader SetCookie: sets the refresh token in the browser. 
 
    :status 200: Success
    :status 401: Bad username or password

    Note the cookie is HttpOnly, meaning it cannot be accesed from
    javascript (so that a malicious script cannot gain access to 
    the account).
    '''


    username = request.json.get('username', None)
    password = request.json.get('password', None)

    user = db.users.find_one({'username': re.compile('^' + re.escape(username) + '$', re.IGNORECASE)})
    if (user is None):
        return jsonify({'msg': 'Bad username or password'}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user['hashed']):
        return jsonify({'msg': 'Bad username or password'}), 401
    #if (user["email_confirmed"] == False):
        #print("not allowed")
        #return jsonify({'msg': 'Email not confirmed'}), 403

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

    resp = jsonify(ret)

    # secure = true?, max_age?
    set_refresh_cookies(resp, refresh_token)

    return resp, 200

@auth_api.route('/session/refresh', methods=['GET'])
@jwt_refresh_token_required
def refresh():
    '''Obtain a new access token, given the caller has a valid refresh token
    stored as a cookie. In most cases the browser will automatically handle
    sending the cookie.

    Example Response JSON:

    .. sourcecode:: json

        {
            "access_token": "eyJ0eX"
        }

    :reqheader Cookie: refresh token

    :resjson access_token: new access token

    :status 200: Success
    :status 401: Expired refresh token (ie. user logged out)
    :status 422: Bad refresh token

    '''

    id = get_jwt_identity()
    jti =  get_raw_jwt()['jti']

    user = db.users.find_one({ '_id' : ObjectId(id)});

    if (user is None):
        return jsonify({'msg': 'User not found'}), 404

    if (jti not in user['refresh_tokens']):
        return jsonify({'msg': 'Expired login'}), 401

    ret = {
        'access_token': create_access_token(identity=id),
    }

    return jsonify(ret), 200


@auth_api.route('/session/logout', methods=['GET'])
@jwt_refresh_token_required
def logout():
    '''Logs user out by deleting refresh token associated with account and also
    reseting the cookie that stores the refresh token on the client's browser.

    :reqheader Cookie: refresh token

    :resheader Set-Cookie: deletes refresh token cookie

    :status 200: successfully logged out
    :status 422: no refresh token present, likely already logged out

    '''
    id = get_jwt_identity()
    jti = get_raw_jwt()['jti']

    db.users.update_one(
        { '_id' : ObjectId(id) },
        { '$pull': { 'refresh_tokens' : { '$in': [ jti ] } } },
    )

    resp = jsonify({'logout': True})
    unset_refresh_cookies(resp)
    return resp, 200


@auth_api.route('/test_protected', methods = ['GET'])
@jwt_required
def protected():
    return('logged in')
