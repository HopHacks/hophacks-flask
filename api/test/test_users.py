register_json = {
    "username": "a",
    "password": "a",
    "confirm_url": "test.com/confirm"
}

# Test registration
def test_register(client, test_db):
    # test that successful registration gives good response
    response = client.post("/api/accounts/register", json=register_json)
    assert response.status_code == 200

    # test that you can't register the same username
    response = client.post("/api/accounts/register", json=register_json)
    assert response.status_code == 409

    # test user exists in db
    assert test_db.users.find_one({"username" : "a"}) is not None
