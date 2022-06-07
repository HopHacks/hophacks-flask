from db import db

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId

import boto3
from werkzeug.utils import secure_filename

vaccination_api = Blueprint('vaccination', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpeg', 'jpg'}
BUCKET = 'hophacks-vaccination'

# remove weird directories just in case
def check_filename(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@vaccination_api.route('/', methods = ['POST'])
@jwt_required
def upload():
    """Upload a vaccination card to the current users profile. Behind the scene stores a file in AWS s3.

    :reqheader Authorization: ``Bearer <JWT Token>``

    :form file: Vaccination card file, should be .pdf / .png / .jpeg / .jpg

    :status 200: File uploaded successfully
    :status 400: No file was uploaded, or wrong file type
    :status 422: Not logged in

    """
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

    # remove old vaccination card
    if ('vaccination' in user):
        old_file_name = user['vaccination']
        object_name = 'vaccination/{}-{}'.format(id, old_file_name)
        s3.delete_object(Bucket=BUCKET, Key=object_name)

    # TODO make this atomic? what if the file upload doesn't work?
    object_name = 'vaccination/{}-{}'.format(id, file_name)
    s3.upload_fileobj(file, BUCKET, object_name)

    db.users.update(
        {'_id': ObjectId(id)},
        {'$set': {'vaccination': file_name}}
    )

    return jsonify({'msg': 'file uploaded'}, 200)


@vaccination_api.route('/filename', methods = ['GET'])
@jwt_required
def filename():
    """Get the filename of the current user's vaccination card.

    :reqheader Authorization: ``Bearer <JWT Token>``

    Example Response JSON:
    .. sourcecode:: json

        {
            "filename": "ElaineWong.pdf",
        }


    :resjson filename: name of vaccination card file

    :status 200: File uploaded successfully
    :status 422: Not logged in

    """

    id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(id)})

    if ('vaccination' not in user):
        return jsonify({'filename': ''}), 200

    return jsonify({'filename': user['vaccination']}), 200


@vaccination_api.route('/', methods = ['GET'])
@jwt_required
def download():
    """Get the actual vaccination card file stored in S3. (though actually returns a link).

    :reqheader Authorization: ``Bearer <JWT Token>``

    :resjson url: temporary link generated by S3 where user can download file from
    :status 200: File uploaded successfully
    :status 422: Not logged in

    """

    id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(id)})

    if ('vaccination' not in user):
        return jsonify({'msg': 'no vaccination card uploaded!'}, 404)

    s3 = boto3.client('s3')
    object_name = 'vaccination/{}-{}'.format(id, user['vaccination'])

    url = s3.generate_presigned_url('get_object',
                                     Params={'Bucket': BUCKET, 'Key': object_name},
                                     ExpiresIn=600)
    return jsonify({'url': url})
