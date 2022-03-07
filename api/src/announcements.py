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


events_api = Blueprint('announcements', __name__)

@events_api.route('/', methods = ['POST'])
@jwt_required
@check_admin
def create():
    """ 
    Create a new announcement (only Admin)

    Example input:

    .. sourcecode:: json

        {
            "username": "awong@jhu.edu",
            "time_posted": "2022-02-25",
            "title": "This Is The Title",
            "contents": "This is some contents, some contents, and some contents."
        }

    :status 200: Anouncement was added
    :status 400: No json or ``announcement/json`` header, or field missing
    :status 401: Need admin access
    :status 409: Anouncement alreay exists
    :status 422: Not logged in
    """

    if (request.json is None):
        return Response('Data not in json format', status=400)

    if not (all(field in request.json for field in ['username', 'time_posted', 'title', 'contents'])):
        return Response('Invalid request', status=400)

    username = request.json['username']
    time_posted = request.json['time_posted']
    title = request.json['title']
    contents = request.json['contents']


    if (db.announcements.find_one({'title': title})):
        return Response('Announcement with the same title already exists!', status=409)

    db.announcements.insert_one({
        "username": username,
        "time_posted": time_posted,
        "title": title,
        "contents": contents
    })
    return jsonify({"msg": "announcement added"}), 200

@events_api.route('/', methods = ['GET'])
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

