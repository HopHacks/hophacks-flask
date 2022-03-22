from util.decorators import check_admin
from db import db

from datetime import datetime

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required

events_api = Blueprint('events', __name__)


@events_api.route('/', methods=['GET'])
def get():
    start_date_beg = datetime.strptime(
        request.args['start_date_beg'], '%m-%d-%Y') if 'start_date_beg' in request.args else -1
    start_date_end = datetime.strptime(
        request.args['start_date_end'], '%m-%d-%Y') if 'start_date_end' in request.args else -1
    end_date_beg = datetime.strptime(
        request.args['end_date_beg'], '%m-%d-%Y') if 'end_date_beg' in request.args else -1
    end_date_end = datetime.strptime(
        request.args['end_date_end'], '%m-%d-%Y') if 'end_date_end' in request.args else -1

    args = {}

    if 'start_date_beg' in request.args:
        args['start_date'] = {'$gte': start_date_beg}
        if 'start_date_end' in request.args:
            args['start_date']['$lte'] = start_date_end
    elif 'start_date_end' in request.args:
        args['start_date'] = {'$lte': start_date_end}

    if 'end_date_beg' in request.args:
        args['end_date'] = {'$gte': end_date_beg}
        if 'end_date_end' in request.args:
            args['end_date']['$lte'] = end_date_end
    elif 'end_date_end' in request.args:
        args['end_date'] = {'$lte': end_date_end}

    cursor = db.events.find(args)

    events = []

    for e in cursor:
        events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                       'start_date': e['start_date'], 'end_date': e['end_date'], 'description': e['description']})

    return jsonify({'events': events}), 200


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
    event['start_date'] = datetime.strptime(
        request.json['start_date'], '%m-%d-%Y')
    event['end_date'] = datetime.strptime(request.json['end_date'], '%m-%d-%Y')
    event['num_registrations'] = 0
    event['event_participants'] = []
    if 'description' in request.json:
        event['description'] = request.json['description']
    else:
        event['description'] = ""
    db.events.insert_one(event)
    return jsonify({"msg": "event added"}), 200


@events_api.route('/', methods=['DELETE'])
# @jwt_required
# @check_admin
def delete_event():
    if (request.json is None):
        return Response('Data not in json format', status=400)

    if not (all(field in request.json for field in ['event_name', 'display_name'])):
        return Response('Invalid request', status=400)
    event = {}
    event['event_name'] = request.json['event_name']
    if len(list(db.events.find(event))) == 0:
        return Response('Event Does Not Exist', status=400)

    db.events.delete_one(event)
    return jsonify({"msg": "event deleted"}), 200


@events_api.route('/', methods=['PUT'])
# @jwt_required
# @check_admin
def update_event():
    if (request.json is None):
        return Response('Data not in json format', status=400)

    if not (all(field in request.json for field in ['event_name'])):
        return Response('Invalid request', status=400)

    event_current = {}
    event_current['event_name'] = request.json['event_name']

    if len(list(db.events.find(event_current))) == 0:
        return Response('Event Does Not Exist', status=400)

    for i in request.json:
        if i == 'new_event_name':
            continue
        if "date" in i:
            db.events.update_one(event_current, {"$set": {
                i: datetime.strptime(request.json[i], '%m-%d-%Y')}})
        else:
            db.events.update_one(event_current, {"$set": {
                i: request.json[i]}
            })
    if 'new_event_name' in request.json:
        db.events.update_one(
            event_current, {"$set": {'event_name': request.json['new_event_name']}})

    return jsonify({"msg": "event updated"}), 200
