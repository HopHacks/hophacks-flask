from flask import Flask, Blueprint
import os

import pymongo

app = Flask(__name__)

app.config['SECRET_KEY'] = 'super-secret'
app.debug = True

app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
app.config['JWT_TOKEN_LOCATION'] =  ['cookies', 'headers']
app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/session'
app.config['JWT_COOKIE_CSRF_PROTECT '] = False
app.config['JWT_CSRF_IN_COOKIES'] = False

api = Blueprint('api', __name__)
app.register_blueprint(api, url_prefix='/api')
