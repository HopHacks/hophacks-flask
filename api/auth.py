from app import mongo, app

from flask_jwt import JWT
import bcrypt

# TODO replace with db
users = {}
ids = {}

class User():
    def __init__(self, id, username, hashed):
        self.id = id
        self.username = username
        self.hashed = hashed



def authenticate(username, password):
    # Todo replace with db
    if (username not in users): return None
    user = users[username];
    if bcrypt.checkpw(password.encode('utf-8'), user.hashed):
        return user

    return None

def identity(payload):
    user_id = payload['identity']
    return users.get(user_id, None)

jwt = JWT(app, authenticate, identity)
