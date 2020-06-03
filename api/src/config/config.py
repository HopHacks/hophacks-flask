import sys
import secrets
import bcrypt
from getpass import getpass

from pymongo import MongoClient
import json

# Python script that generates settings for prod or dev environment
if (len(sys.argv) != 2 or sys.argv[1] not in ['prod', 'dev']):
    print("Usage: 'python config.py dev' or 'python config.py prod'")
    exit(1)

settings = {}

# TODO mongo username and password?
settings['debug'] = True
settings['MONGO_URI'] = 'mongodb://localhost:27017'
settings['MONGO_DB_NAME'] = 'hophacks'
settings['SECRET_KEY'] = 'pineapple pizza'

settings['BASE_URL'] = 'http://localhost:3000/'

if (sys.argv[1] == 'prod'):
    settings['debug'] = False
    settings['BASE_URL'] = input('URL of website (for emails): ')

    # Generate a secret key for JWT
    print("Generating secret key for JWT Tokens")
    settings['SECRET_KEY'] = secrets.token_urlsafe()

# Ask for Mongo info
url = input("MongoDB url (leave empty for 'mongodb://localhost:27017'): ")
if (len(url) > 0):
    settings['MONGO_URI'] = url

settings['MAIL_SERVER'] = input("Mail Server Address: ")
settings['MAIL_PORT'] = input("Mail Server Port: ")
settings['MAIL_USERNAME'] = input("Mail Usename: ")
settings['MAIL_PASSWORD'] = getpass("Mail Password: ")
settings['MAIL_DEFAULT_SENDER'] = input("Mail Default Sender: ")

def setup_admin():
    username = input("Admin account username (leave blank for 'admin'): " )
    if not username:
        username = 'admin'

    password = getpass("Admin account password: ")
    if (len(password) < 4):
        print("Please enter a password at least 4 characters long")
        exit(1)
    if (password != getpass("Reenter passowrd: ")):
        print("Passwords do not match!")
        exit(1)

    with MongoClient(settings['MONGO_URI']) as client:
        db = client['hophacks']

        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode(), salt)

        if (db.users.find_one({'username': username})):
            print('User {} already exists! Skipping account creation'.format(username))
            return

        db.users.insert_one({
            'username': username,
            'hashed': hashed,
            'refresh_tokens': [],
            'profile': {},
            'is_admin' : True
        })

setup_admin()

print("Writing to settings.json...")
with open('settings.json', 'w') as file:
    json.dump(settings, file, indent=4)
print("Done. Check settings.json to make sure everything is correct")
