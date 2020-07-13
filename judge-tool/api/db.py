from pymongo import MongoClient

mongo_client = None
db = None

def init_db(config):
    global mongo_client, db
    mongo_client = MongoClient(config['MONGO_URI'])
    db = mongo_client[config['MONGO_DB_NAME']]
