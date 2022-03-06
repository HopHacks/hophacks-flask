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
  #      return Response('Invalid request', status=400)
    cursor = db.events.find({ 'event_name': request.args['event_name']})
    events = []
    if 'start_date' and 'end_date' in request.args:
        for e in cursor:
            print(e)
            if e['start_date'] >= request.args['start_date'] and e['end_date'] <= request.args['end_date']:
                if 'description' in e.args:
                    events.append({'event_name':e['event_name'], 'display_name':e['display_name'], 'start_date':e['start_date'], 'end_date':e['end_date'], 'description':e['description']})
                 else:
                    events.append({'event_name':e['event_name'], 'display_name':e['display_name'], 'start_date':e['start_date'], 'end_date':e['end_date']})
    elif 'start_date' in request.args:
        print(e)
            if e['start_date'] >= request.args['start_date']:
                if 'description' in e.args:
                    events.append({'event_name':e['event_name'], 'display_name':e['display_name'], 'start_date':e['start_date'], 'end_date':e['end_date'], 'description':e['description']})
                 else:
                    events.append({'event_name':e['event_name'], 'display_name':e['display_name'], 'start_date':e['start_date'], 'end_date':e['end_date']})
    elif 'end_date' in request.args:
        print(e)
            if e['end_date'] <= request.args['start_date']:
                if 'description' in e.args:
                    events.append({'event_name':e['event_name'], 'display_name':e['display_name'], 'start_date':e['start_date'], 'end_date':e['end_date'], 'description':e['description']})
                 else:
                    events.append({'event_name':e['event_name'], 'display_name':e['display_name'], 'start_date':e['start_date'], 'end_date':e['end_date']})
    else:
        if 'description' in e.args:
            events.append({'event_name':e['event_name'], 'display_name':e['display_name'], 'start_date':e['start_date'], 'end_date':e['end_date'], 'description':e['description']})
        else:
            events.append({'event_name':e['event_name'], 'display_name':e['display_name'], 'start_date':e['start_date'], 'end_date':e['end_date']})    
    return jsonify({'events':events}), 200
