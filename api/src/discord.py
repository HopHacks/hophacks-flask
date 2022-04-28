from flask import Blueprint, request, Response, jsonify
import logging
import os

from discord_webhook import DiscordWebhook
import requests

class client():
    def __init__(self):
        self.webhook = None

    def init_app(self, app):
        self.webhook = app.config['DISCORD_WEBHOOK']

# Global Discord api object
discord_client  = client()

discord_api = Blueprint('discord', __name__)


# This really only applies if we were to create a full competition Discord server.
@discord_api.route('/', methods = ['POST'])
def makeAnnouncement():
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


    
