from flask import Flask, Blueprint
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)

    # TODO Configurations that need to be different for prod
    app.config['SECRET_KEY'] = 'super-secret'
    app.debug = True

    # Configurations that are always the same
    app.config['JWT_TOKEN_LOCATION'] =  ['cookies', 'headers']
    app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/session'
    app.config['JWT_COOKIE_CSRF_PROTECT '] = False
    app.config['JWT_CSRF_IN_COOKIES'] = False


    # Setup db
    import db
    with app.app_context():
        db.init_app(app)

    jwt = JWTManager(app)

    # Add endpoints from these files
    # Note order is important here
    from auth import auth_api
    from users import users_api

    app.register_blueprint(auth_api, url_prefix='/api')
    app.register_blueprint(users_api, url_prefix='/api')

    return app
