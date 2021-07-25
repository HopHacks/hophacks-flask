from db import db
from flask import Blueprint, request, Response, current_app, render_template, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import datetime
import pytz

boardcast_api = Blueprint('boardcast', __name__)

@boardcast_api.route('/create', methods = ['POST'])
def create():
    eastern = pytz.timezone("America/New_York")
    if (request.json is None):
        return Response('Data not in json format', status=400)

    text = request.json['text']
    platform = request.json['platform']

    db.boardcast.insert_one({
        'text': text,
        'platform': platform,
        'time': datetime.datetime.utcnow()
    })
    return jsonify({"msg": "boardcast created"}), 200 