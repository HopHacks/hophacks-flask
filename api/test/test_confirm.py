import sys
sys.path.append('../src')

from config.event import EVENT_NAME
from util.reset_tokens import create_token
from utils import create_json, login_json
from test_users import extract_token


def test_confirm_creates_applied_registration(client, test_db, test_mail):
    with test_mail.record_messages() as outbox:
        assert client.post("/api/accounts/create", json=create_json).status_code == 200
        token = extract_token(outbox[-1], create_json['confirm_url'])
        res = client.post("/api/accounts/confirm_email", json={"confirm_token": token})
        assert res.status_code == 200

    user = test_db.users.find_one({'username': "a@test.com"})
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
            {'username': "a@test.com"},
            {'$push': {'registrations': {"event": EVENT_NAME, "status": "applied"}}},
        )
        token = extract_token(outbox[-1], create_json['confirm_url'])
        res = client.post("/api/accounts/confirm_email", json={"confirm_token": token})
        assert res.status_code == 200

    user = test_db.users.find_one({'username': "a@test.com"})
    event_regs = [r for r in user["registrations"] if r["event"] == EVENT_NAME]
    assert len(event_regs) == 1


def test_confirm_twice_is_idempotent(client, test_db, test_mail):
    with test_mail.record_messages() as outbox:
        assert client.post("/api/accounts/create", json=create_json).status_code == 200
        token = extract_token(outbox[-1], create_json['confirm_url'])

    res = client.post("/api/accounts/confirm_email", json={"confirm_token": token})
    assert res.status_code == 200

    # Re-clicking the link (refresh, second tab) must succeed, not error.
    res = client.post("/api/accounts/confirm_email", json={"confirm_token": token})
    assert res.status_code == 200
    assert res.json["msg"] == "Email already confirmed"

    user = test_db.users.find_one({'username': "a@test.com"})
    event_regs = [r for r in user["registrations"] if r["event"] == EVENT_NAME]
    assert len(event_regs) == 1


def test_confirm_malformed_token_400(client, test_db):
    res = client.post("/api/accounts/confirm_email", json={"confirm_token": "not-a-jwt"})
    assert res.status_code == 400

    res = client.post("/api/accounts/confirm_email", json={})
    assert res.status_code == 400


def test_confirm_token_for_unknown_user_400(client, test_db):
    # Structurally valid token whose id has no user row (deleted account,
    # cross-environment link) must return 400, not crash.
    token = create_token("ghost@test.com", "some-secret", 'confirm').decode('utf-8')
    res = client.post("/api/accounts/confirm_email", json={"confirm_token": token})
    assert res.status_code == 400


def test_confirm_expired_token_400(client, test_db, test_mail):
    with test_mail.record_messages() as outbox:
        assert client.post("/api/accounts/create", json=create_json).status_code == 200

    user = test_db.users.find_one({'username': "a@test.com"})
    expired = create_token(
        user['username'], user['confirm_secret'], 'confirm', -10
    ).decode('utf-8')
    res = client.post("/api/accounts/confirm_email", json={"confirm_token": expired})
    assert res.status_code == 400
    assert test_db.users.find_one({'username': "a@test.com"})["email_confirmed"] is False


def test_resend_invalidates_old_token_and_new_token_confirms(client, test_db, test_mail):
    with test_mail.record_messages() as outbox:
        assert client.post("/api/accounts/create", json=create_json).status_code == 200
        old_token = extract_token(outbox[-1], create_json['confirm_url'])

        access = client.post("/api/auth/login", json=login_json).json['access_token']
        res = client.post(
            "/api/accounts/confirm_email/request",
            json={"confirm_url": create_json['confirm_url']},
            headers={'Authorization': 'Bearer ' + access},
        )
        assert res.status_code == 200
        new_token = extract_token(outbox[-1], create_json['confirm_url'])

    # Resending rotates the confirm secret: old link dies, new link works.
    assert client.post("/api/accounts/confirm_email", json={"confirm_token": old_token}).status_code == 400
    assert client.post("/api/accounts/confirm_email", json={"confirm_token": new_token}).status_code == 200
    assert test_db.users.find_one({'username': "a@test.com"})["email_confirmed"] is True


def test_resend_after_confirmed_400(client, test_db, test_mail):
    with test_mail.record_messages() as outbox:
        assert client.post("/api/accounts/create", json=create_json).status_code == 200
        token = extract_token(outbox[-1], create_json['confirm_url'])
        assert client.post("/api/accounts/confirm_email", json={"confirm_token": token}).status_code == 200

        access = client.post("/api/auth/login", json=login_json).json['access_token']
        res = client.post(
            "/api/accounts/confirm_email/request",
            json={"confirm_url": create_json['confirm_url']},
            headers={'Authorization': 'Bearer ' + access},
        )
        assert res.status_code == 400
