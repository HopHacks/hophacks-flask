from db import db
from mail import mail
from util.decorators import check_admin

from flask import Blueprint, request, Response, render_template, jsonify, Flask, flash
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message, Mail
from bson import ObjectId

import datetime
import pytz

from config.event import EVENT_NAME

registrations_api = Blueprint('registrations', __name__)

# The free-response application questions. They are stored on the user's
# profile, but they belong to the application: they are written by /apply and
# frozen afterwards (see accounts.update_profile).
REQUIRED_ESSAY_KEYS = ["essay_project", "essay_team"]
ESSAY_WORD_LIMIT = 300


def validate_essays(answers):
    """Check both free responses. Returns an error string, or None if valid."""
    for key in REQUIRED_ESSAY_KEYS:
        essay = answers.get(key)
        if (not isinstance(essay, str) or not essay.strip()):
            return 'Missing required essay'
        if (len(essay.split()) > ESSAY_WORD_LIMIT):
            return 'Essay is over the word limit'
    return None


def find_registration(user, event):
    """The user's registration subdocument for an event, or None."""
    for reg in (user.get('registrations') or []):
        if (reg.get('event') == event):
            return reg
    return None


def has_submitted(user, event):
    """True once the user has submitted their application for an event.

    A registration only exists after /apply, so its presence *is* the
    submitted flag; there is no separate field to keep in sync.
    """
    return find_registration(user, event) is not None

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
            subject = "RSVP Event Info - HopHacks.com"
            msg = Message(recipients=[email],
                          subject=subject)

            msg.body = 'Thank you for confirming your spot to attend Hophacks in-person!'
            msg.html = render_template('rsvpinfo.html', first_name=user['profile']['first_name'])
            conn.send(msg)

def _send_decision_emails(users, subject, body, template):
    """Email each user; one SMTP failure must not abort the rest of the batch.

    Returns the number of failed sends so endpoints can surface it.
    """
    failures = 0
    with mail.connect() as conn:
        for user in users:
            try:
                msg = Message(recipients=[user["username"]],
                              subject=subject)
                msg.body = body
                msg.html = render_template(template, first_name=user['profile']['first_name'])
                conn.send(msg)
            except Exception:
                failures += 1
    return failures

# Gauges per-school demand so we know where to send buses. Interest only, no
# commitment. Mirrored in email_acceptance.html; keep the two in sync.
BUSING_FORM_URL = "https://forms.gle/HiTgXEvLA9BG8T5t6"

def send_acceptances(users):
    return _send_decision_emails(
        users,
        "Acceptance Letter - HopHacks.com",
        # The plain-text alternative is what clients with HTML disabled show,
        # so every link in the HTML needs to survive here too.
        "Congrats on being accepted to HopHacks! RSVP at "
        "https://hophacks.com/profile to confirm your spot.\n\n"
        "We're gauging interest in chartered buses to campus. Filling out the "
        "busing interest form has no commitment attached, and the more "
        "students from your school who respond, the more likely we are to add "
        "a stop there. Pick-up times, locations, and ticketing details will "
        "follow later.\n\n" + BUSING_FORM_URL,
        'email_acceptance.html')

def send_rejections(users):
    return _send_decision_emails(
        users,
        "Status Update - HopHacks.com",
        "Thanks for applying, unfortunately we weren't able to accept you into HopHacks.",
        'email_rejection.html')

def send_waitlist(users):
    return _send_decision_emails(
        users,
        "Waitlist Update - HopHacks.com",
        "You've been placed on the HopHacks waitlist. We'll reach out if a spot opens up.",
        'email_waitlist.html')

def apply_decision(ids, event, guard_statuses, set_fields, unset_fields=None):
    """Transition each user's <event> registration unless its status is in
    guard_statuses. The guard lives inside the atomic filter, so a repeat
    request can never re-transition (or re-email) a user. $nin treats a
    missing status field as eligible, which keeps legacy docs decidable.

    Returns (changed_users, skipped_ids); changed docs are pre-update.
    """
    update = {'$set': set_fields}
    if unset_fields:
        update['$unset'] = unset_fields

    changed, skipped = [], []
    for raw_id in ids:
        doc = db.users.find_one_and_update(
            {
                '_id': ObjectId(raw_id),
                'registrations': {'$elemMatch': {
                    'event': event,
                    'status': {'$nin': guard_statuses}
                }}
            },
            update
        )
        if doc is None:
            skipped.append(raw_id)
        else:
            changed.append(doc)
    return changed, skipped

def send_apply_confirm(email, name):
    msg = Message("Received Application - HopHacks.com",
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

@registrations_api.route('/apply', methods = ['POST'])
@jwt_required
def apply():
    """Submit the application: the free-response answers.

    Creating an account only makes a profile. This is the second, separate
    step that turns that profile into an application, so the registration it
    creates doubles as the "submitted" flag and its ``apply_at`` is the
    submission date. The answers are frozen afterwards
    (``accounts.update_profile`` rejects edits once a registration exists).

    :reqheader Authorization: ``Bearer <JWT Token>``

    :reqjson essay_project: Answer to the first application question
    :reqjson essay_team: Answer to the second application question

    Example input:

    .. sourcecode:: json

        {
            "essay_project": "...",
            "essay_team": "..."
        }

    :status 200: Application submitted
    :status 400: Missing json, or an answer is blank or over the word limit
    :status 403: Email is not confirmed yet
    :status 409: Application was already submitted
    :status 422: Not logged in

    """
    if (request.json is None):
        return jsonify({"msg": "Data not in json format"}), 400

    error = validate_essays(request.json)
    if (error):
        return jsonify({"msg": error}), 400

    id = get_jwt_identity()
    eastern = pytz.timezone("America/New_York")

    new_reg = {
        "event": EVENT_NAME,
        "apply_at": pytz.utc.localize(datetime.datetime.utcnow()).astimezone(eastern),
        "accept": False,
        "checkin": False,
        "rsvp": False,
        "status": "applied"
    }

    # One atomic write: the email-confirmed and not-already-applied guards live
    # in the filter, so two concurrent submissions cannot both push a
    # registration (nor both send the confirmation email).
    user = db.users.find_one_and_update(
        {
            '_id': ObjectId(id),
            'email_confirmed': True,
            'registrations': {'$not': {'$elemMatch': {'event': EVENT_NAME}}}
        },
        {
            '$set': {
                'profile.essay_project': request.json['essay_project'],
                'profile.essay_team': request.json['essay_team']
            },
            '$push': {'registrations': new_reg}
        }
    )

    # Only on failure do we pay for a second read, to say *why* it failed.
    if (user is None):
        existing = db.users.find_one({'_id': ObjectId(id)})
        if (existing is None):
            return jsonify({"msg": "user not found?"}), 404
        if (not existing.get('email_confirmed')):
            return jsonify({"msg": "Confirm your email before submitting"}), 403
        return jsonify({"msg": "Application already submitted"}), 409

    # The submission is already durable at this point. A dead SMTP session must
    # not turn it into a 500: the user would be told their application failed,
    # and every retry would then hit the 409 above. Gmail caps us around 500
    # sends/day, so this fails for real during a submission rush.
    email_sent = True
    try:
        send_apply_confirm(user['username'], user.get('profile', {}).get('first_name', ''))
    except Exception:
        email_sent = False

    return jsonify({"msg": "application submitted", "email_sent": email_sent}), 200


@registrations_api.route('/apply/draft', methods = ['POST'])
@jwt_required
def apply_draft():
    """Save an in-progress answer without submitting.

    Writes only the two essay fields, by dot path, so a draft save can never
    disturb the rest of the profile (``/accounts/profile/update`` replaces the
    whole profile subdocument and rejects the older profile shapes that
    pre-2026 accounts still have).

    :reqheader Authorization: ``Bearer <JWT Token>``

    :reqjson essay_project: Draft answer to the first question (may be blank)
    :reqjson essay_team: Draft answer to the second question (may be blank)

    :status 200: Draft saved
    :status 400: Missing json, or an answer is over the word limit
    :status 409: Application already submitted; its answers cannot be changed
    :status 422: Not logged in

    """
    if (request.json is None):
        return jsonify({"msg": "Data not in json format"}), 400

    updates = {}
    for key in REQUIRED_ESSAY_KEYS:
        if (key not in request.json):
            continue
        draft = request.json[key]
        # Drafts may be blank -- completeness is /apply's job -- but the word
        # limit still applies so nothing unsubmittable can be stored.
        if (not isinstance(draft, str)):
            return jsonify({"msg": "Invalid essay"}), 400
        if (len(draft.split()) > ESSAY_WORD_LIMIT):
            return jsonify({"msg": "Essay is over the word limit"}), 400
        updates['profile.' + key] = draft

    if (not updates):
        return jsonify({"msg": "Nothing to save"}), 400

    id = get_jwt_identity()

    # Same guard as the lock in accounts.update_profile: once submitted, the
    # answers are frozen.
    result = db.users.update_one(
        {
            '_id': ObjectId(id),
            'registrations': {'$not': {'$elemMatch': {'event': EVENT_NAME}}}
        },
        {'$set': updates}
    )

    if (result.matched_count == 0):
        return jsonify({"msg": "Your application has been submitted and can no longer be edited"}), 409

    return jsonify({"msg": "draft saved"}), 200


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
    if ('users' not in request.json):
        return Response('Invalid request', status=400)

    event = request.json.get("event", EVENT_NAME)

    changed, skipped = apply_decision(
        request.json["users"], event,
        ["accepted", "rsvped", "checked_in"],
        {
            "registrations.$.accept": True,
            "registrations.$.accept_at": datetime.datetime.utcnow(),
            "registrations.$.status": "accepted"
        }
    )

    failures = send_acceptances(changed)

    return jsonify({"num_changed": len(changed), "skipped": skipped,
                    "email_failures": failures}), 200


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
    event = request.json.get("event", EVENT_NAME)
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
    """As an admin, reject a list of users for an event and email them.

    Also clears the accept flag so a previously accepted user cannot RSVP.

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin account

    :reqjson users: List of user ids to mark as rejected
    :reqjson user: Single user id (legacy alternative to ``users``)
    :reqjson event: Event name (defaults to the current event)

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
    if ('users' in request.json):
        ids = request.json['users']
    elif ('user' in request.json):
        ids = [request.json['user']]
    else:
        return Response('Invalid request', status=400)

    event = request.json.get("event", EVENT_NAME)

    changed, skipped = apply_decision(
        ids, event,
        ["rejected", "rsvped", "checked_in"],
        {
            "registrations.$.accept": False,
            "registrations.$.reject_at": datetime.datetime.utcnow(),
            "registrations.$.status": "rejected"
        }
    )

    failures = send_rejections(changed)

    return jsonify({"num_changed": len(changed), "skipped": skipped,
                    "email_failures": failures}), 200


@registrations_api.route('/waitlist', methods = ['POST'])
@jwt_required
@check_admin
def waitlist():
    """As an admin, waitlist a list of users for an event and email them.

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin account

    :reqjson users: List of user ids to move to the waitlist
    :reqjson event: Event name (defaults to the current event)

    :status 200: Successful
    :status 400: Invalid request
    :status 401: Not logged in as admin
    :status 422: Not logged in

    """
    if ('users' not in request.json):
        return Response('Invalid request', status=400)

    event = request.json.get("event", EVENT_NAME)

    changed, skipped = apply_decision(
        request.json["users"], event,
        ["waitlisted", "rsvped", "checked_in"],
        {
            "registrations.$.status": "waitlisted",
            "registrations.$.waitlist_at": datetime.datetime.utcnow(),
            "registrations.$.accept": False
        }
    )

    failures = send_waitlist(changed)

    return jsonify({"num_changed": len(changed), "skipped": skipped,
                    "email_failures": failures}), 200


@registrations_api.route('/revert', methods = ['POST'])
@jwt_required
@check_admin
def revert():
    """As an admin, silently reset users' registrations to "applied".

    Recovery path for a misclicked decision: restores the fresh-registration
    shape (accounts.confirm_email) and sends no email. This is also the only
    way out of the rsvped / checked_in statuses, which the decision endpoints
    refuse to touch.

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin account

    :reqjson users: List of user ids to reset
    :reqjson event: Event name (defaults to the current event)

    :status 200: Successful
    :status 400: Invalid request
    :status 401: Not logged in as admin
    :status 422: Not logged in

    """
    if ('users' not in request.json):
        return Response('Invalid request', status=400)

    event = request.json.get("event", EVENT_NAME)

    changed, skipped = apply_decision(
        request.json["users"], event,
        ["applied"],
        {
            "registrations.$.accept": False,
            "registrations.$.rsvp": False,
            "registrations.$.checkin": False,
            "registrations.$.status": "applied"
        },
        {
            "registrations.$.accept_at": "",
            "registrations.$.waitlist_at": "",
            "registrations.$.reject_at": "",
            "registrations.$.rsvp_time": "",
            "registrations.$.checkin_at": ""
        }
    )

    return jsonify({"num_changed": len(changed), "skipped": skipped,
                    "email_failures": 0}), 200


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

    regs = user.get("registrations") or []
    if (len(regs) == 0):
        return jsonify({"status": False}), 200

    eventInfo = regs[0] # only need to check first one, because there should only be one entry
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

    # Validate up front: the $set below always rewrites rsvp_time, so
    # modified_count cannot distinguish a fresh RSVP from a repeat one, and we
    # must not email the user unless the RSVP actually succeeds.
    current = db.users.find_one({'_id': ObjectId(id)})
    existing = next((r for r in current.get('registrations', []) if r.get('event') == event), None)
    if (existing is None or not existing.get('accept')):
        return jsonify({"msg": "no such event exists"}), 400
    if (existing.get('rsvp')):
        return jsonify({"msg": "user already RSVPed"}), 409
    
    # only allow RSVPs to accepted events
    # update RSVP status to true in database
    ret = db.users.update_one({
        
        '_id' : ObjectId(id),
        'registrations.event' : event,
        'registrations.accept': True},
    
    {'$set': {"registrations.$.rsvp":True,
    "registrations.$.status": "rsvped",
    "registrations.$.rsvp_time": datetime.datetime.utcnow()
    }})
    
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


