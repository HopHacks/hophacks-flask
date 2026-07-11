import sys
sys.path.append('../src')

from config.event import EVENT_NAME
from utils import create_json
from test_users import extract_token


def test_confirm_creates_applied_registration(client, test_db, test_mail):
    with test_mail.record_messages() as outbox:
        assert client.post("/api/accounts/create", json=create_json).status_code == 200
        token = extract_token(outbox[-1], create_json['confirm_url'])
        res = client.post("/api/accounts/confirm_email", json={"confirm_token": token})
        assert res.status_code == 200

    user = test_db.users.find_one({'username': "a"})
    assert user["email_confirmed"] is True

    regs = user["registrations"]
    assert len(regs) == 1
    reg = regs[0]
    assert reg["event"] == EVENT_NAME
    assert reg["status"] == "applied"
    assert reg["accept"] is False
    assert reg["checkin"] is False
    assert reg["rsvp"] is False
    assert reg["apply_at"] is not None


def test_confirm_does_not_duplicate_existing_registration(client, test_db, test_mail):
    with test_mail.record_messages() as outbox:
        assert client.post("/api/accounts/create", json=create_json).status_code == 200
        # Simulate the user already having a registration for the current event.
        test_db.users.update_one(
            {'username': "a"},
            {'$push': {'registrations': {"event": EVENT_NAME, "status": "applied"}}},
        )
        token = extract_token(outbox[-1], create_json['confirm_url'])
        res = client.post("/api/accounts/confirm_email", json={"confirm_token": token})
        assert res.status_code == 200

    user = test_db.users.find_one({'username': "a"})
    event_regs = [r for r in user["registrations"] if r["event"] == EVENT_NAME]
    assert len(event_regs) == 1
