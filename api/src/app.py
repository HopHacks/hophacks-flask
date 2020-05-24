from flask import Flask, Blueprint
from flask_jwt_extended import JWTManager
import json

def create_app(config_file='config/settings.json'):
    app = Flask(__name__)

    # TODO Configurations that need to be different for prod
    config = json.load(open(config_file))
    app.config['SECRET_KEY'] = config['SECRET_KEY']
    app.debug = config['debug']

    # Configurations that are always the same
    app.config['JWT_TOKEN_LOCATION'] =  ['cookies', 'headers', 'json']
    app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/session'
    app.config['JWT_COOKIE_CSRF_PROTECT '] = False
    app.config['JWT_CSRF_IN_COOKIES'] = False

    jwt = JWTManager(app)

    from db import init_db
    init_db(config)

    # Add endpoints from these files
    # Note order is important here
    from auth import auth_api
    from users import users_api
    from admin import admin_api

    app.register_blueprint(auth_api, url_prefix='/api/auth')
    app.register_blueprint(users_api, url_prefix='/api/users')
    app.register_blueprint(admin_api, url_prefix='/api/admin')

    return app
