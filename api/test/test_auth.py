import pytest
from flask_jwt_extended import get_jti

def test_bad_login(client):
    response = client.post("/api/register", json={"username": "a", "password": "a"})
    assert response.status_code == 200
    response = client.post("/api/login", json={"username": "a", "password": "b"})
    assert response.status_code == 401
    response = client.post("/api/login", json={"username": "b", "password": "b"})
    assert response.status_code == 401

# This test is a bit monolithic oops
def test_login(client, test_db):
    # test that before login, we can't access refresh token
    response = client.get("/api/test_protected")
    assert response.status_code == 401

    response = client.post("/api/register", json={"username": "a", "password": "a"})
    assert response.status_code == 200
    response = client.post("/api/login", json={"username": "a", "password": "a"})
    assert response.status_code == 200

    # Make sure refresh token is in db and is returned
    cookie = response.headers.get('Set-Cookie')
    prefix = 'refresh_token_cookie='
    refresh_token = cookie[len(prefix):cookie.index(';')]
    assert (get_jti(refresh_token) in test_db.users.find_one({'username' : "a"})["refresh_tokens"])

    # Make sure access token is valid
    token_json = response.json
    response = client.get("/api/test_protected", json = token_json)
    assert response.status_code == 200

    # Refresh token and try agian
    response = client.get("api/session/refresh")
    assert response.status_code == 200
    token_json = response.json
    response = client.get("/api/test_protected", json = token_json)
    assert response.status_code == 200

    response = client.get("/api/session/logout")
    assert response.status_code == 200
    assert (get_jti(refresh_token) not in test_db.users.find_one({'username' : "a"})["refresh_tokens"])
