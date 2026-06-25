'''
Endpoints for pre-registration interest capture (name + email).

This is a lightweight, account-less marketing list stored in its own
`interest` collection. It does NOT create users and does NOT feed the full
registration flow -- it only records "notify me when applications open".
'''

from db import db
from util.decorators import check_admin

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required

import re
from datetime import datetime

interest_api = Blueprint('interest', __name__)

EMAIL_RE = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
MAX_LEN = 200


@interest_api.route('/', methods=['POST'])
def create():
    """Record a pre-registration interest signup.

    Public, no auth. Captures name + email for "notify me when applications
    open". Resubmitting the same email updates the existing record instead of
    creating a duplicate.

    :reqjson email: required, email address
    :reqjson first_name: optional
    :reqjson last_name: optional
    :reqjson mlh_emails: optional boolean, opt-in to MLH/DEV marketing emails

    Example input:

    .. sourcecode:: json

        {
            "first_name": "Ada",
            "last_name": "Lovelace",
            "email": "ada@jhu.edu",
            "mlh_emails": true
        }

    :status 200: interest recorded
    :status 400: missing/invalid email or non-JSON body
    """
    if (request.json is None):
        return Response('Data not in json format', status=400)

    email = (request.json.get('email') or '').strip().lower()
    if (not email or len(email) > MAX_LEN or not EMAIL_RE.match(email)):
        return Response('A valid email is required', status=400)

    first_name = (request.json.get('first_name') or '').strip()[:MAX_LEN]
    last_name = (request.json.get('last_name') or '').strip()[:MAX_LEN]
    mlh_emails = bool(request.json.get('mlh_emails', False))
    source = (request.json.get('source') or 'website').strip()[:MAX_LEN]
    now = str(datetime.utcnow())

    db.interest.update_one(
        {'email': email},
        {
            '$set': {
                'first_name': first_name,
                'last_name': last_name,
                'mlh_emails': mlh_emails,
                'updated_at': now,
            },
            '$setOnInsert': {
                'email': email,
                'created_at': now,
                'source': source,
            },
        },
        upsert=True,
    )

    return jsonify({'msg': 'interest recorded'}), 200


@interest_api.route('/count', methods=['GET'])
def count():
    """Public count of interest signups, for social proof on the form.

    :status 200: returns ``{"count": <int>}``
    """
    return jsonify({'count': db.interest.count_documents({})}), 200


@interest_api.route('/all', methods=['GET'])
@jwt_required
@check_admin
def get_all():
    """List all interest signups (admin only, for export).

    :reqheader Authorization: ``Bearer <JWT Token>``, needs an admin account

    :status 200: returns ``{"interest": [...]}``
    :status 401: not an admin
    :status 422: not logged in
    """
    signups = []
    for doc in db.interest.find().sort('created_at', 1):
        doc['_id'] = str(doc['_id'])
        signups.append(doc)

    return jsonify({'interest': signups}), 200
