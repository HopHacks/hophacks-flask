import pytest
from flask_jwt_extended import get_jti

from utils import create_json, login_json, login_json2

def test_bad_login(client):
    response = client.post("/api/accounts/create", json=create_json)
    assert response.status_code == 200
    response = client.post("/api/auth/login", json={"username": "a", "password": "b"})
    assert response.status_code == 401
    response = client.post("/api/auth/login", json={"username": "b", "password": "b"})
    assert response.status_code == 401

# This test is a bit monolithic oops
def test_login(client, test_db):
    # test that before login, we can't access refresh token
    response = client.get("/api/auth/test_protected")
    assert response.status_code == 401

    response = client.post("/api/accounts/create", json=create_json)
    assert response.status_code == 200
    response = client.post("/api/auth/login", json=login_json)
    assert response.status_code == 200

    # Make sure refresh token is in db and is returned
    cookie = response.headers.get('Set-Cookie')
    prefix = 'refresh_token_cookie='
    refresh_token = cookie[len(prefix):cookie.index(';')]
    assert (get_jti(refresh_token) in test_db.users.find_one({'username' : login_json['username']})["refresh_tokens"])

    # Make sure access token is valid
    token = response.json["access_token"]
    response = client.get("/api/auth/test_protected", headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 200

    # Refresh token and try agian
    response = client.get("/api/auth/session/refresh")
    assert response.status_code == 200
    token = response.json["access_token"]
    response = client.get("/api/auth/test_protected", headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 200

    response = client.get("/api/auth/session/logout")
    assert response.status_code == 200
    assert (get_jti(refresh_token) not in test_db.users.find_one({'username' : login_json['username']})["refresh_tokens"])
