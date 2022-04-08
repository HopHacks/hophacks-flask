from flask import Blueprint, request, Response, jsonify
import logging
import os
# Import WebClient from Python SDK (github.com/slackapi/python-slack-sdk)
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

# WebClient instantiates a client that can call API methods
# When using Bolt, you can use either `app.client` or the `client` passed to listeners.

# client = WebClient(token=os.environ.get("SLACK_TOKEN"))

client = WebClient(token='add token manually')
logger = logging.getLogger(__name__)

slack_api = Blueprint('slack', __name__)
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
def send_message_in_channel():
    print(request.json['message'])
    send_message(channel_id, request.json['message'])

