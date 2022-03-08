from util.decorators import check_admin
from db import db

from datetime import datetime

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required

events_api = Blueprint('events', __name__)


@events_api.route('/', methods=['GET'])
# @jwt_required
# @check_admin
def get():
    #  if not 'event_name' in request.args:
    #  return Response('Invalid request', status=400)
    cursor = db.events.find({})
    events = []

    for e in cursor:
        print(e)
        if 'start_date' and 'end_date' in request.args:
            if e['start_date'] >= request.args['start_date'] and e['end_date'] <= request.args['end_date']:
                if 'description' in e.args:
                    events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                                  'start_date': e['start_date'], 'end_date': e['end_date'], 'description': e['description']})
                else:
                    events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                                  'start_date': e['start_date'], 'end_date': e['end_date']})
        elif 'start_date' in request.args:
                if e['start_date'] >= request.args['start_date']:
                    if 'description' in e.args:
                        events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                                      'start_date': e['start_date'], 'end_date': e['end_date'], 'description': e['description']})
                    else:
                        events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                                      'start_date': e['start_date'], 'end_date': e['end_date']})
        elif 'end_date' in request.args:
                if e['end_date'] <= request.args['start_date']:
                    if 'description' in e.args:
                        events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                                      'start_date': e['start_date'], 'end_date': e['end_date'], 'description': e['description']})
                    else:
                        events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                                      'start_date': e['start_date'], 'end_date': e['end_date']})
        else:
            if 'description' in e:
                events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                              'start_date': e['start_date'], 'end_date': e['end_date'], 'description': e['description']})
            else:
                events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                              'start_date': e['start_date'], 'end_date': e['end_date']})

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

    if not (all(field in request.json for field in ['event_name', 'display_name', 'start_date', 'end_date'])):
        return Response('Invalid request', status=400)
    event = {}
    event['event_name'] = request.json['event_name']
        #'display_name': request.json['display_name'],
        #'start_date': request.json['start_date'],
        #'end_date': request.json['end_date']
    db.events.remove({})
    return jsonify({"msg": "event deleted"}), 200

