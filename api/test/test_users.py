from requests import register_json, login_json
import bcrypt

def add_admin_account(client, db):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw("admin".encode(), salt)

    db.users.insert_one({
        'username': "admin",
        'hashed': hashed,
        'refresh_tokens': [],
        'profile': {},
        'is_admin' : True
    })

def extract_token(msg, url):
    token_begin = msg.body.index(url) + len(url) + 1
    token = msg.body[token_begin:]
    # Note this assumes token is followed by whitespace
    if (" " in token):
        token = token[:token.index(" ")]
    if ("\n" in token):
        token = token[:token.index(" ")]

    assert((url + "/" + token) in msg.html)
    return token


# Test registration process
def test_register(client, test_db, test_mail):
    # test that successful registration gives good response
    with test_mail.record_messages() as outbox:
        response = client.post("/api/accounts/register", json=register_json)
        assert response.status_code == 200

        # check email is sent with confirm url
        assert len(outbox) == 1
        assert register_json["confirm_url"] in outbox[0].body
        assert register_json["confirm_url"] in outbox[0].html

        # test that you can't register the same username
        response = client.post("/api/accounts/register", json=register_json)
        assert response.status_code == 409

        # test user exists in db
        user = test_db.users.find_one({"username" : "a"})
        assert user is not None

        # test email confirm
        assert not user['email_confirmed']

        token = extract_token(outbox[0], register_json['confirm_url'])
        confirm_json = {"confirm_token": token}
        response = client.post("/api/accounts/confirm_email", json=confirm_json)
        assert response.status_code == 200

        user = test_db.users.find_one({"username" : "a"})
        assert user['email_confirmed']

def test_get_profile(client, test_db):
    # register account
    response = client.post("/api/accounts/register", json=register_json)
    assert response.status_code == 200

    # login and get own info
    response = client.post("/api/auth/login", json=login_json)
    assert response.status_code == 200

    token = response.json["access_token"]
    response = client.get("/api/accounts/profile/get", headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 200

    assert response.json["profile"] == register_json["profile"]

def test_update_profile(client, test_db):
    # register account
    response = client.post("/api/accounts/register", json=register_json)
    assert response.status_code == 200

    update_json = {
        "profile": register_json["profile"]
    }
    update_json["profile"]["school"] = "Jooby Hooby"

    # login and update profile
    response = client.post("/api/auth/login", json=login_json)
    assert response.status_code == 200
    token = response.json["access_token"]
    response = client.post("/api/accounts/profile/update", json=update_json, headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 200

    user = test_db.users.find_one({"username" : "a"})
    assert user["profile"]["school"] == "Jooby Hooby"

def test_delete_account(client, test_db):
    add_admin_account(client, test_db)

    # register account
    response = client.post("/api/accounts/register", json=register_json)
    assert response.status_code == 200

    user = test_db.users.find_one({"username" : "a"})
    id = user['_id']

    # try logging in and attempting to delete as normal user
    response = client.post("/api/auth/login", json=login_json)
    assert response.status_code == 200
    token = response.json["access_token"]
    response = client.post("/api/accounts/delete", json={"user": str(id)}, headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 401

    # Login as admin instead and delete
    response = client.post("/api/auth/login", json={"username": "admin", "password": "admin"})
    assert response.status_code == 200
    token = response.json["access_token"]
    response = client.post("/api/accounts/delete", json={"user": str(id)}, headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 200

    assert test_db.users.find_one({"username" : "a"}) is None
