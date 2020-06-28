import pytest

from flask_jwt_extended import get_jti

from utils import create_json, login_json, add_admin_account, admin_login_json

def test_admin(client, test_db):
    # login and try to access admin with normal account
    response = client.post("/api/accounts/create", json=create_json)
    assert response.status_code == 200
    response = client.post("/api/auth/login", json=login_json)
    assert response.status_code == 200

    token = response.json["access_token"]
    response = client.get("/api/admin/", headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 401

    # try with admin account
    add_admin_account(client, test_db)
    response = client.post("/api/auth/login", json=admin_login_json)
    assert response.status_code == 200

    token = response.json["access_token"]
    response = client.get("/api/admin/", headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 200
