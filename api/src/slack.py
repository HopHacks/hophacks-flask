import os
from slackclient import SlackClient
slack_client = SlackClient()
SLACK_TOKEN = os.environ.get('SLACK_TOKEN', None)
slack_client = SlackClient(SLACK_TOKEN)

events_api = Blueprint('slack', __name__)

def channel_info(channel_id):
    channel_info = slack_client.api_call("channels.info", channel=channel_id)
    if channel_info:
        return channel_info['channel']
    return None

def send_message(channel_id, message):
    slack_client.api_call(
        "chat.postMessage",
        channel=channel_id,
        text=message,
        username='pythonbot',
        icon_emoji=':robot_face:'
    )

@slack_api.route('/', methods = ['POST'])
def send_message_in_channel(message):
    send_message(os.environ.get(CHANNEL_TOKEN_TEST), message)

