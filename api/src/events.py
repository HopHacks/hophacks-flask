from contextlib import nullcontext
from util.decorators import check_admin
from db import db

from datetime import datetime

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required
from bson import ObjectId

events_api = Blueprint('events', __name__)

# Event names need to be in the format Title_Season_Year. This method
# enforces that and makes sure that everything is valid
def check_event_name(event_name):
    names = ['AlumniPanel', 'Hackathon', 'InterviewWorkshop']
    seasons = ['Fall', 'Winter', 'Spring', 'Summer']
    beg_year = 2007
    end_year = 2025

    params = event_name.split('_')
    if len(params) != 3:
      return False

    year = int(params[2])
    if (params[0] not in names) or (params[1] not in seasons) or (year < beg_year or year > end_year):
      return False

    return True


@events_api.route('/', methods=['GET'])
def get():
    start_date_beg = datetime.fromisoformat(
        request.args['start_date_beg']) if 'start_date_beg' in request.args else -1
    start_date_end = datetime.fromisoformat(
        request.args['start_date_end']) if 'start_date_end' in request.args else -1
    end_date_beg = datetime.fromisoformat(
        request.args['end_date_beg']) if 'end_date_beg' in request.args else -1
    end_date_end = datetime.fromisoformat(
        request.args['end_date_end']) if 'end_date_end' in request.args else -1

    # Build the args for the querying based on paraemeters provided
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

    # Query and build result
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

    if not (all(field in request.json for field in ['event_name', 'display_name', 'start_date', 'end_date', 'is_virtual'])):
        return Response('Invalid request', status=400)

    event = {}

    # Get event name and make sure its valid
    event['event_name'] = request.json['event_name']
    if not check_event_name(event['event_name']): return Response('Invalid event name', status=400)
    # TODO: do we want to fold the next line into check_event_name or keep check_event_name just for checking the validity of the string itself
    if len(list(db.events.find({'event_name': event['event_name']}))) != 0: return Response('Event name already exists', status=400)

    event['display_name'] = request.json['display_name']
    event['start_date'] = datetime.fromisoformat(request.json['start_date'])
    event['end_date'] = datetime.fromisoformat(request.json['end_date'])
    event['num_registrations'] = 0
    event['event_participants'] = []
    event['description'] = request.json['description'] if 'description' in request.json else None
    event['is_virtual'] = request.json['is_virtual']
    event['location'] = request.json['location'] if 'location' in request.json else None
    event['zoom_link'] = request.json['zoom_link'] if 'zoom_link' in request.json else None

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


@events_api.route('/addParticipant', methods=['POST'])
# @jwt_required
def add_participant():

    if not (all(field in request.json for field in ['event_name', 'user_id'])):
        return Response('Invalid request', status=400)

    event_name = request.json["event_name"]
    user_id = request.json["user_id"]

    event = {'event_name' : event_name}
    if len(list(db.events.find(event))) == 0:
        return Response('Event Does Not Exist', status=400)

    user = db.users.find_one({"_id": ObjectId(user_id)})
    record = {
      'user_id': user_id,
      'username': user['username'],
      'profile': user['profile'],
      'status': 'applied'
    }

    db.events.update_one(event, {'$push' : {'event_participants' : record}, '$inc': {'num_registrations': 1}})

    event_record = {
      'event_name': event_name,
      'status': 'applied'
    }
    
    db.users.update_one({"_id": ObjectId(user_id)}, {'$push' : {'registrations' : event_record}})

    return jsonify({"msg": "participant added"}), 200

@events_api.route('/update_status', methods=['PUT'])
# @jwt_required
def update_status():

    if not (all(field in request.json for field in ['event_name', 'user_id', 'status'])):
        return Response('Invalid request', status=400)

    event_name = request.json["event_name"]
    user_id = request.json["user_id"]
    status = request.json["status"]
    '''
    event = {'event_name' : event_name}
    if len(list(db.events.find(event))) == 0:
        return Response('Event Does Not Exist', status=400)

    user = db.users.find_one({"_id": ObjectId(user_id)})
    record = {
      'user_id': user_id,
      'username': user['username'],
      'profile': user['profile'],
      'status': 'applied'
    }

    db.events.update_one(event, {'$push' : {'event_participants' : record}, '$inc': {'num_registrations': 1}})

    event_record = {
      'event_name': event_name,
      'status': 'applied'
    }
    
    db.users.update_one({"_id": ObjectId(user_id)}, {'$push' : {'registrations' : event_record}})
    '''
    return jsonify({"msg": "registration updated"}), 200

@events_api.route('/getParticipants/<event>', methods=['GET'])
# @jwt_required
def get_participant(event):
    if event is None:
        return Response('Invalid request', status=400)
    
    args = {'event_name' : event}
    if len(list(db.events.find(args))) == 0:
        return Response('Event Does Not Exist', status=400)
    
    # Do not use hopkins_student in arguments (request.json) unless you only want Hopkins Students
    # If a user being a Hopkins student is irrelevant, just do not include "hopkins_student" in request.json 
    participants = []
    cursor = db.events.find(args)
    if 'hopkins_student' in request.args and 'reg_status' in request.args:
        for i in cursor:
            for j in i['event_participants']:
                if j['status'] == request.args['reg_status'] and j['profile']['is_jhu'] == True:
                    participants.append(j)
            break
    elif 'hopkins_student' in request.args:
        for i in cursor:
            for j in i['event_participants']:
                print(j['profile']['school'])
                if j['profile']['is_jhu'] == True:
                    participants.append(j)
            break
    elif 'reg_status' in request.args:
        for i in cursor:
            for j in i['event_participants']:
                if j['status'] == request.args['reg_status']:
                    participants.append(j)
            break
    else:
        for i in cursor:
            participants = i['event_participants']
            break
    return jsonify({'participants': participants}), 200

def remove_duplicates_from_list(random_list):
    res = []
    for i in random_list:
        if i not in res:
            res.append(i)
    return res

@events_api.route('/getParticipants', methods=['GET'])
# @jwt_required
def get_participant_by_date():
    start_date_beg = datetime.fromisoformat(
        request.args['start_date_beg']) if 'start_date_beg' in request.args else -1
    start_date_end = datetime.fromisoformat(
        request.args['start_date_end']) if 'start_date_end' in request.args else -1
    end_date_beg = datetime.fromisoformat(
        request.args['end_date_beg']) if 'end_date_beg' in request.args else -1
    end_date_end = datetime.fromisoformat(
        request.args['end_date_end']) if 'end_date_end' in request.args else -1

    # Build the args for the querying based on paraemeters provided
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

    # Query and build result
    cursor = db.events.find(args)

    if len(list(db.events.find(args))) == 0:
        return Response('No events occurred in this time frame', status=400)
    
    participants = []
    
    # Do not use hopkins_student in arguments (request.args) unless you only want Hopkins Students
    # If a user being a Hopkins student is irrelevant, just do not include "hopkins_student" in request.args
    
    if 'hopkins_student' in request.args:
        for i in cursor:
            for j in i['event_participants']:
                if j['profile']['is_jhu'] == True:
                    participants.append(j)
    else:
        for i in cursor:
            for j in i['event_participants']:
                participants.append(j)
    # Remove duplicate participants
    participants = remove_duplicates_from_list(participants)
    return jsonify({'participants': participants}), 200
