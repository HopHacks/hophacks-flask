from util.decorators import check_admin
from db import db

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from pymongo import MongoClient

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
    page_num = int(request.args.get("page_num"))
    status = request.args.get("status")
    # Calculate number of documents to skip
    skips = 20 * (page_num - 1)

    cursor  = db.users.find({ "$or": [{"username" : {"$regex" : ".*"+query+".*", "$options" : "i"}}, {"profile.first_name": {"$regex" : ".*"+query+".*", "$options" : "i"}}, {"profile.first_name": {"$regex" : ".*"+query+".*", "$options" : "i"}}]})

    totalPage = int((cursor.count()-1)/20) + 1

    # Skip and limit
    cursor = cursor.skip(skips).limit(20)
    
    

    users = []
    
    for document in cursor:
        print(document)
        if not document['is_admin']:
            users.append({'id': str(document['_id']), 'profile': document['profile'], 'email_confirmed': document['email_confirmed'], 'registrations': document['registrations']})
        


    return {'users': users, 'totalPage': totalPage}, 200

@admin_api.route('/create_announcement', methods = ['POST'])
def create_announcement():
    if (request.json is None):
        return Response('Data not in json format', status=400)
    title = request.json['title']
    body = request.json['body']

    with MongoClient("mongodb://localhost:27017") as client:
        db = client['hophacks']
        db.announcements.insert_one({
            'title': title,
            'body': body
        })
    return jsonify({"msg": "user added"}), 200

@admin_api.route('/get_announcement', methods = ['GET'])
def get_announcement():
    myCursor = db.announcements.find()#.forEach()
   for i in myCursor:
       print(myCursor)       
    # if (request.json is None):
    #     return Response('Data not in json format', status=400)
    # title = request.json['title']
    # body = request.json['body']

    # with MongoClient("mongodb://localhost:27017") as client:
    #     db = client['hophacks']
        # db.announcements.insert_one({
        #     'title': title,
        #     'body': body
        # })
    # return jsonify({"msg": "user added"}), 200

# get all the titles / bodies from mongodb
# create html cards for each of them
