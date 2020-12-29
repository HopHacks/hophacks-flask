import sys
import secrets
import bcrypt
from getpass import getpass

from pymongo import MongoClient
import json
import argparse

'''
Interactive script that generates configuration for prod or dev environment
'''

def setup_admin(mongo_uri):
    '''
    Set up admin account in database
    '''
    username = input("Admin account username (leave blank for 'admin'): " )
    if not username:
        username = 'admin'

    while(True):
        password = getpass("Admin account password: ")
        if password == getpass("Reenter password: "): break
        print("Passwords do not match!")

    with MongoClient(mongo_uri) as client:
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


def parse_args():
    parser = argparse.ArgumentParser(description="Interactive script that generates configuration for prod or dev environment")
    parser.add_argument('env', choices=['prod', 'dev'],  help='deployment environment')
    return parser.parse_args()

def default_settings():
    # TODO mongo username and password?
    settings = {}

    settings['DEBUG'] = True
    settings['TESTING'] = False
    settings['MONGO_URI'] = 'mongodb://localhost:27017'
    settings['MONGO_DB_NAME'] = 'hophacks'
    settings['SECRET_KEY'] = 'pineapple pizza'
    settings['BASE_URL'] = 'http://localhost:3000/'

    return settings


def set_prod_settings(settings):
    settings['DEBUG'] = False
    settings['BASE_URL'] = input('URL of website: ')

    # Generate a secret key for JWT
    print("Generating secret key for JWT Tokens")
    settings['SECRET_KEY'] = secrets.token_urlsafe()

def configure_mongo(settings):
    # Ask for Mongo info
    url = input("MongoDB url (leave empty for 'mongodb://localhost:27017'): ")
    if (len(url) > 0):
        settings['MONGO_URI'] = url


def configure_mail(settings):
    # Ask for Mongo info
    server = input("Mail Server Address (leave empty to disable): ")
    if (len(server) == 0):
        return

    settings['MAIL_SERVER'] = server
    settings['MAIL_PORT'] = input("Mail Server Port: ")
    settings['MAIL_USERNAME'] = input("Mail Usename: ")
    settings['MAIL_PASSWORD'] = getpass("Mail Password: ")
    settings['MAIL_DEFAULT_SENDER'] = input("Mail Default Sender: ")

def main():
    # Parse command-line options
    args = parse_args()

    settings = default_settings()

    if (args.env == "prod"):
        set_prod_settings(settings)

    configure_mongo(settings)
    configure_mail(settings)

    print("Writing to config.json...")
    with open('config.json', 'w') as file:
        json.dump(settings, file, indent=4)
    print("Done. Check config.json to make sure everything is correct")

    print("Setting up admin account")
    setup_admin(settings['MONGO_URI'])
    
if __name__ == "__main__":
    main()
