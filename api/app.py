from flask import Flask
import os

from flask_pymongo import PyMongo

app = Flask(__name__)

app.config['SECRET_KEY'] = 'super-secret'
app.debug = True

app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
app.config['JWT_TOKEN_LOCATION'] =  ['cookies', 'headers']
app.config['JWT_REFRESH_COOKIE_PATH'] = '/auth/session'
app.config['JWT_COOKIE_CSRF_PROTECT '] = False
app.config['JWT_CSRF_IN_COOKIES'] = False

mongo = PyMongo(app)

from api import api
from auth import auth

app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(auth, url_prefix='/auth')
