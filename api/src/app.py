from flask import Flask, Blueprint
from flask_jwt_extended import JWTManager

from mail import mail
from db import db
from slack import slack_client
from discord import discord_client

import json
import os

class ConfigurationError(Exception):
    """Exception raised for errors in app config
    """

    def __init__(self, key):
        super().__init__("\"{}\" not found in application config".format(key))

def get_opt_config(app, config, key):
    if (key in config):
        app.config[key] = config[key]

def get_req_config(app, config, key):
    if (key not in config): raise ConfigurationError(key)
    app.config[key] = config[key]


def create_app(config_file='config/config.json'):
    app = Flask(__name__)
    config = json.load(open(config_file))

    get_req_config(app, config, 'DEBUG')
    app.debug = app.config['DEBUG']

    get_req_config(app, config, 'SECRET_KEY')
    get_req_config(app, config, 'MONGO_URI')
    get_req_config(app, config, 'MONGO_DB_NAME')
    get_req_config(app, config, 'TESTING')
    get_req_config(app, config, 'BASE_URL')
    get_opt_config(app, config, 'SLACK_WEBHOOK')
    get_opt_config(app, config, 'DISCORD_WEBHOOK')

    get_opt_config(app, config, 'MAIL_SERVER')
    get_opt_config(app, config, 'MAIL_PORT')
    get_opt_config(app, config, 'MAIL_USERNAME')
    get_opt_config(app, config, 'MAIL_PASSWORD')

    app.config['SLACK_SUPPRESS_SEND'] = False
    app.config['DISCORD_SUPPRESS_SEND'] = False 

    # Supress mail sending if not specified, i.e. in dev
    if ('MAIL_SERVER' not in config):
        app.config['MAIL_SUPPRESS_SEND'] = True 

    # Supress slack sending if not specified, i.e. in dev
    if ('SLACK_WEBHOOK' not in config):
        app.config['SLACK_SUPPRESS_SEND'] = True
    
    # Supress discord sending if not specified, i.e. in dev
    if ('DISCORD_WEBHOOK' not in config):
        app.config['DISCORD_SUPPRESS_SEND'] = True 

    # Configurations that are always the same
    app.config['JWT_TOKEN_LOCATION'] =  ['cookies', 'headers']
    app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/auth/session'
    app.config['JWT_COOKIE_CSRF_PROTECT '] = False
    app.config['JWT_CSRF_IN_COOKIES'] = False
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

    # Pass configurations to extensions
    jwt = JWTManager(app)
    db.init_app(app)
    mail.init_app(app)
    slack_client.init_app(app)
    discord_client.init_app(app)

    # Add endpoints from these files
    # Note order is important here
    from auth import auth_api
    from accounts import accounts_api
    from admin import admin_api
    from resumes import resume_api
    from vaccination import vaccination_api
    from registrations import registrations_api
    from assign import assign_api
    from announcements import announcements_api
    from events import events_api
    from slack import slack_api
    from discord import discord_api
    from saml import saml_api

    app.register_blueprint(saml_api, url_prefix='/api/saml')
    app.register_blueprint(auth_api, url_prefix='/api/auth')
    app.register_blueprint(admin_api, url_prefix='/api/admin')
    app.register_blueprint(accounts_api, url_prefix='/api/accounts')
    app.register_blueprint(resume_api, url_prefix='/api/resumes')
    app.register_blueprint(vaccination_api, url_prefix='/api/vaccination')
    app.register_blueprint(registrations_api, url_prefix='/api/registrations')
    app.register_blueprint(assign_api, url_prefix='/api/judgetool')
    app.register_blueprint(announcements_api, url_prefix='/api/announcements')
    app.register_blueprint(events_api, url_prefix='/api/events')
    app.register_blueprint(slack_api, url_prefix='/api/slack')
    app.register_blueprint(discord_api, url_prefix='/api/discord')



    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=443 ,ssl_context=('saml/certs/server.crt', 'saml/certs/server.key'))
