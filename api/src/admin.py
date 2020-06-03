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
