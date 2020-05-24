from db import db

from flask import request, Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId


# Decorators that checks for admin (or returns 401)
# Needs to be preceded by a route and jwt Decorators
# @api.route(...)
# @jwt_required
def check_admin(endpoint_func):

    def wrapper(*args, **kwargs):
        id = get_jwt_identity()
        user = db.users.find_one({'_id': ObjectId(id)})
        if (not (user and user['is_admin'])):
            return jsonify({'msg': 'This endpoint requires admin access'}), 401

        return endpoint_func(*args, **kwargs)

    return wrapper
