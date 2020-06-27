from db import db

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from util.decorators import check_admin

registrations_api = Blueprint('registrations', __name__)

# TODO Implement everything
@resume_api.route('/apply', methods = ['POST'])
@jwt_required
def apply():
    """As a user, apply to an event

    :reqheader Authorization: ``Bearer <JWT Token>``

    :reqjson event: Semester and year, for example 'Spring_2020'
    :reqjson TODO: other information (ie. shirt size and stuff)

    :status 200: Sucessfully registered
    :status 400: Missing or malformed event name
    :status 422: Not logged in
    """
    pass

@resume_api.route('/accept', methods = ['POST'])
@jwt_required
@check_admin
def accept():
    """Accepts a list of users to the event, and sends an email to notify them.

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin account

    :reqjson users: List of user ids to mark as accepted
    :reqjson event: Semester and year, for exmaple ``Spring_2020``

    .. sourcecode:: json

        {
            "users": ["XuiJJ8rJRrbNJZ3Nb", "GF42GBb238BGO"],
            "event": "Spring_2020"
        }


    :status 200: Successful
    :status 401: Not logged in as admin
    :status 422: Not logged in

    """
    pass

@resume_api.route('/check_in', methods = ['POST'])
@jwt_required
@check_admin
def check_in():
    """As an admin user, check another user in to an event

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin account

    :reqjson user: User id to be accepted
    :reqjson event: Semester and year, for exmaple ``Spring_2020``

    .. sourcecode:: json

        {
            "user": "XuiJJ8rJRrbNJZ3Nb",
            "event": "Spring_2020"
        }

    :status 200: Successful
    :status 401: Not logged in as admin
    :status 422: Not logged in

    """
    pass
