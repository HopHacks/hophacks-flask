import sys
import secrets
import bcrypt
from getpass import getpass

from pymongo import MongoClient
import json
import argparse

'''
Interactive script that generates configuration for prod or dev environment.
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
    parser = argparse.ArgumentParser(description="Interactive script that generated an admin account")
    parser.add_argument('uri', help='mongo uri')
    return parser.parse_args()

def main():
    # Parse command-line options
    args = parse_args()

    print("Setting up admin account")
    setup_admin(args.uri)
    
if __name__ == "__main__":
    main()