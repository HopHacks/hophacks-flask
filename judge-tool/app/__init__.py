import os
from flask import Flask, Blueprint
from bson import ObjectId
from pymongo import MongoClient

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY='dev')
    script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
    abs_file_path = os.path.join(script_dir, "uploads/")
    UPLOAD_FOLDER = abs_file_path
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    client = MongoClient("mongodb://127.0.0.1:27017")
    db = client.mymongodb

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from assignments.assign import bp
    app.register_blueprint(bp)

    return app
