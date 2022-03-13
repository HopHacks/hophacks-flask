'''
Endpoints related to creating and displaying anouncements 
'''

from pickle import TRUE
from db import db
from mail import mail
from util.reset_tokens import *
from util.decorators import check_admin

from flask import Blueprint, request, Response, current_app, render_template, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from registrations import send_apply_confirm

import bcrypt
import jwt
import json
from datetime import datetime
from bson import ObjectId
import pytz


announcements_api = Blueprint('announcements', __name__)

@announcements_api.route('/', methods = ['POST'])
@jwt_required
@check_admin
def create():
    """ 
    Create a new announcement (only Admin)

    Announcement fields:
    input:
        title: string 
        content: string
        event: string
        broadcast: list of boolean
            "website, slack, discord, email"
        importance: boolean
    noninput: 
        time -- get current time
        sender -- get current user
        
    Example input:

    .. sourcecode:: json
        {
            "title": "Title 12345",
            "content": "This is the content, the content, the content.",
            "event": "Spring 2022",
            "broadcast": [true,false,false,false],
            "importance": true
        }

    :status 200: Anouncement was added
    :status 400: No json or ``announcement/json`` header, or field missing
    :status 401: Need admin access
    :status 409: Anouncement alreay exists
    :status 422: Not logged in
    """

    if (request.json is None):
        return Response('Data not in json format', status=400)

    if not (all(field in request.json for field in ['title','content','event','broadcast','importance'])):
        return Response('Invalid request', status=400)

    title = request.json['title']
    content = request.json['content']
    event = request.json['event']
    broadcast = request.json['broadcast']
    importance = request.json['importance']
    id = get_jwt_identity()
    sender = db.users.find_one({'_id': ObjectId(id)})["username"]
    time = datetime.utcnow()

    db.announcements.insert_one({
        "title": title,
        "content": content,
        "event": event,
        "broadcast": broadcast,
        "importance": importance,
        "sender": sender,
        "time": time,
    })
    return jsonify({"msg": "announcement added"}), 200

@announcements_api.route('/', methods = ['GET'])
def display_all():
    """ 
    Display all announcements in the given event sorted by the time posted

    Example input:

    .. sourcecode:: json
        {
            "event": "Spring 2022"
        }

    :status 400: No json or ``announcement/json`` header, or field missing
    :status 200: display successful
    """
    # if (request.json is None):
    #     return Response('Data not in json format', status=400)

    # if not (all(field in request.json for field in ['event'])):
    #     return Response('Invalid request', status=400)

    # event = request.json['event']

    event = request.args.get('event')
    if not event:
        return Response('Invalid request', status=400)

    cursor = db.announcements.find({'event': event}).sort("time", -1)
    announcemnets = []
    for annouc in cursor:
        announcemnets.append({
            'title': annouc['title'], 
            'content': annouc['content'], 
            'event': annouc['event'], 
            'broadcast': annouc['broadcast'],
            'importance': annouc['importance'], 
            'sender': annouc['sender'],
            'time': annouc['time']
            })
  
    return jsonify({'announcemnets': announcemnets}), 200

@announcements_api.route('/important', methods = ['GET'])
def display_first_important():
    """ 
    Display the first important announcements in the given event sorted by the time posted

    Example input:

    .. sourcecode:: json
        {
            "event": "Spring 2022"
        }

    :status 400: No json or ``announcement/json`` header, or field missing
    :status 200: display successful
    """
    event = request.args.get('event')
    if not event:
        return Response('Invalid request', status=400)

    cursor = db.announcements.find({'event': event,'importance': True}).sort("time", -1)
    announcement = {}
    annouc = cursor[0]
    announcement['title'] = annouc['title']
    announcement['content'] = annouc['content']
    announcement['event'] = annouc['event']
    announcement['broadcast'] = annouc['broadcast']
    announcement['importance'] = annouc['importance']
    announcement['sender'] = annouc['sender']
    announcement['time'] = annouc['time']
  
    return jsonify(announcement), 200

@announcements_api.route('/recent', methods = ['GET'])
def display_three_recent():
    """ 
    Display the first three recent announcements in the given event sorted by the time posted
    NOTICE: this will not include the most recent & important announcement

    NOTICE: if there is less than three target announcements in the data base, the function can return a list contianing less than three announcements

    Example input:

    .. sourcecode:: json
        {
            "event": "Spring 2022"
        }

    :status 400: No json or ``announcement/json`` header, or field missing
    :status 200: display successful
    """
    event = request.args.get('event')
    if not event:
        return Response('Invalid request', status=400)

    cursor = db.announcements.find({'event': event}).sort("time", -1)
    announcements = []
    passed_first_important = False
    for annouc in cursor:
        if(len(announcements) >= 3):
            break
        if(not passed_first_important and annouc['importance']):
            passed_first_important = True
            continue
        announcements.append({
            'title': annouc['title'], 
            'content': annouc['content'], 
            'event': annouc['event'], 
            'broadcast': annouc['broadcast'],
            'importance': annouc['importance'], 
            'sender': annouc['sender'],
            'time': annouc['time']
            })
  
    return jsonify({'announcemnets': announcements}), 200

@announcements_api.route('/history', methods = ['GET'])
def display_history():
    """ 
    Display the history announcements in the given event sorted by the time posted
    NOTICE: not include the first_important announcement and the three_recent accouncements

    Example input:

    .. sourcecode:: json
        {
            "event": "Spring 2022"
        }

    :status 400: No json or ``announcement/json`` header, or field missing
    :status 200: display successful
    """
    event = request.args.get('event')
    if not event:
        return Response('Invalid request', status=400)

    cursor = db.announcements.find({'event': event}).sort("time", -1)
    announcements = []
    passed_first_important = False
    passed_recent = 0
    for annouc in cursor:
        if(not passed_first_important and annouc['importance']):
            passed_first_important = True
            continue
        elif(passed_recent < 3):
            passed_recent = passed_recent + 1
        else:
            announcements.append({
                'title': annouc['title'], 
                'content': annouc['content'], 
                'event': annouc['event'], 
                'broadcast': annouc['broadcast'],
                'importance': annouc['importance'], 
                'sender': annouc['sender'],
                'time': annouc['time']
                })
    
    return jsonify({'announcemnets': announcements}), 200
