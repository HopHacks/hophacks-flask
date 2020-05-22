from flask import Flask, Blueprint
from pymongo import MongoClient

app = Flask(__name__)

# TODO Configurations that need to be different for prod
app.config['MONGO_URI'] = "mongodb://localhost:27017"
app.config['SECRET_KEY'] = 'super-secret'
app.debug = True

# Configurations that are always the same
app.config['JWT_TOKEN_LOCATION'] =  ['cookies', 'headers']
app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/session'
app.config['JWT_COOKIE_CSRF_PROTECT '] = False
app.config['JWT_CSRF_IN_COOKIES'] = False

api = Blueprint('api', __name__)
db = MongoClient(app.config['MONGO_URI']).hophacks

# Add endpoints from these files
# Note order is important here
import auth
import users

app.register_blueprint(api, url_prefix='/api')
