from flask import Flask, Blueprint
from flask_jwt_extended import JWTManager
from mail import mail
from db import db
from slack_integration import slack_client
from discord_integration import discord_client
from flask_cors import CORS
from config.event import EVENT_NAME, EVENT_DATES

import json



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

    # The Vercel /api proxy may deliver slash-terminated routes with or
    # without the trailing slash (Next's :path* rewrite does not preserve
    # it reliably). Accept both instead of 308-redirecting, because a
    # redirect through API Gateway loses the stage prefix and breaks the
    # client (prod resume upload broke this way).
    app.url_map.strict_slashes = False

    # Every email template shows the event name/dates; expose them as Jinja
    # globals so render_template callers never have to thread them through.
    app.jinja_env.globals.update(event_name=EVENT_NAME, event_dates=EVENT_DATES)

    config = json.load(open(config_file))

    get_req_config(app, config, 'DEBUG')
    app.debug = app.config['DEBUG']

    get_req_config(app, config, 'SECRET_KEY')
    get_req_config(app, config, 'MONGO_URI')
    get_req_config(app, config, 'MONGO_DB_NAME')
    get_req_config(app, config, 'TESTING')
    # BASE_URL is optional: confirm/reset links are built from the request's
    # confirm_url/reset_url, so nothing reads it at runtime today.
    get_opt_config(app, config, 'BASE_URL')
    get_opt_config(app, config, 'ADMIN_EMAILS')
    get_opt_config(app, config, 'SLACK_WEBHOOK')
    get_opt_config(app, config, 'DISCORD_WEBHOOK')

    # Restrict credentialed CORS to an explicit origin whitelist. Reflecting
    # any Origin with supports_credentials=True would let any site drive
    # credentialed requests (e.g. session refresh) for a logged-in user.
    get_opt_config(app, config, 'CORS_ORIGINS')
    if ('CORS_ORIGINS' in app.config):
        origins = [o.strip() for o in app.config['CORS_ORIGINS'].split(',') if o.strip()]
    else:
        origins = [
            'https://hophacks.com',
            'https://www.hophacks.com',
            'http://localhost:3000',
            'http://localhost:3100',
        ]
    # Normalize to bare lowercase scheme://host so LINK_ORIGINS matching (which
    # compares an urlsplit-derived origin) tolerates a trailing slash or casing
    # in the CORS_ORIGINS secret instead of silently rejecting every link.
    origins = [o.rstrip('/').lower() for o in origins]
    CORS(app, supports_credentials=True, origins=origins)

    # Confirm/reset emails embed a client-supplied URL. Only these origins
    # (the same allowlist as CORS) may appear in mailed links, so an attacker
    # cannot make us email users a token-bearing link to their own domain.
    app.config['LINK_ORIGINS'] = origins

    get_opt_config(app, config, 'MAIL_SERVER')
    get_opt_config(app, config, 'MAIL_PORT')
    get_opt_config(app, config, 'MAIL_USERNAME')
    get_opt_config(app, config, 'MAIL_PASSWORD')
    get_opt_config(app, config, 'MAIL_DEFAULT_SENDER')
    get_opt_config(app, config, 'MAIL_USE_TLS')
    get_opt_config(app, config, 'MAIL_USE_SSL')

    # All outbound mail relies on this default sender (Message calls do not
    # pass sender= explicitly, so the configured value actually takes effect).
    # Guard against present-but-empty too: deploy writes '' when the secret
    # is unset, and flask-mail asserts on a falsy sender at send time.
    if (not app.config.get('MAIL_DEFAULT_SENDER')):
        app.config['MAIL_DEFAULT_SENDER'] = 'team@hophacks.com'

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
    # CSRF protection is deliberately off for the cookie flow: the refresh
    # cookie is only accepted on GET /session/refresh and /session/logout,
    # and the frontend does not send an X-CSRF-TOKEN header. Revisit before
    # adding any cookie-authenticated mutating endpoint.
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['JWT_CSRF_IN_COOKIES'] = False
    # Refresh cookie hardening: HTTPS-only outside of dev, and explicit
    # SameSite=Lax rather than relying on browser defaults.
    app.config['JWT_COOKIE_SECURE'] = not app.config['DEBUG']
    app.config['JWT_COOKIE_SAMESITE'] = 'Lax'
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
    from interest import interest_api
    from registrations import registrations_api
    from assign import assign_api
    from announcements import announcements_api
    from events import events_api
    from slack_integration import slack_api
    from discord_integration import discord_api
    from teammatching import teammatch_api


    app.register_blueprint(auth_api, url_prefix='/api/auth')
    app.register_blueprint(admin_api, url_prefix='/api/admin')
    app.register_blueprint(accounts_api, url_prefix='/api/accounts')
    app.register_blueprint(resume_api, url_prefix='/api/resumes')
    app.register_blueprint(vaccination_api, url_prefix='/api/vaccination')
    app.register_blueprint(interest_api, url_prefix='/api/interest')
    app.register_blueprint(registrations_api, url_prefix='/api/registrations')
    app.register_blueprint(assign_api, url_prefix='/api/judgetool')
    app.register_blueprint(announcements_api, url_prefix='/api/announcements')
    app.register_blueprint(events_api, url_prefix='/api/events')
    app.register_blueprint(slack_api, url_prefix='/api/slack')
    app.register_blueprint(discord_api, url_prefix='/api/discord')
    app.register_blueprint(teammatch_api, url_prefix='/api/teammatch')
    
    return app