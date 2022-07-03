from flask import Blueprint, request, Response, jsonify
import logging
import os
from flask_jwt_extended import jwt_required
from util.decorators import check_admin
from discord_webhook import DiscordWebhook
import requests

class client():
    def __init__(self):
        self.webhook = None

    def init_app(self, app):
        if app.config['DISCORD_SUPPRESS_SEND']:
            self.webhook = None
        else:
            self.webhook = app.config['DISCORD_WEBHOOK']
    
        

# Global Discord api object
discord_client  = client()
discord_api = Blueprint('discord', __name__)

# This really only applies if we were to create a full competition Discord server.
@discord_api.route('/', methods = ['POST'])
@jwt_required
@check_admin
def makeAnnouncement():
    
    """Makes an announcement via Discord. Can mention/emphasize a specific role.
    
    NOTE: This code is based on a test server. Role IDs will have to be updated. 
          Current roles in this test server are hacker, judges, and everyone. This of course can be changed in real server.
    
    NOTE: Only way to send a message to different channels is to create a webhook for each channel that is an option

    :reqjson message: message being sent
    :reqjson audience: server role being emphasized (@) (optional)


    Example input:

    .. sourcecode:: json

    {
        "message": "Hello World!",
        "audience": "hacker"
    }

    :status 200: Message sent
    :status 400: Error with request
    
    """
    
    if 'message' not in request.json:
        return Response('Invalid request', status=400)
    discord_webhook_url = ''
    role_id = ''
    if "audience" in request.json:
        if request.json['audience'] == "hacker":
            role_id = "<@&966437057041940540>"  # Change this to REAL hacker role ID on official server (retrieved by doing \@hacker)
        elif request.json['audience'] == 'judge':
            role_id = "<@&966442873472045106>" # ID of the judges role (retrieved by doing \@judge)
        elif request.json['audience'] == 'everyone':
            role_id = "@everyone"
        # Add more elifs based on number of roles
        if (role_id == ''):
            Message = {
                "content": request.json['message']
            }
        else:
            Message = {
                "content": role_id + " " + request.json['message']
            }   
        
    else:
        Message = {
            "content": request.json['message']
        }

    requests.post(discord_client.webhook, data=Message)
    return jsonify({"msg": "message sent"}), 200


    
