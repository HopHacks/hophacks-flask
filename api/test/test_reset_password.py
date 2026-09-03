import sys
sys.path.append('../src')

from util.reset_tokens import create_token
from utils import create_json, login_json
from test_users import extract_token

reset_url = "http://localhost:3000/reset"
new_password = "new-password-1"


def request_reset(client, username=None):
    return client.post(
        "/api/accounts/reset_password/request",
        json={"username": username or create_json["username"], "reset_url": reset_url},
    )


def test_reset_round_trip(client, test_db, test_mail):
    assert client.post("/api/accounts/create", json=create_json).status_code == 200

    with test_mail.record_messages() as outbox:
        assert request_reset(client).status_code == 200
        assert len(outbox) == 1
        token = extract_token(outbox[-1], reset_url)

    res = client.post(
        "/api/accounts/reset_password",
        json={"reset_token": token, "password": new_password},
    )
    assert res.status_code == 200

    # Old password no longer works, new one does.
    assert client.post("/api/auth/login", json=login_json).status_code == 401
    res = client.post(
        "/api/auth/login",
        json={"username": login_json["username"], "password": new_password},
    )
    assert res.status_code == 200

    # The token is single use: replaying it must fail.
    res = client.post(
        "/api/accounts/reset_password",
        json={"reset_token": token, "password": "another-password"},
    )
    assert res.status_code == 400


def test_reset_request_mixed_case_username_sends_email(client, test_db, test_mail):
    assert client.post("/api/accounts/create", json=create_json).status_code == 200

    with test_mail.record_messages() as outbox:
        assert request_reset(client, username="A@TEST.com").status_code == 200
        # Lookup is case-insensitive like login, so the email must still send.
        assert len(outbox) == 1


def test_reset_request_unknown_user_generic_200(client, test_db, test_mail):
    with test_mail.record_messages() as outbox:
        assert request_reset(client, username="nobody@test.com").status_code == 200
        assert len(outbox) == 0


def test_reset_request_missing_fields_400(client, test_db):
    res = client.post("/api/accounts/reset_password/request", json={})
    assert res.status_code == 400


def test_reset_bad_tokens_400(client, test_db):
    assert client.post("/api/accounts/create", json=create_json).status_code == 200

    # Garbage token
    res = client.post(
        "/api/accounts/reset_password",
        json={"reset_token": "not-a-jwt", "password": new_password},
    )
    assert res.status_code == 400

    # Structurally valid token for a user that does not exist
    token = create_token("ghost@test.com", "some-secret", 'reset').decode('utf-8')
    res = client.post(
        "/api/accounts/reset_password",
        json={"reset_token": token, "password": new_password},
    )
    assert res.status_code == 400

    # Missing fields
    res = client.post("/api/accounts/reset_password", json={})
    assert res.status_code == 400


def test_reset_forged_empty_secret_token_400(client, test_db):
    assert client.post("/api/accounts/create", json=create_json).status_code == 200

    # No reset was ever requested, so reset_secret is ''. A token self-signed
    # with the empty string must not verify (PyJWT would otherwise accept it).
    forged = create_token(create_json["username"], "", 'reset').decode('utf-8')
    res = client.post(
        "/api/accounts/reset_password",
        json={"reset_token": forged, "password": new_password},
    )
    assert res.status_code == 400
    assert client.post("/api/auth/login", json=login_json).status_code == 200


def test_reset_request_disallowed_origin_400(client, test_db, test_mail):
    assert client.post("/api/accounts/create", json=create_json).status_code == 200

    with test_mail.record_messages() as outbox:
        res = client.post(
            "/api/accounts/reset_password/request",
            json={
                "username": create_json["username"],
                "reset_url": "https://evil.example/reset_password",
            },
        )
        assert res.status_code == 400
        assert len(outbox) == 0


def test_reset_expired_token_400(client, test_db, test_mail):
    assert client.post("/api/accounts/create", json=create_json).status_code == 200

    with test_mail.record_messages():
        assert request_reset(client).status_code == 200

    user = test_db.users.find_one({'username': create_json["username"]})
    expired = create_token(
        user['username'], user['reset_secret'], 'reset', -10
    ).decode('utf-8')
    res = client.post(
        "/api/accounts/reset_password",
        json={"reset_token": expired, "password": new_password},
    )
    assert res.status_code == 400
    # Old password still works
    assert client.post("/api/auth/login", json=login_json).status_code == 200


def test_reset_short_password_400(client, test_db, test_mail):
    assert client.post("/api/accounts/create", json=create_json).status_code == 200

    with test_mail.record_messages() as outbox:
        assert request_reset(client).status_code == 200
        token = extract_token(outbox[-1], reset_url)

    res = client.post(
        "/api/accounts/reset_password",
        json={"reset_token": token, "password": "short"},
    )
    assert res.status_code == 400
    assert client.post("/api/auth/login", json=login_json).status_code == 200
