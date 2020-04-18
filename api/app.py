from flask import Flask
import os

from flask_pymongo import PyMongo

app = Flask(__name__)

app.config['SECRET_KEY'] = 'super-secret'
app.debug = True

app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"

mongo = PyMongo(app)

from api import api

app.register_blueprint(api, url_prefix='/api')

