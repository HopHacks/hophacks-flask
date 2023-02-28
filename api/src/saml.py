from flask import Flask, jsonify, request, Blueprint

saml_api = Blueprint('saml', __name__)

@saml_api.route('/saml/metadata', methods=['GET'])
