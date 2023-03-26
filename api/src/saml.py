import os
import re

from flask import request, redirect, Blueprint, make_response, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, set_refresh_cookies, get_jti
from bson.objectid import ObjectId

from auth import MAX_TOKENS
from db import db
from onelogin.saml2.auth import OneLogin_Saml2_Auth

saml_api = Blueprint('saml', __name__)


def init_saml_auth(req):
    auth = OneLogin_Saml2_Auth(req, custom_base_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'saml'))
    return auth


@saml_api.route('/login/')
def login():
    """SAML login
    """
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    return redirect(auth.login())


@saml_api.route('/acs/', methods=['POST'])
def acs():
    """SAML Assertion Consumer Service
    """
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    auth.process_response()
    errors = auth.get_errors()
    if len(errors) == 0:
        if not auth.is_authenticated():
            return 'Not authenticated', 401
        else:
            attributes = auth.get_attributes()
            email = attributes['EmailAddress'][0]
            # check if email already exists in database
            exists = db.users.find_one({'username': email})
            if not exists:
                # create new user
                create_sso_user(attributes)
            return sso_login(email)
    else:
        return 'Error during authentication: {}'.format(', '.join(errors)), 500


def prepare_flask_request(request):
    # If server is behind proxys or balancers use the HTTP_X_FORWARDED fields
    return {
        'https': 'on',
        'http_host': request.host,
        'script_name': request.path,
        'get_data': request.args.copy(),
        # Uncomment if using ADFS as IdP, https://github.com/onelogin/python-saml/pull/144
        # 'lowercase_urlencoding': True,
        'post_data': request.form.copy()
    }


@saml_api.route('/metadata', methods=['GET'])
def metadata():
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    settings = auth.get_settings()
    metadata = settings.get_sp_metadata()
    errors = settings.validate_metadata(metadata)

    if len(errors) == 0:
        resp = make_response(metadata, 200)
        resp.headers['Content-Type'] = 'text/xml'
    else:
        resp = make_response(', '.join(errors), 500)
    return resp


def create_sso_user(attributes):
    profile = {
        'first_name': attributes.get('FirstName', '')[0],
        'last_name': attributes.get('LastName', '')[0],
        "gender": "",
        "major": "",
        "phone_number": "",
        "school": "Johns Hopkins University",
        "ethnicity": "",
        "grad": "",
        "grad_month": "",
        "grad_year": "",
        'is_jhu': True,
    }
    print(profile)
    db.users.insert_one({
        'username': attributes['EmailAddress'][0],
        'hashed': '',
        'refresh_tokens': [],
        'profile': profile,
        'email_confirmed': True,  # SSO users are automatically confirmed
        'confirm_secret': '',
        'reset_secret': '',
        'is_admin': False,
        'registrations': [],
        'resume': ''
    })


def sso_login(username):
    user = db.users.find_one({'username': re.compile('^' + re.escape(username) + '$', re.IGNORECASE)})
    user_id = str(user['_id'])
    refresh_token = create_refresh_token(identity=user_id)
    db.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$push': {
            'refresh_tokens': {
                '$each': [get_jti(refresh_token)],
                '$slice': -MAX_TOKENS
            }
        }}
    )
    res = make_response(redirect('/'))
    set_refresh_cookies(res, refresh_token)
    return res
