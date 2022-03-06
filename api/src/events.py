from tabnanny import check
from util.decorators import check_admin
from db import db

from datetime import datetime

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required

events_api = Blueprint('events', __name__)


@events_api.route('/', methods=['GET'])
def get():
    return jsonify("helllo"), 200


@events_api.route('/', methods=['POST'])
# @jwt_required
# @check_admin
def create_event():
    if (request.json is None):
        return Response('Data not in json format', status=400)

    if not (all(field in request.json for field in ['event_name', 'display_name', 'start_date', 'end_date'])):
        return Response('Invalid request', status=400)

    event = {}

    event['event_name'] = request.json['event_name']
    event['display_name'] = request.json['display_name']
    event['start_date'] = datetime.strptime(request.json['start_date'], '%m-%d-%Y')
    event['end_date'] = datetime.strptime(request.json['end_date'], '%m-%d-%Y')
    if 'description' in request.json:
        event['description'] = request.json['description']
    else:
        event['description'] = ""

    db.events.insert_one(event)

    return jsonify({"msg": "event added"}), 200
