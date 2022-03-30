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

    """Checks to see if event names are properly formatted

    Example of valid event name: Hackation_Fall_2022
    Another Example of valid event name: AlumniPanel_Spring_2022

    :param event_name: String that is being checked
    :return: whether event_name is a valid event name

    """

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

    """Gets all events within a specified time frame

    :reqjson start_date_beg: Start date and time
    :reqjson start_date_end: Start date and time (used in conjunction with start_date_beg for one-day events)
    :reqjson end_date_beg: End date and time (used in conjunction with end_date_end potentially for one-date events)
    :reqjson end_date_end: End date and time 

    Example input:

    .. sourcecode:: json

    {
        "start_date_beg": "2022-09-22",
        "end_date_end": "2022-09-24"
    }

    :return: dictionary with key 'events' and the value is a list of all events within specified time frame

    :status 200: Successful

    """

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
                       'start_date': e['start_date'], 'end_date': e['end_date'], 'description': e['description'], 'is_virtual': e['is_virtual'],
                       'zoom_link': e['zoom_link'], 'location': e['location']})

    return jsonify({'events': events}), 200

@events_api.route('/<event_name>', methods=['GET'])
def get_event(event_name):

    """Gets an event based on the event's name.

    :param event_name: name that is being checked to see if it is associated with an event

    :return: the event as a dictionary with fields 'event_name', 'display_name', 'start_date', 'end_date', 'description', 'is_virtual', 'zoom_link', and 'location'

    :status 200: Successful
    :status 400: Event doesn't exist

    """

    e = db.events.find_one({"event_name": event_name})
    if e == None:
        return Response('Event does not exist', status=400)

    event = {'event_name': e['event_name'], 'display_name': e['display_name'],
                       'start_date': e['start_date'], 'end_date': e['end_date'], 'description': e['description'], 'is_virtual': e['is_virtual'],
                       'zoom_link': e['zoom_link'], 'location': e['location']}

    return jsonify(event), 200

    
@events_api.route('/', methods=['POST'])
@jwt_required
@check_admin
def create_event():

    """Creates an event.

    :reqjson event_name: event name
    :reqjson display_name: name of event displayed to general public
    :reqjson start_date: start date of event
    :reqjson end_date: end date of event
    :reqjson description: description of event (optional)
    :reqjson is_virtual: boolean string true/false saying whether event is virtual or in-person
    :reqjson location: location of event (optional)
    :reqjson zoom_link: zoom link of event (optional)

    Example input:

    .. sourcecode:: json

    {
        "event_name": "HopHacks_Fall_2022",
        "display_name": "HopHacks Fall 2022",
        "start_date": "2022-09-22",
        "end_date": "2022-09-24",
        "description": "36 hour hackathon for college students",
        "is_virtual": "true"
    }

    :status 200: Event added
    :status 400: Error with request
    
    """

    if (request.json is None):
        return Response('Data not in json format', status=400)

    if not (all(field in request.json for field in ['event_name', 'display_name', 'start_date', 'end_date', 'is_virtual'])):
        return Response('Invalid request', status=400)

    event = {}

    # Get event name and make sure its valid
    event['event_name'] = request.json['event_name']
    if not check_event_name(event['event_name']):
        return Response('Invalid event name', status=400)
    # TODO: do we want to fold the next line into check_event_name or keep check_event_name just for checking the validity of the string itself
    if len(list(db.events.find({'event_name': event['event_name']}))) != 0:
        return Response('Event name already exists', status=400)

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
@jwt_required
@check_admin
def delete_event():

    """Deletes an event.

    :reqjson event_name: event name
    :reqjson display_name: name of event displayed to general public

    Example input:

    .. sourcecode:: json

    {
        "event_name": "HopHacks_Fall_2022",
    }

    :status 200: Event deleted
    :status 400: Error with request or operation
    
    """

    if (request.json is None):
        return Response('Data not in json format', status=400)

    if not (all(field in request.json for field in ['event_name'])):
        return Response('Invalid request', status=400)
    event = {}
    event['event_name'] = request.json['event_name']
    if len(list(db.events.find(event))) == 0:
        return Response('Event Does Not Exist', status=400)

    db.events.delete_one(event)
    return jsonify({"msg": "event deleted"}), 200

    
@events_api.route('/', methods=['PUT'])
@jwt_required
@check_admin
def update_event():

    """Updates an event.

    :reqjson event_name: event name
    :reqjson new_event_name: new event name that event_name is being changed to (optional)
    :reqjson display_name: new name of event displayed to general public (optional)
    :reqjson start_date: new start date of event (optional)
    :reqjson end_date: new end date of event (optional)
    :reqjson description: new description of event (optional)
    :reqjson is_virtual: new boolean string true/false saying whether event is virtual or in-person (optional)
    :reqjson location: new location of event (optional)
    :reqjson zoom_link: new zoom link of event (optional)

    Example input:

    .. sourcecode:: json

    {
        "event_name": "HopHacks_Fall_2022",
        "new_event_name": "Hophacks_Fall_2023"
    }

    :status 200: Event updated
    :status 400: Error with request or update operation

    """

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
        if not check_event_name(request.json['event_name']):
            return Response('Invalid new_event_name', status=400)
        db.events.update_one(
            event_current, {"$set": {'event_name': request.json['new_event_name']}})

    return jsonify({"msg": "event updated"}), 200

    
@events_api.route('/addParticipant', methods=['POST'])
@jwt_required
def add_participant():

    """Adds a participant to an event.

    :reqjson event_name: event name
    :reqjson user_id: the object ID of the user in the database

    Example input:

    .. sourcecode:: json

    {
        "event_name": "HopHacks_Fall_2022",
        "user_id": "623e2e52eebe994953ba2f84"
    }
    
    :status 200: Participant added
    :status 400: Error with request or event doesn't exist

    """

    if not (all(field in request.json for field in ['event_name', 'user_id'])):
        return Response('Invalid request', status=400)

    event_name = request.json["event_name"]
    user_id = request.json["user_id"]

    event = {'event_name': event_name}
    if len(list(db.events.find(event))) == 0:
        return Response('Event Does Not Exist', status=400)

    user = db.users.find_one({"_id": ObjectId(user_id)})
    if user == None:
        return Response('Event Does Not Exist', status=400) 
    record = {
        'user_id': user_id,
        'username': user['username'],
        'profile': user['profile'],
        'status': 'applied'
    }

    db.events.update_one(event, {'$push': {'event_participants': record}, '$inc': {
                         'num_registrations': 1}})

    event_record = {
        'event_name': event_name,
        'status': 'applied'
    }

    db.users.update_one({"_id": ObjectId(user_id)}, {
                        '$push': {'registrations': event_record}})

    return jsonify({"msg": "participant added"}), 200


    

@events_api.route('/update_status', methods=['PUT'])
@jwt_required
def update_status():

    """Updates the registration status of a user

    :reqjson event_name: event name
    :reqjson user_id: the object ID of the user in the database
    :status: the new registration status of the user for this event

    Example input:

    .. sourcecode:: json

    {
        "event_name": "HopHacks_Fall_2022",
        "user_id": "623e2e52eebe994953ba2f84",
        "status": "rsvp"
    }

    :status 200: Registration status updated
    :status 400: Invalid request or registration does not exist

    """

    if not (all(field in request.json for field in ['event_name', 'user_id', 'status'])):
        return Response('Invalid request', status=400)

    event_name = request.json['event_name']
    user_id = request.json['user_id']
    status = request.json['status']

    if status not in ['applied', 'rsvp', 'canceled']:
        return Response('Invalid request', status=400)


    # Update event record
    event_query = {'event_name': event_name}
    event = db.events.find_one(event_query)
    if event == None:
        return Response('Event Does Not Exist', status=400)
    registrations = event['event_participants']
    found = False
    for i in range(len(registrations)):
        user = registrations[i]
        if user['user_id'] == user_id:
            found = True
            registrations[i]['status'] = status

    if not found:
        return Response('Registration Does Not Exist', status=400)

    db.events.update_one({
        'event_name': event_name,
    },
        {
            '$set': {'event_participants': registrations}
    }
    )

    # Update user record
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if user == None:
        return Response('Event Does Not Exist', status=400)

    registrations = user['registrations']
    found = False
    for i in range(len(registrations)):
        event = registrations[i]
        if event['event_name'] == event_name:
            found = True
            registrations[i]['status'] = status

    if not found:
        return Response('Registration Does Not Exist', status=400)
    db.users.update_one({"_id": ObjectId(user_id)},
        {
            '$set': {'registrations': registrations}
        } 
    )

    return jsonify({"msg": "registration updated"}), 200

@events_api.route('/getRegistrations/', methods=['GET'])
@jwt_required
def get_registrations():

    """Get all events that a user has registered for.

    :reqjson user_id: the object ID of the user in the database

    Example input:

    .. sourcecode:: json

    {
        "user_id": "623e2e52eebe994953ba2f84"
    }

    :return: list of all events user has registered for

    :status 200: Registrations returned successfully
    :status 400: Invalid request

    """

    if 'user_id' not in request.args:
        return Response('Invalid request', status=400)

    user_id = request.args['user_id']
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if user == None:
        return Response('Invalid request', status=400)
    registrations = user['registrations']

    return jsonify(registrations)


@events_api.route('/getParticipants/<event>', methods=['GET'])
@jwt_required
def get_participant(event):

    """Get all participants for a specific event.

    :param event_name: event name

    :reqjson hopkins_student: Used if and only if ONLY Hopkins students should be returned
    :reqjson reg_status: registration status of users being returned

    Example input:

    .. sourcecode:: json

    {
        "hopkins_student": "ye",
        "reg_status": "rsvp"
    }

    Both hopkins_student and reg_status are essentially search filters

    :return: dictionary with 'participants' as key and value as list of all participants of the event

    :status 200: list of all participants is returned successfully
    :status 400: Invalid request or event does not exist

    """

    if event is None:
        return Response('Invalid request', status=400)

    args = {'event_name': event}
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
    """Removes duplicates from a list

    :param random_list: List that duplicates will be removed from
    :return: list without any duplicate values

    """
    res = []
    user_ids = set()
    for i in random_list:
        if i["user_id"] not in user_ids:
            res.append({"profile": i["profile"], "username": i["username"]})
            user_ids.add(i["user_id"])
    return res


@events_api.route('/getParticipants', methods=['GET'])
@jwt_required
def get_participant_by_date():

    """Gets all participants within a certain time frame

    :reqjson start_date_beg: Start date and time
    :reqjson start_date_end: Start date and time (used in conjunction with start_date_beg for one-day events)
    :reqjson end_date_beg: End date and time (used in conjunction with end_date_end potentially for one-date events)
    :reqjson end_date_end: End date and time 

    Example input:

    .. sourcecode:: json

    {
        "start_date_beg": "2022-09-22",
        "end_date_end": "2022-09-24"
    }

    :status 200: Successful
    :status 400: No events in timeframe

    """
    
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
