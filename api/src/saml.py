from flask import request, redirect, Blueprint, make_response
from onelogin.saml2.auth import OneLogin_Saml2_Auth,OneLogin_Saml2_Settings
from onelogin.saml2.idp_metadata_parser import OneLogin_Saml2_IdPMetadataParser
import os

saml_api = Blueprint('saml', __name__)


def get_idp_metadata():
    idp_metadata = OneLogin_Saml2_IdPMetadataParser.parse_remote("https://idp.jh.edu/idp/shibboleth")

    # Extract the required configuration parameters from the IDP metadata
    idp_entity_id = idp_metadata.get('entityId')
    idp_sso_url = idp_metadata.get('singleSignOnService').get('url')
    idp_slo_url = idp_metadata.get('singleLogoutService').get('url')


def init_saml_auth(req):
    settings = OneLogin_Saml2_Settings(req, custom_base_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'saml'))
    auth = OneLogin_Saml2_Auth(req)
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
            return 'Authenticated', 200
    else:
        return 'Error during authentication: {}'.format(', '.join(errors)), 500


def prepare_flask_request(request):
    # If server is behind proxys or balancers use the HTTP_X_FORWARDED fields
    return {
        'https': 'on' if request.scheme == 'https' else 'off',
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
