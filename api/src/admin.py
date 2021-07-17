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

@admin_api.route('/users', methods=['GET'])
@jwt_required
@check_admin
def get_all_users_account():
    query = request.args.get('query')
    page_num = int(request.args.get('page_num'))
    school = request.args.get('school')
    event = request.args.get('event')
    status = request.args.get('status')



    # Calculate number of documents to skip
    skips = 20 * (page_num - 1)

    cursor  = db.users.find({ "$or": [{"username" : {"$regex" : ".*"+query+".*", "$options" : "i"}}, {"profile.first_name": {"$regex" : ".*"+query+".*", "$options" : "i"}}, {"profile.first_name": {"$regex" : ".*"+query+".*", "$options" : "i"}}]})

    totalPage = cursor.count()

    # Skip and limit
    cursor = cursor.skip(skips).limit(20)
    
    

    users = []
    
    for document in cursor:
        users.append(document['profile'])
        
    return {'users': users, 'totalPage': totalPage}, 200


