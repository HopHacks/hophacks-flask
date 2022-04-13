from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required
import logging
import os
# Import WebClient from Python SDK (github.com/slackapi/python-slack-sdk)
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from slack_webhook import Slack

# WebClient instantiates a client that can call API methods
# When using Bolt, you can use either `app.client` or the `client` passed to listeners.


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
# @jwt_required
def send_message_in_channel():
    if 'message' not in request.json:
        return Response('Invalid request', status=400)
    slack_client.client.post(text="Hello, world.")
    print(request.json['message'])
    return jsonify({"msg": "message sent"}), 200
