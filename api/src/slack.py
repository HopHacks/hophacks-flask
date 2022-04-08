import os
from slackclient import SlackClient
slack_client = SlackClient()
SLACK_TOKEN = os.environ.get('SLACK_TOKEN', None)
slack_client = SlackClient(SLACK_TOKEN)

