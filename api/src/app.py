from flask import Flask, Blueprint
from flask_jwt_extended import JWTManager
import json

def create_app(config_file='config/settings.json'):
    app = Flask(__name__)

    # TODO Configurations that need to be different for prod
    config = json.load(open(config_file))
    app.config['SECRET_KEY'] = config['SECRET_KEY']
    app.debug = config['debug']

    app.config['MAIL_SERVER'] = config['MAIL_SERVER']
    app.config['MAIL_PORT'] = config['MAIL_PORT']
    app.config['MAIL_USERNAME'] = config['MAIL_USERNAME']
    app.config['MAIL_PASSWORD'] = config['MAIL_PASSWORD']
    app.config['BASE_URL'] = config['BASE_URL']

    # Configurations that are always the same
    app.config['JWT_TOKEN_LOCATION'] =  ['cookies', 'headers', 'json']
    app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/auth/session'
    app.config['JWT_COOKIE_CSRF_PROTECT '] = False
    app.config['JWT_CSRF_IN_COOKIES'] = False

    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

    jwt = JWTManager(app)

    from db import init_db
    init_db(config)

    from mail import mail
    mail.init_app(app)

    # Add endpoints from these files
    # Note order is important here
    from auth import auth_api
    from users import users_api
    from admin import admin_api
    from resumes import resume_api

    app.register_blueprint(auth_api, url_prefix='/api/auth')
    app.register_blueprint(admin_api, url_prefix='/api/admin')
    app.register_blueprint(users_api, url_prefix='/api/users')
    app.register_blueprint(resume_api, url_prefix='/api/resumes')

    return app
