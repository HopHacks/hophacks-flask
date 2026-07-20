import sys
sys.path.append('../src')

import copy

from utils import create_json, create_json_no_coc, create_json_no_data


def test_create_success_stores_full_profile(client, test_db, test_mail):
    with test_mail.record_messages() as outbox:
        res = client.post("/api/accounts/create", json=create_json)
        assert res.status_code == 200
        # one confirmation email, containing the confirm url
        assert len(outbox) == 1
        assert create_json["confirm_url"] in outbox[0].body
        assert create_json["confirm_url"] in outbox[0].html

    user = test_db.users.find_one({'username': "a@test.com"})
    assert user is not None
    assert user["email_confirmed"] is False
    # profile is stored verbatim, including the MLH consent booleans
    assert user["profile"] == create_json["profile"]
    assert user["profile"]["mlh_code_of_conduct"] is True
    assert user["profile"]["mlh_data_sharing"] is True
    # no registration until the email is confirmed
    assert user["registrations"] == []
    assert user["resume"] == ""


def test_create_duplicate_username_409(client, test_db):
    assert client.post("/api/accounts/create", json=create_json).status_code == 200
    assert client.post("/api/accounts/create", json=create_json).status_code == 409
    assert test_db.users.count_documents({'username': "a@test.com"}) == 1


def test_create_duplicate_case_insensitive_409(client, test_db):
    upper = copy.deepcopy(create_json)
    upper["username"] = "A@TEST.com"
    assert client.post("/api/accounts/create", json=create_json).status_code == 200
    # "A@TEST.com" normalizes to "a@test.com" and must be rejected as a duplicate
    assert client.post("/api/accounts/create", json=upper).status_code == 409
    assert test_db.users.count_documents({}) == 1


def test_create_missing_required_field_400(client, test_db):
    bad = copy.deepcopy(create_json)
    del bad["profile"]["school"]
    res = client.post("/api/accounts/create", json=bad)
    assert res.status_code == 400
    assert test_db.users.find_one({'username': "a@test.com"}) is None


def test_create_disallowed_confirm_url_origin_400(client, test_db, test_mail):
    bad = copy.deepcopy(create_json)
    bad["confirm_url"] = "https://evil.example/confirm"
    with test_mail.record_messages() as outbox:
        res = client.post("/api/accounts/create", json=bad)
        assert res.status_code == 400
        # no email may be sent to an origin outside the allowlist
        assert len(outbox) == 0
    assert test_db.users.find_one({'username': "a@test.com"}) is None


def test_create_requires_code_of_conduct_true(client, test_db, test_mail):
    with test_mail.record_messages() as outbox:
        res = client.post("/api/accounts/create", json=create_json_no_coc)
        assert res.status_code == 400
        # no confirmation email should be sent for a rejected registration
        assert len(outbox) == 0
    assert test_db.users.find_one({'username': "d@test.com"}) is None


def test_create_requires_data_sharing_true(client, test_db):
    res = client.post("/api/accounts/create", json=create_json_no_data)
    assert res.status_code == 400
    assert test_db.users.find_one({'username': "e@test.com"}) is None


def test_create_marketing_email_optional(client, test_db):
    payload = copy.deepcopy(create_json)
    payload["username"] = "opt@test.com"
    del payload["profile"]["mlh_marketing_emails"]
    # marketing opt-in is optional; omitting it must not block registration
    assert client.post("/api/accounts/create", json=payload).status_code == 200


def test_create_empty_body_400(client, test_db):
    res = client.post("/api/accounts/create", json={})
    assert res.status_code == 400


def test_create_stores_optional_fields(client, test_db):
    payload = copy.deepcopy(create_json)
    payload["username"] = "opt2@test.com"
    # dietary_restrictions and tshirt_size are required; values are stored verbatim
    payload["profile"]["dietary_restrictions"] = "Vegetarian"
    payload["profile"]["tshirt_size"] = "L"
    # shipping_address is optional and stored verbatim when present
    payload["profile"]["shipping_address"] = {
        "line1": "3400 N Charles St", "line2": "", "city": "Baltimore",
        "state": "MD", "country": "United States of America", "zip": "21218",
    }
    assert client.post("/api/accounts/create", json=payload).status_code == 200
    user = test_db.users.find_one({'username': "opt2@test.com"})
    assert user["profile"]["dietary_restrictions"] == "Vegetarian"
    assert user["profile"]["tshirt_size"] == "L"
    assert user["profile"]["shipping_address"]["city"] == "Baltimore"


def test_create_missing_dietary_or_tshirt_400(client, test_db):
    for key in ("dietary_restrictions", "tshirt_size"):
        bad = copy.deepcopy(create_json)
        del bad["profile"][key]
        assert client.post("/api/accounts/create", json=bad).status_code == 400
    assert test_db.users.find_one({'username': "a@test.com"}) is None


def test_create_invalid_email_400(client, test_db):
    for bad_username in ("not-an-email", "missing@tld", "spaces in@it.com", ""):
        bad = copy.deepcopy(create_json)
        bad["username"] = bad_username
        assert client.post("/api/accounts/create", json=bad).status_code == 400
    assert test_db.users.count_documents({}) == 0


def test_create_weak_password_400(client, test_db):
    bad = copy.deepcopy(create_json)
    bad["password"] = "short"
    assert client.post("/api/accounts/create", json=bad).status_code == 400

    bad["password"] = ""
    assert client.post("/api/accounts/create", json=bad).status_code == 400

    # bcrypt only reads the first 72 bytes; longer inputs are rejected rather
    # than silently truncated
    bad["password"] = "x" * 73
    assert client.post("/api/accounts/create", json=bad).status_code == 400

    assert test_db.users.count_documents({}) == 0


def test_create_missing_or_oversized_essay_400(client, test_db):
    for key in ("essay_project", "essay_team"):
        bad = copy.deepcopy(create_json)
        del bad["profile"][key]
        assert client.post("/api/accounts/create", json=bad).status_code == 400

        bad = copy.deepcopy(create_json)
        bad["profile"][key] = "   "
        assert client.post("/api/accounts/create", json=bad).status_code == 400

        bad = copy.deepcopy(create_json)
        bad["profile"][key] = "word " * 301
        assert client.post("/api/accounts/create", json=bad).status_code == 400

    assert test_db.users.count_documents({}) == 0
