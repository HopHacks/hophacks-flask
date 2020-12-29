from pymongo import MongoClient

class MongoDriver():
    def __init__(self):
        self.db = None
        self.mongo_client = None

    def init_app(self, app):
        self.mongo_client = MongoClient(app.config['MONGO_URI'])
        self.db = self.mongo_client[app.config['MONGO_DB_NAME']]

    # Forward any accesses to a collection to the db object
    def __getattr__(self, key):
        return self.db.key


# Global driver object
db  = MongoDriver()
