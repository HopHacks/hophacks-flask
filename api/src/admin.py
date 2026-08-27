from util.decorators import check_admin
from db import db
from pymongo import ASCENDING, DESCENDING

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from bson import ObjectId

import boto3
import botocore.exceptions
import csv
import io
from werkzeug.utils import secure_filename

from config.event import EVENT_NAME, EVENT_SLUG, EVENT_CYCLE_START

admin_api = Blueprint('admin', __name__)



@admin_api.route('/', methods=['GET'])
@jwt_required
@check_admin
def test_admin():
    return jsonify({'is_admin': True}), 200


@admin_api.route('/admins', methods=['GET'])
@jwt_required
@check_admin
def list_admins():
    """List usernames of all admin accounts."""
    admins = [u['username'] for u in db.users.find({'is_admin': True}, {'username': 1})]
    return jsonify({'admins': sorted(admins)}), 200


@admin_api.route('/admins', methods=['POST'])
@jwt_required
@check_admin
def promote_admin():
    """Grant admin to an existing account (admin-only).

    :reqjson username: email of the account to promote

    :status 200: Promoted (or already admin)
    :status 400: Missing/invalid username
    :status 404: No account with that email
    """
    from accounts import username_filter

    username = request.json.get('username') if request.json else None
    if (not isinstance(username, str) or not username.strip()):
        return jsonify({'msg': 'Missing username'}), 400

    user = db.users.find_one(username_filter(username.strip()))
    if (user is None):
        return jsonify({'msg': 'No account with that email'}), 404

    if (user.get('is_admin')):
        return jsonify({'msg': '{} is already an admin'.format(user['username'])}), 200

    db.users.update_one({'_id': user['_id']}, {'$set': {'is_admin': True}})
    return jsonify({'msg': '{} is now an admin'.format(user['username'])}), 200


@admin_api.route('/users', methods=['DELETE'])
@jwt_required
@check_admin
def delete_user():
    """Permanently delete an account and its S3 resume (admin-only).

    Intended for test/junk registrations. Admin accounts cannot be deleted
    through this endpoint (demote first, in the database, if ever needed).

    :reqjson username: email of the account to delete

    :status 200: Deleted
    :status 400: Missing username, or target is an admin
    :status 404: No account with that email
    """
    from accounts import username_filter
    from resumes import BUCKET

    username = request.json.get('username') if request.json else None
    if (not isinstance(username, str) or not username.strip()):
        return jsonify({'msg': 'Missing username'}), 400

    user = db.users.find_one(username_filter(username.strip()))
    if (user is None):
        return jsonify({'msg': 'No account with that email'}), 404

    if (user.get('is_admin')):
        return jsonify({'msg': 'Refusing to delete an admin account'}), 400

    if (user.get('resume')):
        s3 = boto3.client('s3')
        key = '{}/{}-{}'.format(EVENT_SLUG, str(user['_id']), user['resume'])
        try:
            s3.delete_object(Bucket=BUCKET, Key=key)
        except botocore.exceptions.BotoCoreError:
            # The account row is the thing that must go; an orphaned S3
            # object is acceptable and cleanable later.
            pass
        except botocore.exceptions.ClientError:
            pass

    db.users.delete_one({'_id': user['_id']})
    return jsonify({'msg': '{} deleted'.format(user['username'])}), 200

@admin_api.route('/users', methods=['GET'])
@jwt_required
@check_admin
def get_all_users_account():
#     query = request.args.get("query")
#     eventFile = open("event.txt", "r")

#     cursor  = db.users.find({
#     "$and": [
#         {
#             "$or": [
#                 {"username": {"$regex": ".*"+query+".*", "$options": "i"}},
#                 {"profile.first_name": {"$regex": ".*"+query+".*", "$options": "i"}},
#                 {"profile.last_name": {"$regex": ".*"+query+".*", "$options": "i"}}
#             ]
#         },
#         {"registrations": {"$elemMatch": {"event": "Fall 2024"}}}
#     ]
# })
    query = request.args.get("query") or ""
    event_name = EVENT_NAME

    cursor = db.users.aggregate([
        {
            "$match": {
                "$and": [
                    {
                        "$or": [
                            {"username": {"$regex": ".*" + query + ".*", "$options": "i"}},
                            {"profile.first_name": {"$regex": ".*" + query + ".*", "$options": "i"}},
                            {"profile.last_name": {"$regex": ".*" + query + ".*", "$options": "i"}}
                        ]
                    },
                    # Everyone who submitted an application, plus accounts
                    # created this cycle that never did -- the console has to
                    # be able to show "made a profile, never applied". Scoping
                    # the second half by account age matters: db.users spans
                    # every year since 2021, and without it every dormant old
                    # account would show up as an unfinished 2026 application.
                    # ObjectIds embed their creation time, so this needs no new
                    # field and rides the _id index.
                    {"$or": [
                        {"registrations": {"$elemMatch": {"event": event_name}}},
                        {"_id": {"$gte": ObjectId.from_datetime(EVENT_CYCLE_START)}}
                    ]}
                ]
            }
        },
        {
            "$addFields": {
                "current_rsvp_time": {
                    "$let": {
                        "vars": {
                            "fall2025_registration": {
                                "$filter": {
                                    "input": {"$ifNull": ["$registrations", []]},
                                    "as": "registration",
                                    "cond": {"$eq": ["$$registration.event", event_name]}
                                }
                            }
                        },
                        "in": {
                            "$cond": {
                                "if": {"$gt": [{"$size": "$$fall2025_registration"}, 0]},
                                "then": {"$arrayElemAt": ["$$fall2025_registration.rsvp_time", 0]},
                                "else": None
                            }
                        }
                    }
                },
                "apply_at": {
                    "$let": {
                        "vars": {
                            "fall2025_registration": {
                                "$filter": {
                                    "input": {"$ifNull": ["$registrations", []]},
                                    "as": "registration",
                                    "cond": {"$eq": ["$$registration.event", event_name]}
                                }
                            }
                        },
                        "in": {
                            "$cond": {
                                "if": {"$gt": [{"$size": "$$fall2025_registration"}, 0]},
                                "then": {"$arrayElemAt": ["$$fall2025_registration.apply_at", 0]},
                                "else": None
                            }
                        }
                    }
                },
                # A registration for the current event only exists once the user
                # submitted their application (registrations.apply), so its
                # presence is the submitted flag.
                "submitted": {
                    "$gt": [
                        {
                            "$size": {
                                "$filter": {
                                    "input": {"$ifNull": ["$registrations", []]},
                                    "as": "registration",
                                    "cond": {"$eq": ["$$registration.event", event_name]}
                                }
                            }
                        },
                        0
                    ]
                }
            }
        },
        {
            # The review queue: submitted applications first, oldest submission
            # first, so reviewing can start without waiting for a deadline.
            # Profile-only accounts (null apply_at) fall to the bottom.
            "$sort": {
                "submitted": DESCENDING,
                "apply_at": ASCENDING
            }
        }
    ])

    users = []
    
    for document in cursor:
        if not document.get('is_admin'):
            # `or {}` / `or []`, not .get(key, default): legacy docs store an
            # explicit None for these, which a default would not replace.
            users.append({'id': str(document['_id']), 'username': str(document['username']), 'profile': document.get('profile') or {}, 'email_confirmed': bool(document.get('email_confirmed')), 'registrations': document.get('registrations') or [], 'resume': document.get("resume"), 'vaccination': document.get("vaccination"), 'apply_at': document.get('apply_at'), 'submitted': document.get('submitted', False)})
        


    return {'users': users}, 200


@admin_api.route('/resume', methods=['GET'])
@jwt_required
@check_admin
def get_resume():
    id = request.args.get("id")

    user = db.users.find_one({'_id': ObjectId(id)})

    if ('resume' not in user):
        return jsonify({'msg': 'no resume uploaded!'}, 404)

    s3 = boto3.client('s3')
    object_name = '{}/{}-{}'.format(EVENT_SLUG, id, user['resume'])

    url = s3.generate_presigned_url('get_object',
                                     Params={'Bucket': 'hophacks-resume', 'Key': object_name},
                                     ExpiresIn=600)
    return jsonify({'url': url})



@admin_api.route('/vaccination', methods=['GET'])
@jwt_required
@check_admin
def get_vac():
    id = request.args.get("id")

    user = db.users.find_one({'_id': ObjectId(id)})

    if ('vaccination' not in user):
        return jsonify({'msg': 'no vaccination card uploaded!'}, 404)

    s3 = boto3.client('s3')
    object_name = 'Fall-2024/{}-{}'.format(id, user['vaccination'])

    url = s3.generate_presigned_url('get_object',
                                     Params={'Bucket': 'hophacks-vaccinations', 'Key': object_name},
                                     ExpiresIn=600)
    return jsonify({'url': url})


@admin_api.route('/stats', methods=['GET'])
@jwt_required
@check_admin
def stats():
    """Aggregate registrant demographics for the current event.

    Powers the admin dashboard charts (sponsor decks). Counts each registrant
    once by their current-event registration.

    :resjson total: number of registrants for the current event
    :resjson by_status: counts keyed by registration status
    :resjson by_school / by_level_of_study / by_country / by_gender /
        by_race_ethnicity: counts keyed by that demographic field
    """
    users = db.users.find({
        'is_admin': {'$ne': True},
        'registrations.event': EVENT_NAME
    })

    total = 0
    by_status = {}
    by_school = {}
    by_level_of_study = {}
    by_country = {}
    by_gender = {}
    by_race_ethnicity = {}

    def bump(counter, value):
        key = value if value not in (None, "") else "Unknown"
        counter[key] = counter.get(key, 0) + 1

    for user in users:
        reg = next((r for r in user.get('registrations', []) if r.get('event') == EVENT_NAME), None)
        if reg is None:
            continue
        total += 1
        profile = user.get('profile', {})
        bump(by_status, reg.get('status'))
        bump(by_school, profile.get('school'))
        bump(by_level_of_study, profile.get('level_of_study'))
        bump(by_country, profile.get('country'))
        bump(by_gender, profile.get('gender'))
        bump(by_race_ethnicity, profile.get('race_ethnicity'))

    return jsonify({
        'total': total,
        'by_status': by_status,
        'by_school': by_school,
        'by_level_of_study': by_level_of_study,
        'by_country': by_country,
        'by_gender': by_gender,
        'by_race_ethnicity': by_race_ethnicity,
    }), 200


@admin_api.route('/export', methods=['GET'])
@jwt_required
@check_admin
def export_csv():
    """Export current-event registrants as a CSV attachment."""
    users = db.users.find({
        'is_admin': {'$ne': True},
        'registrations.event': EVENT_NAME
    })

    output = io.StringIO()
    writer = csv.writer(output)
    # The two "Other" options store the real answer in a companion free-text
    # field. Exporting the choice without its text loses the actual school
    # name and the actual dietary restriction, which is exactly what catering
    # and swag need.
    writer.writerow([
        'email', 'first_name', 'last_name', 'school', 'other_school',
        'level_of_study', 'country', 'age', 'status', 'apply_at', 'rsvp',
        'checked_in', 'dietary_restrictions', 'dietary_restrictions_other',
        'tshirt_size', 'essay_project', 'essay_team'
    ])

    for user in users:
        reg = next((r for r in user.get('registrations', []) if r.get('event') == EVENT_NAME), None)
        if reg is None:
            continue
        profile = user.get('profile', {})
        writer.writerow([
            user.get('username', ''),
            profile.get('first_name', ''),
            profile.get('last_name', ''),
            profile.get('school', ''),
            profile.get('otherSchool', ''),
            profile.get('level_of_study', ''),
            profile.get('country', ''),
            profile.get('age', ''),
            reg.get('status', ''),
            reg.get('apply_at', ''),
            reg.get('rsvp', False),
            reg.get('checkin', False),
            profile.get('dietary_restrictions', ''),
            profile.get('dietary_restrictions_other', ''),
            profile.get('tshirt_size', ''),
            profile.get('essay_project', ''),
            profile.get('essay_team', ''),
        ])

    return Response(
        output.getvalue(),
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=hophacks_registrants.csv'}
    )


@admin_api.route('/export_unsubmitted', methods=['GET'])
@jwt_required
@check_admin
def export_unsubmitted_csv():
    """Export accounts from this cycle that never submitted an application.

    The follow-up list: name and contact for everyone who made a profile but
    stopped short of applying, so they can be nudged before the deadline.
    Scoped by account age the same way /users is -- db.users spans every year
    since 2021 and dormant old accounts are not this cycle's dropouts.
    email_confirmed is included because it changes the nudge: unconfirmed
    users are stuck a step earlier and need the confirmation link, not the
    application link.
    """
    users = db.users.find({
        'is_admin': {'$ne': True},
        '_id': {'$gte': ObjectId.from_datetime(EVENT_CYCLE_START)},
        'registrations': {'$not': {'$elemMatch': {'event': EVENT_NAME}}}
    })

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        'email', 'first_name', 'last_name', 'phone_number', 'school',
        'other_school', 'email_confirmed'
    ])

    for user in users:
        profile = user.get('profile') or {}
        writer.writerow([
            user.get('username', ''),
            profile.get('first_name', ''),
            profile.get('last_name', ''),
            profile.get('phone_number', ''),
            profile.get('school', ''),
            profile.get('otherSchool', ''),
            bool(user.get('email_confirmed')),
        ])

    return Response(
        output.getvalue(),
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=hophacks_not_submitted.csv'}
    )


