from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required
import logging
import os
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from slack_webhook import Slack
from db import db


class client():
    def __init__(self):
        self.token = None

    def init_app(self, app):
        self.webhook = app.config['SLACK_WEBHOOK']
        self.client = Slack(url=app.config['SLACK_WEBHOOK'])



# Global slack api object
slack_client  = client()



# client = WebClient(token=os.environ.get("SLACK_TOKEN"))
slack_api = Blueprint('slack', __name__)


# client = WebClient(token=SLACK_BOT_TOKEN)
logger = logging.getLogger(__name__)

channel_id = 'C03AD7FEKRD'

def channel_info(channel_id):
    channel_info = slack_client.api_call("channels.info", channel=channel_id)
    if channel_info:
        return channel_info['channel']
    return None

def send_message(channel_id, message):
    client.chat_postMessage(
        channel=channel_id, 
        text="Hello world"
    )
    return None

@slack_api.route('/', methods = ['POST'])
@jwt_required
def send_message_in_channel():
    if 'message' not in request.json:
        return Response('Invalid request', status=400)
    slack_client.client.post(text=request.json['message'])
    print(request.json['message'])
    return jsonify({"msg": "message sent"}), 200


@slack_api.route('/registration', methods = ['POST'])
@jwt_required
def notify_registration_in_channel():
    if not (all(field in request.json for field in ['first_name', 'last_name', 'school'])):
        return Response('Invalid request', status=400)
    
    first_name = request.json['first_name']
    last_name = request.json['last_name']
    school = request.json['school']
    num_registered = str(len(list(db.users.find())))
    notification = "(" + num_registered + ")" + " New Registration: " + first_name + " " + last_name + " from " + school
    slack_client.client.post(text=notification)
    return jsonify({"msg": "message sent"}), 200