from contextlib import nullcontext
from util.decorators import check_admin
from db import db

from datetime import datetime

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required
from bson import ObjectId

teammatch_api = Blueprint('teammatch', __name__)

@teammatch_api.route('/', methods=['GET'])
def get_teams():
    """Fetch all teams in the database.

    This endpoint does not require any parameters and will return a list of all teams.

    :status 200: Returns a list of teams
    """
    teams = db.teammatch.find()
    response = []
    for team in teams:
        team['_id'] = str(team['_id'])  # Convert ObjectId to string
        response.append(team)
    return jsonify(response), 200


@teammatch_api.route('/', methods=['POST'])
def create_team():
    """Create a new team.

    :reqjson teamTitle: Title of the team
    :reqjson contentOne: First content of the team
    :reqjson lookingFor: Skills the team is looking for
    :reqjson contentTwo: Second content of the team
    :reqjson tags: A list of tags for the team
    :reqjson status: The team's status

    :status 201: Returns a message indicating the team was successfully created
    :status 400: Returns a message indicating the request was not a valid JSON format or missing required field
    """
    if not request.json:
        return Response('Data not in json format', status=400)

    required_fields = ['teamTitle', 'contentOne', 'lookingFor', 'contentTwo', 'tags', 'status']
    if not all(field in request.json for field in required_fields):
        return Response('Missing required field', status=400)

    team = {
        'teamTitle': request.json['teamTitle'],
        'contentOne': request.json['contentOne'],
        'lookingFor': request.json['lookingFor'],
        'contentTwo': request.json['contentTwo'],
        'tags': request.json['tags'],
        'status': request.json['status']
    }

    result = db.teammatch.insert_one(team)
    return jsonify({"msg": "team added", "id": str(result.inserted_id)}), 201


@teammatch_api.route('/<id>', methods=['PUT'])
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