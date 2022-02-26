from util.decorators import check_admin
from db import db

from datetime import datetime

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required

events_api = Blueprint('events', __name__)

@events_api.route('/announcement', methods=['POST'])
@jwt_required
@check_admin
def create_announcement():
    if (request.json is None):
        return Response('Data not in json format', status=400)

    if not (all(field in request.json for field in ['event', 'announcement'])):
      return Response('Invalid request', status=400)

    event = request.json['event']
    announcement = request.json['announcement']
    created_time = datetime.now()

    db.announcements.insert_one({
      'event': event,
      'announcement': announcement,
      'created_time': created_time,
    })
    return jsonify({"msg": "announcement added"}), 200

'''
@events_api.route('/announcement', methods=['GET'])
def get_announcements():
'''