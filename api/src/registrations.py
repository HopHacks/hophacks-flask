from db import db
from mail import mail
from util.decorators import check_admin

from flask import Blueprint, request, Response, render_template, jsonify, Flask, flash
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message, Mail
from bson import ObjectId

import datetime

registrations_api = Blueprint('registrations', __name__)

# app = Flask(__name__)
# app.config.from_json("config/config.json")
# mail = Mail(app)

# @registrations_api.route('/send', methods = ['POST'])            
# def send_acceptances_trial():
#     email = "adeo1@jhu.edu"
#     subject = "Acceptance Letter - Hophacks.com"
#     msg = Message(recipients=[email], sender="hophacks2022@gmail.com", subject=subject)
#     msg.body = 'Congrats on being accepted to HopHacks!'
#     msg.html = render_template('email_acceptance.html', first_name="Akhil") 
#     mail.send(msg)
#     return "Sent"

# class email_client():
#     def __init__(self):
#         self.mail_port = None
#         self.mail_pwd = None

#     def init_app(self, app):
#         if app.config['MAIL_SUPPRESS_SEND']:
#             self.mail_port = None
#             self.mail_pwd = None
#         else:
#             self.mail_port = app.config['MAIL_PORT']
#             self.mail_pwd = app.config['MAIL_PASSWORD']

# email_client_registrations = email_client()
 
def send_rsvp_info(users):
     with mail.connect() as conn:
        for user in users:
            email = user["username"]
            subject = "RSVP Event Info - Hophacks.com"
            msg = Message(recipients=[email],
                          sender="team@hophacks.com",
                          subject=subject)

            msg.body = 'Thank you for confirming your spot to attend Hophacks in-person!'
            msg.html = render_template('rsvpinfo.html', first_name=user['profile']['first_name'])
            conn.send(msg)

def send_acceptances(users):
     with mail.connect() as conn:
        for user in users:
            email = user["username"]
            subject = "Acceptance Letter - Hophacks.com"
            msg = Message(recipients=[email],
                          sender="team@hophacks.com",
                          subject=subject)

            msg.body = 'Congrats on being accepted to HopHacks!'
            msg.html = render_template('email_acceptance.html', first_name=user['profile']['first_name'])
            conn.send(msg)

def send_apply_confirm(email, name):
    msg = Message("Received Application - HopHacks.com",
    sender="team@hophacks.com",
    recipients=[email])

    msg.body = 'Thanks for applying to hophacks!'
    msg.html = render_template('email_apply_confirm.html', first_name=name)
    mail.send(msg)

@registrations_api.route('/get', methods = ['GET'])
@jwt_required
def get_registrations():
    """ Get own registrations information

    :reqheader Authorization: ``Bearer <JWT Token>``

    :resjson profile: registrations information

    Example reponse:

    .. sourcecode:: json

        [
            {
                accept: false
                apply_at: "Sun, 10 Jan 2021 08:31:39 GMT"
                checkin: false
                details: "none"
                event: "spring_2021"
            }
        ]

    :status 200: Profile retrieved successfully
    :status 422: Not logged in

    """
    id = get_jwt_identity()
    user = db.users.find_one({'_id': ObjectId(id)})
    if (user is None or user['registrations'] is None):
        return jsonify({"msg": "user not found?"}), 404

    return jsonify({'registrations': user['registrations']}), 200

"""
REPLACED WITH EMAIL CONFIRMATION 
@registrations_api.route('/apply', methods = ['POST'])
@jwt_required
def apply():
    
    As a user, apply to an event

    :reqheader Authorization: ``Bearer <JWT Token>``

    :reqjson event: Semester and year, for example 'Spring_2020'
    :reqjson details: other event specific information that can change (ie. shirt size and stuff)

    :status 200: Sucessfully registered
    :status 400: Missing field in request or already registered
    :status 422: Not logged in
    
    if ('event' not in request.json or 'details' not in request.json):
        return Response('Invalid request', status=400)

    id = get_jwt_identity()
    event = request.json["event"]
    details = request.json["details"]

    user = db.users.find_one({'_id' : ObjectId(id)})

    # fancy way to check event isn't already there
    if len(list(filter(lambda reg: reg['event'] == event, user['registrations']))) != 0:
        return Response('Invalid request, already applied to {}'.format(event), status=400)

    new_reg = {
        "event": event,
        "apply_at": datetime.datetime.utcnow(),
        "accept": False,
        "checkin": False,
        "details": details,
    }

    result = db.users.update_one({'_id' : ObjectId(id)}, {'$push': {'registrations': new_reg}})
    send_apply_confirm(user['username'], user['profile']['first_name'])

    return jsonify({"num_changed": result.modified_count}), 200

"""
@registrations_api.route('/accept', methods = ['POST'])
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
    :status 400: Invalid request
    :status 401: Not logged in as admin
    :status 422: Not logged in

    """
    if ('event' not in request.json and 'users' not in request.json):
        return Response('Invalid request', status=400)

    event = request.json["event"]
    ids = [ObjectId(id) for id in request.json["users"]]

    result = db.users.update_many(
        {
            '_id': {'$in': ids},
            'registrations.event' : event
        },
        {
            '$set': {
                "registrations.$.accept": True,
                "registrations.$.accept_at": datetime.datetime.utcnow(),
                "registrations.$.status": "accepted"
            }
        }
    )

    users = db.users.find(
        {
            '_id': {'$in': ids},
            'registrations.event' : event
        }
    )

    send_acceptances(users)

    return jsonify({"num_changed": result.modified_count}), 200


@registrations_api.route('/check_in', methods = ['POST'])
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
    event = request.json["event"]
    user = request.json["user"]

    result = db.users.update_one(
        {
            '_id': ObjectId(user),
            'registrations.event' : event
        },
        {
            '$set': {
                "registrations.$.checkin": True,
                "registrations.$.checkin_at": datetime.datetime.utcnow(),
                "registrations.$.status": "checked_in"
            }
        }
    )

    return jsonify({"num_changed": result.modified_count}), 200

@registrations_api.route('/reject', methods = ['POST'])
@jwt_required
@check_admin
def reject():
    """As an admin user,reject user in to an event

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin account

    :reqjson user: User id to be reject
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
    event = request.json["event"]
    user = request.json["user"]

    result = db.users.update_one(
        {
            '_id': ObjectId(user),
            'registrations.event' : event
        },
        {
            '$set': {
                "registrations.$.reject_at": datetime.datetime.utcnow(),
                "registrations.$.status": "rejected"
            }
        }
    )

    return jsonify({"num_changed": result.modified_count}), 200


@registrations_api.route('/rsvp/view', methods = ['GET'])
@jwt_required
def rsvp_view():

    """For a user, generate a list of all the events he/she was accepted to and a list of events the user has RSVPed to.

    :reqheader Authorization: ``Bearer <JWT Token>``

    :status 200: Successful
    """

    id = get_jwt_identity()
    user = db.users.find_one({'_id' : ObjectId(id)})

    allList = [] # list of all events the user was accepted to
    rsvpList = [] # list of the events that the user has RSVPed to 


    for eventInfo in user["registrations"]:
    
        if("rsvp" in eventInfo and eventInfo["accept"] == True and eventInfo["rsvp"] == True ):
            rsvpList.append(eventInfo["event"]) # record name of RSVPed event

        # should only show the user accepted events
        if(eventInfo["accept"] == True):
            allList.append(eventInfo["event"])
        

    return jsonify({"rsvpList":rsvpList, "allList": allList}),200


@registrations_api.route('/rsvp/status', methods = ['GET'])
@jwt_required
def rsvp_status():

    """For a user, check if he/she RSVPed or not

    :reqheader Authorization: ``Bearer <JWT Token>``

    :status 200: Successful
    """

    id = get_jwt_identity()
    user = db.users.find_one({'_id' : ObjectId(id)})

    eventInfo = user["registrations"][0] # only need to check first one, because there should only be one entry
    if("rsvp" not in eventInfo or eventInfo["rsvp"] == False):
        return jsonify({"status":False}),200 
    elif(eventInfo["rsvp"] == True):
        return jsonify({"status":True}),200 


    return jsonify({"status":"something wrong"}),500 




@registrations_api.route('/rsvp/rsvp', methods = ['POST'])
@jwt_required
def rsvp_rsvp():

    # flash("We are no longer accepting RSVPs")
    """As a user, RSVP for an event he/she was accepted to

    :reqheader Authorization: ``Bearer <JWT Token>``
    :reqjson event: name of event

    .. sourcecode:: json
    
        {
            "event": "Spring_2021"
        }

    :status 200: Successful
    :status 400: No such event
    :status 409: User has already RSVPed
    :status 500: Another unknown error
    """




    event = request.json["event"] # name of event
    id = get_jwt_identity()
    
    # only allow RSVPs to accepted events
    # update RSVP status to true in database
    ret = db.users.update_one({
        
        '_id' : ObjectId(id),
        'registrations.event' : event,
        'registrations.accept': True},
    
    {'$set': {"registrations.$.rsvp":True,
    "registrations.$.status": "rsvped"}})
    

    # comment out first
    user = db.users.find({'_id' : ObjectId(id)})
    send_rsvp_info(user)

    if (ret.matched_count == 1 and ret.modified_count == 1):
        return jsonify({"msg": "RSPVed successfully"}), 200
    elif (ret.matched_count == 1 and ret.modified_count == 0):
        return jsonify({"msg": "user already RSVPed"}), 409
    elif (ret.matched_count == 0):
        return jsonify({"msg": "no such event exists"}), 400
    else:
        return jsonify({"msg": "unknown error"}), 500 
    # return jsonify({"msg": "no more rsvps"} , 500)


@registrations_api.route('/rsvp/cancel', methods = ['POST'])
@jwt_required
def rsvp_cancel():
    """As a user, cancel RSVP for an event he/she was accepted to

    :reqheader Authorization: ``Bearer <JWT Token>``

    :reqjson event: name of event

    .. sourcecode:: json

        {
            "event": "Spring_2021"
        }

    :status 200: Successful
    :status 400: No such event
    :status 409: User has already not RSVPed
    :status 500: Another unknown error
    """

    event = request.json["event"]
    id = get_jwt_identity()

    # only allow cancellations for accepted aevents
    ret = db.users.update_one({
        
        '_id' : ObjectId(id),
        'registrations.event' : event,
        'registrations.accept': True},
    
    {'$set': {"registrations.$.rsvp":False,
    "registrations.$.status": "accepted"}})

    if (ret.matched_count == 1 and ret.modified_count == 1):
        return jsonify({"msg": "Cancelled RSVP successfully"}), 200
    elif (ret.matched_count == 1 and ret.modified_count == 0):
        return jsonify({"msg": "user already not RSPVed"}), 409
    elif (ret.matched_count == 0):
        return jsonify({"msg": "no such event exists"}), 400
    else:
        return jsonify({"msg": "unknown error"}), 500 
        

@registrations_api.route('/rsvp/info/all', methods = ['POST'])
@jwt_required
@check_admin
def rsvp_info_all():

    """ Send info email regarding attending the hackathon to all rsvped participants.

    :reqheader Authorization: ``Bearer <JWT Token>``

    :status 400: No Rsvped Users exist
    :status 200: Successful
    """

    rsvpList = [] # list of the events that the user has RSVPed to 
    for user in db.users.find():
        if (user['is_admin'] == True):
            continue
        if (user['registrations'] is None or len(list(user['registrations'])) == 0): # No active registrations
            continue
        if (user['registrations'][0]['status'] == "rsvped"):
            rsvpList.append(user)
    
    send_rsvp_info(rsvpList)
    if (len(rsvpList) == 0) :
        return jsonify({"msg": "No Rsvped Users"}), 400
    return jsonify({"msg": "Email successfully sent to all rsvped users"}),200


