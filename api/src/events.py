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
                                  'start_date': e['start_date'], 'end_date': e['end_date'], 'description': e['description'],
                                   'num_registrations': e['num_registrations'], 'event_participants': e['event_participants']})
                else:
                    events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                                  'start_date': e['start_date'], 'end_date': e['end_date'],
                                  'num_registrations': e['num_registrations'], 'event_participants': e['event_participants']})
        elif 'start_date' in request.args:
            if e['start_date'] >= request.args['start_date']:
                if 'description' in e.args:
                    events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                                  'start_date': e['start_date'], 'end_date': e['end_date'], 'description': e['description'],
                                  'num_registrations': e['num_registrations'], 'event_participants': e['event_participants']})
                else:
                    events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                                  'start_date': e['start_date'], 'end_date': e['end_date'],
                                  'num_registrations': e['num_registrations'], 'event_participants': e['event_participants']})
        elif 'end_date' in request.args:
            if e['end_date'] <= request.args['start_date']:
                if 'description' in e.args:
                    events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                                  'start_date': e['start_date'], 'end_date': e['end_date'], 'description': e['description'],
                                  'num_registrations': e['num_registrations'], 'event_participants': e['event_participants']})
                else:
                    events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                                  'start_date': e['start_date'], 'end_date': e['end_date'],
                                  'num_registrations': e['num_registrations'], 'event_participants': e['event_participants']})
        else:
            if 'description' in e:
                events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                              'start_date': e['start_date'], 'end_date': e['end_date'], 'description': e['description'],
                              'num_registrations': e['num_registrations'], 'event_participants': e['event_participants']})
            else:
                events.append({'event_name': e['event_name'], 'display_name': e['display_name'],
                              'start_date': e['start_date'], 'end_date': e['end_date'],
                              'num_registrations': e['num_registrations'], 'event_participants': e['event_participants']})

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

    cursor = db.events.find(event_current)
    if 'display_name' in request.json:
        db.events.update_one(event_current, {"$set": {
            'display_name': request.json['display_name']}
        })
    if 'start_date' in request.json:
        db.events.update_one(event_current, {"$set": {
            'start_date': datetime.strptime(request.json['start_date'], '%m-%d-%Y')}
        })
    if 'end_date' in request.json:
        db.events.update_one(event_current, {"$set": {
            'end_date': datetime.strptime(request.json['end_date'], '%m-%d-%Y')}
        })
    if 'description' in request.json:
        db.events.update_one(event_current, {"$set": {
            'description': request.json['description']}
        })

    # These two fields may be deleted, as they technically shouldn't need to ever be altered
    if 'num_registrations' in request.json:
        db.events.update_one(event_current, {"$set": {
            'num_registrations': request.json['num_registrations']}
        })
    if 'event_participants' in request.json:
        db.events.update_one(event_current, {"$set": {
            'event_participants': request.json['event_participants']}
        })

    if 'new_event_name' in request.json:
        db.events.update_one(event_current, {"$set": {
            'event_name': request.json['new_event_name']}
        })
    return jsonify({"msg": "event updated"}), 200
