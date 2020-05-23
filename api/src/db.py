from pymongo import MongoClient
import json
# TODO this is a bit ugly
# TODO configure
config = json.load(open('config/settings.json'))

client = MongoClient(config['MONGO_URI'])
db = client['hophacks']

def close_db(e=None):
    client.close()

def init_app(app):
    app.teardown_appcontext(close_db)
