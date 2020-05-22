from pymongo import MongoClient

# TODO this is a bit ugly
# TODO configure
client = MongoClient('mongodb://localhost:27017')
db = client['hophacks']

def close_db(e=None):
    client.close()

def init_app(app):
    app.teardown_appcontext(close_db)
