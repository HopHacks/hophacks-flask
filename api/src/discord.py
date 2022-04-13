from flask import Blueprint, request, Response, jsonify
import logging
import os

from discord_webhook import DiscordWebhook
import requests


discord_api = Blueprint('discord', __name__)


@discord_api.route('/', methods = ['POST'])
def send_message_in_channel():
    if 'message' not in request.json:
        return Response('Invalid request', status=400)
    print(request.json['message'])
    discord_webhook_url = ''
    Message = {
    "content": request.json['message']
    }
    requests.post(discord_webhook_url, data=Message)
    return jsonify({"msg": "message sent"}), 200
