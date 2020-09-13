from pymongo import MongoClient
import ssl

mongo_client = None
db = None

def init_db(config):
    global mongo_client, db
    mongo_client = MongoClient(config['MONGO_URI'], ssl_cert_reqs=ssl.CERT_NONE)
    db = mongo_client[config['MONGO_DB_NAME']]
