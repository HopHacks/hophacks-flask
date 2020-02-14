from flask import Flask
import os

from flask_pymongo import PyMongo

from api import api
from routes import routes


app = Flask(__name__)

app.secret_key = 's3cr3t'
app.debug = True

app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)

app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(routes, url_prefix='/')

