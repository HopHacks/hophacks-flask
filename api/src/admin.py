from util.decorators import check_admin
from db import db

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

admin_api = Blueprint('admin', __name__)

@admin_api.route('/', methods=['GET'])
@jwt_required
@check_admin
def test_admin():
    return jsonify({'is_admin': True}), 200



@admin_api.route('/blacklist', methods=['GET'])
@jwt_required
@check_admin
def blacklist_view():
    users = db.users.find( { "blacklisted": True } )

    usersList = []

    for i in users:
        usersList.append(i["username"])

    return jsonify({"usernames":usersList}), 200


@admin_api.route('/blacklist/add', methods=['POST'])
@jwt_required
@check_admin
def blacklist_add():
    user = request.json["username"]

    ret = db.users.update_one({"username":user},{'$set': {"blacklisted":True}})

    if (ret.matched_count == 1 and ret.modified_count == 1):
        return jsonify({"msg": "blacklisted successfully"}), 200
    elif (ret.matched_count == 1 and ret.modified_count == 0):
        return jsonify({"msg": "user already blacklisted"}), 409
    elif (ret.matched_count == 0):
        return jsonify({"msg": "no such user exists"}), 400
    else:
        return jsonify({"msg": "unknown error"}), 500 


@admin_api.route('/blacklist/remove', methods=['POST'])
@jwt_required
@check_admin
def blacklist_remove():

    user = request.json["username"]

    ret = db.users.update_one({"username":user},{'$set': {"blacklisted":False}})

    if (ret.matched_count == 1 and ret.modified_count == 1):
        return jsonify({"msg": "removed from blacklist successfully"}), 200
    elif (ret.matched_count == 1 and ret.modified_count == 0):
        return jsonify({"msg": "user already not on blacklist"}), 409
    elif (ret.matched_count == 0):
        return jsonify({"msg": "no such user exists"}), 400
    else:
        return jsonify({"msg": "unknown error"}), 500 
