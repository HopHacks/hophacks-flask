from util.decorators import check_admin
from db import db

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from bson import ObjectId

import boto3
from werkzeug.utils import secure_filename

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
    query = request.args.get("query")
    eventFile = open("event.txt", "r")

    cursor  = db.users.find({
    "$and": [
        {
            "$or": [
                {"username": {"$regex": ".*"+query+".*", "$options": "i"}},
                {"profile.first_name": {"$regex": ".*"+query+".*", "$options": "i"}},
                {"profile.last_name": {"$regex": ".*"+query+".*", "$options": "i"}}
            ]
        },
        {"registration": {"$elemMatch": {"event": "Fall 2024"}}}
    ]
})

    users = []
    
    for document in cursor:
        if not document['is_admin']:
            users.append({'id': str(document['_id']), 'username': str(document['username']), 'profile': document['profile'], 'email_confirmed': document['email_confirmed'], 'registrations': document['registrations'], 'resume': document.get("resume"), 'vaccination': document.get("vaccination")})
        


    return {'users': users}, 200


@admin_api.route('/resume', methods=['GET'])
@jwt_required
@check_admin
def get_resume():
    id = request.args.get("id")

    user = db.users.find_one({'_id': ObjectId(id)})

    if ('resume' not in user):
        return jsonify({'msg': 'no resume uploaded!'}, 404)

    s3 = boto3.client('s3')
    object_name = 'Fall-2024/{}-{}'.format(id, user['resume'])

    url = s3.generate_presigned_url('get_object',
                                     Params={'Bucket': 'hophacks-resume', 'Key': object_name},
                                     ExpiresIn=600)
    return jsonify({'url': url})



@admin_api.route('/vaccination', methods=['GET'])
@jwt_required
@check_admin
def get_vac():
    id = request.args.get("id")

    user = db.users.find_one({'_id': ObjectId(id)})

    if ('vaccination' not in user):
        return jsonify({'msg': 'no vaccination card uploaded!'}, 404)

    s3 = boto3.client('s3')
    object_name = 'Fall-2024/{}-{}'.format(id, user['vaccination'])

    url = s3.generate_presigned_url('get_object',
                                     Params={'Bucket': 'hophacks-vaccinations', 'Key': object_name},
                                     ExpiresIn=600)
    return jsonify({'url': url})


