from contextlib import nullcontext
from util.decorators import check_admin
from db import db

from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required
from bson import ObjectId

teammatch_api = Blueprint('teammatch', __name__)

@teammatch_api.route('/', methods=['GET'])
@jwt_required
def get_teams():
    """Fetch all teams in the database.

    This endpoint does not require any parameters and will return a list of all teams.

    :status 200: Returns a list of teams
    """

    id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(id)})

    teams = db.teammatch.find()
    response = []
    for team in teams:
        # check whether the requested user owns the group so they are allowed to edit 
        is_owned = team.get('user') == user['username']
        team_data = {
            'teamTitle': team['teamTitle'],
            'teamIntro': team.get('teamIntro', None),  # Using .get() to ensure no KeyError if the field is missing
            'lookingFor': team.get('lookingFor', None),
            'tags': team.get('tags', []),
            'status': team.get('status', None),
            'id': str(team['_id']),   # Adding ID in response
            'is_owned': is_owned
        }
        response.append(team_data)
    return jsonify(response), 200


@teammatch_api.route('/', methods=['POST'])
@jwt_required
def create_team():
    """Create a new team.

    :reqjson teamTitle: Title of the team
    :reqjson teamIntro: First content of the team
    :reqjson lookingFor: Skills the team is looking for
    :reqjson tags: A list of tags for the team
    :reqjson status: The team's status

    :status 201: Returns a message indicating the team was successfully created
    :status 400: Returns a message indicating the request was not a valid JSON format or missing required field
    """
    if not request.json:
        return Response('Data not in json format', status=400)

    required_fields = ['teamTitle', 'teamIntro', 'lookingFor', 'tags', 'status']
    if not all(field in request.json for field in required_fields):
        return Response('Missing required field', status=400)
    
    id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(id)})

    team = {
        'teamTitle': request.json['teamTitle'],
        'teamIntro': request.json['teamIntro'],
        'lookingFor': request.json['lookingFor'],
        'tags': request.json['tags'],
        'status': request.json['status'],
        'user': user['username']
    }

    result = db.teammatch.insert_one(team)
    return jsonify({"msg": "team added", "id": str(result.inserted_id)}), 201


@teammatch_api.route('/<id>', methods=['PUT'])
@jwt_required
def update_team(id):
    """Update a team.

    This endpoint requires an id parameter which corresponds to the MongoDB _id field.

    :param id: The id of the team to update
    :reqjson teamName: Updated team name (optional)
    :reqjson intro: Updated team introduction (optional)
    :reqjson lookingFor: Updated skills the team is looking for (optional)
    :reqjson recruit_info: Updated recruiting information (optional)
    :reqjson tags: Updated list of tags (optional)
    :reqjson status: Updated status (optional)

    :status 200: Returns a message indicating the team was successfully updated
    :status 400: Returns a message indicating the request was not a valid JSON format
    :status 404: Returns a message indicating the team was not found
    """
    if not request.json:
        return Response('Data not in json format', status=400)

    team = db.teammatch.find_one({'_id': ObjectId(id)})
    if team is None:
        return Response('Team not found', status=404)

    update_data = request.json
    db.teammatch.update_one({'_id': ObjectId(id)}, {"$set": update_data})
    return jsonify({"msg": "team updated"}), 200


@teammatch_api.route('/<id>', methods=['DELETE'])
@jwt_required
def delete_team(id):
    """Delete a team.

    This endpoint requires an id parameter which corresponds to the MongoDB _id field.

    :param id: The id of the team to delete

    :status 200: Returns a message indicating the team was successfully deleted
    :status 404: Returns a message indicating the team was not found
    """
    team = db.teammatch.find_one({'_id': ObjectId(id)})
    if team is None:
        return Response('Team not found', status=404)

    db.teammatch.delete_one({'_id': ObjectId(id)})
    return jsonify({"msg": "team deleted"}), 200