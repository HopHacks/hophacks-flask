import os

from flask import request, redirect, Blueprint, make_response, jsonify
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
            email = attributes['EmailAddress']
            # check if email already exists in database
            exists = db.users.find_one({'username': email})
            if exists:
                pass # log in
            else:
                pass
            # if not, create a new user
            # if so, log in
            return jsonify(auth.get_attributes()), 200
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
