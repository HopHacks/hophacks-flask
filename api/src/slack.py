from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required
import logging
import os
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from slack_webhook import Slack
from db import db

slack_api = Blueprint('slack', __name__)

class slack_client():
    def __init__(self):
        self.webhook = None
        self.client = None

    def init_app(self, app):
        if app.config['SLACK_SUPPRESS_SEND']:
            self.webhook = None
            self.client = None
        else:
            self.webhook = app.config['SLACK_WEBHOOK']
            self.client = Slack(url=app.config['SLACK_WEBHOOK'])



# Global slack api object
slack_client  = slack_client()


@slack_api.route('/', methods = ['POST'])
@jwt_required
def makeAnnouncement():
    
    """Makes an customized announcement to a specific channel achieved by the according slack webhook via Slack.
    
    NOTE: This code is based on a test server. Webhooks will have to be updated. 
    
    NOTE: Only way to send a message to different channels is to create a webhook for each channel that is an option. Right now,
    the messages are sent to slack-api-testing channel.

    :reqjson message: message / announcement being sent


    Example input:

    .. sourcecode:: json

    {
        "message": "Hello World!",
    }

    :status 200: Message sent
    :status 400: Error with request
    
    """

    if (request.json is None):
        return Response('Data not in json format', status=400)

    if not (all(field in request.json for field in ['message'])):
        return Response('Invalid request', status=400)

    announcement = "New Announcement: " + request.json['message']
    slack_client.client.post(text=announcement)
    return jsonify({"msg": "message sent"}), 200




@slack_api.route('/registration', methods = ['POST'])
def notify_registration_in_channel():
    
    """Makes a notification to a specific slack channel when a new user registers.
    
    NOTE: This code is based on a test server. Webhooks will have to be updated. 
    
    NOTE: Only way to send a message to different channels is to create a webhook for each channel that is an option. Right now,
    the messages are sent to slack-api-testing channel.

    :reqjson first_name: first name of the new user registered
    :reqjson last_name: last name of the new user registered
    :reqjson school: school of the new user 


    Example input:

    .. sourcecode:: json

    {
        "first_name": "Blue",
        "last_name": "Jay",
        "school": "Johns Hopkins Univerity"
    }

    :status 200: Message sent
    :status 400: Error with request
    
    """
    
    if (request.json is None):
        return Response('Data not in json format', status=400)

    if not (all(field in request.json for field in ['first_name', 'last_name', 'school'])):
        return Response('Invalid request', status=400)
    
    first_name = request.json['first_name']
    last_name = request.json['last_name']
    school = request.json['school']

    # use num_registered in the events API for next year's events
    num_registered = str(len(list(db.users.find())))

    notification = "(" + num_registered + ")" + " New Registration: " + first_name + " " + last_name + " from " + school
    slack_client.client.post(text=notification)
    return jsonify({"msg": "message sent"}), 200