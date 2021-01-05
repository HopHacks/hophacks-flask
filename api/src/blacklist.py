from util.decorators import check_admin
from db import db

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

import jwt
from bson import ObjectId

blacklist_api = Blueprint('blacklist', __name__)

# Given a user, blacklists user in the database
@blacklist_api.route('/add', methods=['POST'])
@jwt_required
@check_admin
def addUser():
    username = request.json['username']
    if (db.users.find_one({'username': username})):
        db.users.update_one({'username': username}, {'$set': {'blacklist' : true}})
        return jsonify({"msg": "blacklisted user!"}), 200
    # Can only get here if user not in database
    return Response('User does not exist!', status=409)

# Given a user, removes user from blacklist in the database
@blacklist_api.route('/remove', methods=['POST'])
@jwt_required
@check_admin
def removeUser():
    username = request.json['username']
    if (db.users.find_one({'username': username})):
        db.users.update_one({'username': username}, {'$unset': {'blacklist' : true}})
        return jsonify({"msg": "removed user from blacklist!"}), 200
    # Can only get here if user not in database
    return Response('User does not exist!', status=409)

# Returns blacklist    
@blacklist_api.route('/list', methods=['GET'])
@jwt_required
@check_admin
def getList():
    return db.users.find({blacklist: true}), 200
