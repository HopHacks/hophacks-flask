'''
Endpoints related to users' team 
'''

from db import db
from mail import mail
from util.decorators import check_admin

from flask import Blueprint, request, Response, render_template, jsonify, Flask, flash
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message, Mail
from bson import ObjectId

import datetime

teams_api = Blueprint('teams', __name__)

@teams_api.route('/', methods = ['POST'])
@jwt_required
def create():
    """ 
    Create a new team (only users)
    team fields:
    input:
        team_name: string 
        event: string
        team_information: string
        status: string
    non-input: 
        team_admin: Hophacks2023@gmail.com
        team_members: [], empty after creating


    Example input:
    .. sourcecode:: json
        {
            "team_name": "Hophacks",
            "team_members": []
            "event": "Hophacks 2023",
            "team_information": "Want to build a DL project, look for 3 teammates",
            "status": "open"
        }

    :status 200: Team was added
    :status 400: No json or ``team/json`` header, or field missing
    :status 422: Not logged in
    """
    if (request.json is None):
        return Response('Data not in json format', status=400)
    if not (all(field in request.json for field in ['team_name','event', 'team_information', 'status'])):
        return Response('Invalid request', status=400)
    
    id = get_jwt_identity()
    user = db.users.find_one({'_id' : ObjectId(id)})
    
    team_admin = user['username']
    team_name = request.json['team_name']
    event = request.json['event']
    team_information = request.json['team_information']
    status = request.json['status']

    # team name must be unique for one user
    teams = db.teams.find_one({"team_name": team_name, "team_admin": team_admin}) 
    if (teams is not None): 
        return jsonify({"msg": "Team Exists Under This User"}), 401

    
    db.teams.insert_one({
        "team_name":team_name,
        "team_admin": team_admin,
        "team_members": [],
        "event": event,
        "team_information": team_information,
        "status": status,
    })
    return jsonify({"msg": "team added"}), 200



@teams_api.route('/', methods = ['DELETE'])
@jwt_required
def delete():
    """ 
    delete a team (only team admin)
    team fields:
    input:
        team_name: string 
    non-input
        team_admin: string

    Example input:
    .. sourcecode:: json
        {
            "team_name": "Hophacks",
            "team_admin": "Hophacks2023@gmail.com"
        }

    :status 200: Team was deleted
    :status 400: No json or ``team/json`` header, or field missing
    :status 401: Not team exists
    :status 402: Not the admin for the group
    :status 422: Not logged in
    """
    if (request.json is None):
        return Response('Data not in json format', status=400)
    if not (all(field in request.json for field in ['team_name'])):
        return Response('Invalid request', status=400)

    id = get_jwt_identity()
    user = db.users.find_one({'_id' : ObjectId(id)})

    team_name = request.json['team_name']
    team_admin = user['username']

    teams = db.teams.find_one({"team_name": team_name, "team_admin": team_admin}) 
    if (teams is None):
        return jsonify({"msg": "Deletion Failed"}), 401

    result = db.teams.delete_one({'team_name': team_name, "team_admin": team_admin})

    if (result.deleted_count == 0):
        return jsonify({"msg": "Deletion Failed in DB"}), 404

    return jsonify({"msg": "deleted successfully"}), 200



@teams_api.route('/join', methods = ['PUT'])
@jwt_required
def join():
    """ 
    join a team
    team fields:
    input:
        team_id: string 
        team_admin: string
    
    non-input:
        NONE    

    Example input:
    .. sourcecode:: json
        {
            "team_name": "Hophacks",
            "team_admin": "Hophacks2023@gmail.com"
        }

    :status 200: Team was deleted
    :status 400: No json or ``team/json`` header, or field missing
    :status 401: Not team exists
    :status 402: Not the admin for the group
    :status 422: Not logged in
    """
    if (request.json is None):
        return Response('Data not in json format', status=400)
    if not (all(field in request.json for field in ['team_name', 'team_admin'])):
        return Response('Invalid request', status=400)

    team_name = request.json['team_name']
    team_admin = request.json['team_admin']

    id = get_jwt_identity()
    user = db.users.find_one({'_id' : ObjectId(id)})
    username = user['username']


    teams = db.teams.find_one({"team_name": team_name, "team_admin": team_admin}) 
    if (teams is None):
        return jsonify({"msg": "Team Not Found"}), 401

    try:
        db.teams.update_one({'team_name': team_name, 'team_admin': team_admin},
        {
            '$push':{
                'team_members': username
            }
        }
    )
    except:
        return Response('Invalid request', status=404)


    return jsonify({"msg": "added successfully"}), 200



@teams_api.route('/leave', methods = ['PUT'])
@jwt_required
def leave():
    """ 
    leave a team
    team fields:
    input:
        team_id: string 
        team_admin: string
    
    non-input:
        NONE    

    Example input:
    .. sourcecode:: json
        {
            "team_name": "Hophacks",
            "team_admin": "Hophacks2023@gmail.com"
        }

    :status 200: Team was deleted
    :status 400: No json or ``team/json`` header, or field missing
    :status 401: Not team exists
    :status 402: Not the admin for the group
    :status 422: Not logged in
    """
    if (request.json is None):
        return Response('Data not in json format', status=400)
    if not (all(field in request.json for field in ['team_name', 'team_admin'])):
        return Response('Invalid request', status=400)

    team_name = request.json['team_name']
    team_admin = request.json['team_admin']

    id = get_jwt_identity()
    user = db.users.find_one({'_id' : ObjectId(id)})
    username = user['username']


    teams = db.teams.find_one({"team_name": team_name, "team_admin": team_admin}) 
    if (teams is None):
        return jsonify({"msg": "Team Not Found"}), 401

    try:
        db.teams.update_one({'team_name': team_name, 'team_admin': team_admin},
        {
            '$pull':{
                'team_members': username
            }
        }
    )
    except:
        return Response('Invalid request', status=404)


    return jsonify({"msg": "added successfully"}), 200


@teams_api.route('/', methods = ['get'])
@jwt_required
def get():
    """ 
    get all the teams in an array

    """
    cursor = db.teams.find()
    teams = []
    for team in cursor:
        teams.append({
            'team_name': team['team_name'],
            'team_admin': team['team_admin'],
            'team_members': team['team_members'],
            'event': team['event'],
            'team_information': team['team_information'],
            'status': team['status']
            })
  
    return jsonify({'teams': teams}), 200

