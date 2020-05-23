from pymongo import MongoClient

# TODO this is a bit ugly, maybe use a class instead?
mongo_client = None
db = None

# needed for pytest
def get_db():
    return db

def get_mongo_client():
    return mongo_client

def init_db(config):
    global mongo_client, db
    mongo_client = MongoClient(config['MONGO_URI'])
    db = mongo_client[config['MONGO_DB_NAME']]
