"""Shared helpers for driving the registration pipeline in tests."""
import sys
sys.path.append('../src')

from test_users import extract_token
from utils import add_admin_account, admin_login_json


def register_confirmed(client, test_mail, payload):
    """Create an account and confirm its email, leaving it in 'applied' state."""
    with test_mail.record_messages() as outbox:
        assert client.post('/api/accounts/create', json=payload).status_code == 200
        token = extract_token(outbox[-1], payload['confirm_url'])
        assert client.post('/api/accounts/confirm_email',
                           json={'confirm_token': token}).status_code == 200


def login_token(client, login_payload):
    res = client.post('/api/auth/login', json=login_payload)
    assert res.status_code == 200
    return res.json['access_token']


def admin_token(client, test_db):
    add_admin_account(client, test_db)
    return login_token(client, admin_login_json)


def bearer(token):
    return {'Authorization': 'Bearer ' + token}
