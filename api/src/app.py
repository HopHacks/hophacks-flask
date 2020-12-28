from flask import Flask, Blueprint
from flask_jwt_extended import JWTManager
import json

def set_if_present(app, config, key):
    if (key in config):
        app.config[key] = config[key]


def create_app(config_file='config/settings.json'):
    app = Flask(__name__)

    config = json.load(open(config_file))
    app.config['SECRET_KEY'] = config['SECRET_KEY']
    app.debug = config['debug']

    set_if_present(app, config, 'TESTING')

    set_if_present(app, config, 'BASE_URL')

    set_if_present(app, config, 'MAIL_SERVER')
    set_if_present(app, config, 'MAIL_PORT')
    set_if_present(app, config, 'MAIL_USERNAME')
    set_if_present(app, config, 'MAIL_PASSWORD')

    # Supress mail sending if not specified, i.e. in dev
    if ('MAIL_SERVER' not in config):
        app.config['MAIL_SUPPRESS_SEND'] = True 


    # Configurations that are always the same
    app.config['JWT_TOKEN_LOCATION'] =  ['cookies', 'headers']
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
    from accounts import accounts_api
    from admin import admin_api
    from resumes import resume_api
    from registrations import registrations_api

    app.register_blueprint(auth_api, url_prefix='/api/auth')
    app.register_blueprint(admin_api, url_prefix='/api/admin')
    app.register_blueprint(accounts_api, url_prefix='/api/accounts')
    app.register_blueprint(resume_api, url_prefix='/api/resumes')
    app.register_blueprint(registrations_api, url_prefix='/api/registrations')
    
    return app
