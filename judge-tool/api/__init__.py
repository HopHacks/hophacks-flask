import os
from flask import Flask, Blueprint
from . import db

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'dev'
    app.config['MONGO_URI'] = 'mongodb://localhost:27017'
    app.config['MONGO_DB_NAME'] = 'judge_tool'

    db.init_db(app.config)

    from api.assign import bp
    app.register_blueprint(bp)

    return app
