from db import db

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId

import boto3
from werkzeug.utils import secure_filename


resume_api = Blueprint('resume', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
BUCKET = 'hophacks-resume'

# remove weird directories just in cas\
def check_filename(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@resume_api.route('/', methods = ['POST'])
@jwt_required
def upload():
    if 'file' not in request.files:
        return jsonify({"msg": "No file"}), 400
    file = request.files['file']

    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400

    file_name = secure_filename(file.filename)
    if not (file and check_filename(file.filename)):
        return jsonify({"msg": "Incorrect file type"}), 400

    s3 = boto3.client('s3')
    # Get user
    id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(id)})

    # remove old resume
    if ('resume' in user):
        old_file_name = user['resume']
        object_name = 'resumes/{}-{}'.format(id, old_file_name)
        s3.delete_object(Bucket=BUCKET, Key=object_name)

    # TODO make this atomic? what if the file upload doesn't work?
    object_name = 'resumes/{}-{}'.format(id, file_name)
    s3.upload_fileobj(file, BUCKET, object_name)

    db.users.update(
        {'_id': ObjectId(id)},
        {'$set': {'resume': file_name}}
    )

    return jsonify({'msg': 'file uploaded'}, 200)


@resume_api.route('/filename', methods = ['GET'])
@jwt_required
def filename():
    id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(id)})

    if ('resume' not in user):
        return jsonify({'filename': ''}), 200

    return jsonify({'filename': user['resume']}), 200


@resume_api.route('/', methods = ['GET'])
@jwt_required
def download():
    id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(id)})

    if ('resume' not in user):
        return jsonify({'msg': 'no resume uploaded!'}, 404)

    s3 = boto3.client('s3')
    object_name = 'resumes/{}-{}'.format(id, user['resume'])

    url = s3.generate_presigned_url('get_object',
                                     Params={'Bucket': BUCKET, 'Key': object_name},
                                     ExpiresIn=600)
    return jsonify({'url': url})
