
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
        importance: boolean
    noninput: 
        creator -- get current user
        created_time -- get current time
        updator -- same as creator 
        updated_time -- same as created_time
    Example input:
    .. sourcecode:: json
        {
            "title": "Title 12345",
            "content": "This is the content, the content, the content.",
            "event": "Spring 2022",
            "importance": true
        }
    :status 200: Anouncement was added
    :status 400: No json or ``announcement/json`` header, or field missing
    :status 401: Need admin access
    :status 422: Not logged in
    """
    if (request.json is None):
        return Response('Data not in json format', status=400)
    if not (all(field in request.json for field in ['title','content','event','importance'])):
        return Response('Invalid request', status=400)
    title = request.json['title']
    content = request.json['content']
    event = request.json['event']
    importance = request.json['importance']
    id = get_jwt_identity()
    creator = db.users.find_one({'_id': ObjectId(id)})["username"]
    created_time = str(datetime.utcnow())
    
    db.announcements.insert_one({
        "title":title,
        "event": event,
        "content":content,
        "importance": importance,
        "creator": creator,
        "created_time": created_time,
        "updator": creator,
        "updated_time": created_time
    })
    return jsonify({"msg": "announcement added"}), 200
@announcements_api.route('/update', methods = ['PUT'])
@jwt_required
@check_admin
def update():
    """ 
    Update an existing announcement (only Admin)
    Example input:
    .. sourcecode:: json
        {
            "filter": {"creator": "user123", "created_time": "2022-06-02T02:39:43.613+00:00"},
            "title": "Title 12345",
            "content": "This is the content, the content, the content.",
            "event": "Spring 2022",
            "importance": true
        }
    :status 200: Anouncement was updated
    :status 400: No json or ``announcement/json`` header, or field missing
    :status 401: Need admin access
    :status 409: Anouncement doesn't exists or Multiple Announcements are filtered
    :status 422: Not logged in
    :status 404: Invalid request
    """
    if (request.json is None):
        return Response('Data not in json format', status=400)
    if not (all(field in request.json for field in ['filter','title','content','event','importance'])):
        return Response('Invalid request', status=400)
    
    filter = request.json['filter']
    
    if len(list(db.announcements.find(filter))) == 0 :
        return Response('Announcement Does Not Exist', status=409)
    elif len(list(db.announcements.find(filter))) != 1 :
        return Response('Multiple Announcements with the same title exist', status=409)
    title = request.json['title']
    content = request.json['content']
    event = request.json['event']
    importance = request.json['importance']
    updator_id = get_jwt_identity()
    updator = db.users.find_one({'_id': ObjectId(updator_id)})["username"]
    updated_time = str(datetime.utcnow())
    
    try:
        db.announcements.update_one(
        filter,
        {'$set': {
            "title":title,
            "event": event,
            "content":content,
            "importance": importance,
            "updator": updator,
            "updated_time": updated_time,
        }}
        )
    except:
        return Response('Invalid request', status=404)
    
    return Response('Announcement updated', status=200)
@announcements_api.route('/', methods = ['GET'])
def display_all():
    """ 
    Display all announcements in all events sorted by the created_time
    :status 200: display successful
    """
    cursor = db.announcements.find().sort("created_time", -1)
    announcements = []
    for annouc in cursor:
        announcements.append({
            'title': annouc['title'], 
            'content': annouc['content'], 
            'event': annouc['event'], 
            'importance': annouc['importance'], 
            'creator': annouc['creator'],
            'created_time': annouc['created_time'],
            'updator': annouc['updator'],
            'updated_time': annouc['updated_time'],
            })
  
    return jsonify({'announcements': announcements}), 200
@announcements_api.route('/event', methods = ['GET'])
def display_all_in_event():
    """ 
    Display all announcements in the given event sorted by the  created_time
    :status 400: No json or ``announcement/json`` header, or field missing
    :status 200: display successful
    """
    event = request.args.get('event')
    if not event:
        return Response('Invalid request', status=400)
    cursor = db.announcements.find({'event': event}).sort("created_time", -1)
    announcements = []
    for annouc in cursor:
        announcements.append({
            'title': annouc['title'], 
            'content': annouc['content'], 
            'event': annouc['event'], 
            'importance': annouc['importance'], 
            'creator': annouc['creator'],
            'created_time': annouc['created_time'],
            'updator': annouc['updator'],
            'updated_time': annouc['updated_time'],
            })
  
    return jsonify({'announcements': announcements}), 200
@announcements_api.route('/important', methods = ['GET'])
def display_first_important():
    """ 
    Display the first important announcements in the given event sorted by the created_time
    request.args: event
    :status 400: No json or ``announcement/json`` header, or field missing
    :status 200: display successful
    """
    event = request.args.get('event')
    if not event:
        return Response('Invalid request', status=400)
    cursor = db.announcements.find({'event': event,'importance': True}).sort("created_time", -1)
    announcement = {}
    annouc = cursor[0]
    announcement['title'] = annouc['title']
    announcement['content'] = annouc['content']
    announcement['event'] = annouc['event']
    announcement['importance'] = annouc['importance']
    announcement['creator'] = annouc['creator']
    announcement['created_time'] = annouc['created_time']
    announcement['updator'] = annouc['updator']
    announcement['updated_time'] = annouc['updated_time']
    return jsonify(announcement), 200
@announcements_api.route('/recent', methods = ['GET'])
def display_three_recent():
    """ 
    Display the first three recent announcements in the given event sorted by the created_time
    NOTICE: this will not include the most recent & important announcement
    NOTICE: if there is less than three target announcements in the data base, the function can return a list contianing less than three announcements
    request.args: event
    :status 400: No json or ``announcement/json`` header, or field missing
    :status 200: display successful
    """
    event = request.args.get('event')
    if not event:
        return Response('Invalid request', status=400)
    cursor = db.announcements.find({'event': event}).sort("created_time", -1)
    announcements = []
    passed_first_important = False
    for annouc in cursor:
        if(len(announcements) >= 4):
            break
        if(not passed_first_important and annouc['importance']):
            passed_first_important = True
            continue
        announcements.append({
            'title': annouc['title'], 
            'content': annouc['content'], 
            'event': annouc['event'],
            'importance': annouc['importance'], 
            'creator': annouc['creator'],
            'created_time': annouc['created_time'],
            'updator': annouc['updator'],
            'updated_time': annouc['updated_time'],
            })
  
    return jsonify({'announcements': announcements}), 200
@announcements_api.route('/history', methods = ['GET'])
def display_history():
    """ 
    Display the history announcements in the given event sorted by the created_time
    NOTICE: not include the first_important announcement and the three_recent accouncements
    request.args: event
    :status 400: No json or ``announcement/json`` header, or field missing
    :status 200: display successful
    """
    event = request.args.get('event')
    if not event:
        return Response('Invalid request', status=400)
    cursor = db.announcements.find({'event': event}).sort("created_time", -1)
    announcements = []
    passed_first_important = False
    passed_recent = 0
    for annouc in cursor:
        if(not passed_first_important and annouc['importance']):
            passed_first_important = True
            continue
        elif(passed_recent < 4):
            passed_recent = passed_recent + 1
        else:
            announcements.append({
                'title': annouc['title'], 
                'content': annouc['content'], 
                'event': annouc['event'], 
                'importance': annouc['importance'], 
                'creator': annouc['creator'],
                'created_time': annouc['created_time'],
                'updator': annouc['updator'],
                'updated_time': annouc['updated_time'],
                })
    
    return jsonify({'announcements': announcements}), 200
@announcements_api.route('/titles', methods = ['GET'])
def getAllTitles():
    """ 
    Display the titles of all announcementssorted by the created_time
    Example input:
    .. sourcecode:: json
        {
            "event": "Spring 2022"
        }
    :status 200: display successful
    """
    cursor = db.announcements.find().sort("created_time", -1)
    announcements = []
    passed_first_important = False
    passed_recent = 0
    for annouc in cursor:
        announcements.append({
            'title': annouc['title'], 
            })
    return jsonify({'announcements': announcements}), 200
@announcements_api.route('/', methods = ['DELETE'])
@jwt_required
@check_admin
def deleteAnnouncements():
    """ 
    Delete the announcement with a specific title specified by the admin
    Example input:
    .. sourcecode:: json
        {
            "title": "free pizza"
        }
    :status 200: successfully deleted
    """
    title = request.json['title']
    announcement = {'title' : title}
    
    if len(list(db.announcements.find(announcement))) == 0 :
        return Response('Event Does Not Exist', status=404)
    try:
        db.announcements.delete_one(announcement)
    except:
        return Response('Invalid request', status=400)
    return Response('Successfully deleted', status=200)
    