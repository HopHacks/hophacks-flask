register_json = {
    "username": "a",
    "password": "a",
    "confirm_url": "test.com/confirm"
}

login_json = {
    "username": "a",
    "password": "a"
}

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
