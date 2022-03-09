'''
Endpoints related to creating and displaying anouncements 
'''

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
import datetime
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

    if not (all(field in request.json for field in ['title'])):
        return Response('Invalid request', status=400)

    title = request.json['title']
    content = request.json['content']
    event = request.json['event']
    broadcast = request.json['broadcast']
    importance = request.json['importance']
    id = get_jwt_identity()
    sender = db.users.find_one({'_id': ObjectId(id)})
    time = datetime.datetime.utcnow()

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
    Display all announcements sorted by the time posted

    Example reponse:

    .. sourcecode:: json

        {
            "exist": False
        }

    :status 200: display successful
    """
    
    list_a = []
    for a in (db.announcements.find()):
        list_a.append({"username":a["username"]})
        list_a.append({"time_posted":a["time_posted"]})
        list_a.append({"title":a["title"]})
        list_a.append({"contents":a["contents"]})
    

    return jsonify(announcements = list_a),200

