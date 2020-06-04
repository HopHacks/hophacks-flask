import pytest
import bcrypt

from flask_jwt_extended import get_jti

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

def test_admin(client, test_db):
    # login and try to access admin with normal account
    response = client.post("/api/accounts/register", json={"username": "a", "password": "a"})
    assert response.status_code == 200
    response = client.post("/api/auth/login", json={"username": "a", "password": "a"})
    assert response.status_code == 200

    token_json = response.json
    response = client.get("/api/admin/", json=token_json)
    assert response.status_code == 401

    # try with admin account
    add_admin_account(client, test_db)
    response = client.post("/api/auth/login", json={"username": "admin", "password": "admin"})
    assert response.status_code == 200

    token_json = response.json
    response = client.get("/api/admin/", json=token_json)
    assert response.status_code == 200
