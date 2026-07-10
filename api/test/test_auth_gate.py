import sys
sys.path.append('../src')

from config.event import EVENT_NAME
from utils import create_json, login_json
from test_users import extract_token


def test_login_open_without_email_confirmation(client, test_db):
    assert client.post("/api/accounts/create", json=create_json).status_code == 200
    # Login is intentionally NOT gated on email confirmation, so users can log
    # in to view their status or re-request a confirmation email.
    res = client.post("/api/auth/login", json=login_json)
    assert res.status_code == 200
    assert "access_token" in res.json


def test_login_does_not_create_registration(client, test_db, test_mail):
    with test_mail.record_messages() as outbox:
        assert client.post("/api/accounts/create", json=create_json).status_code == 200
        token = extract_token(outbox[-1], create_json['confirm_url'])
        assert client.post("/api/accounts/confirm_email", json={"confirm_token": token}).status_code == 200

    # Registration is owned by confirm_email; repeated logins must not add rows.
    client.post("/api/auth/login", json=login_json)
    client.post("/api/auth/login", json=login_json)
    user = test_db.users.find_one({'username': "a"})
    event_regs = [r for r in user["registrations"] if r["event"] == EVENT_NAME]
    assert len(event_regs) == 1
