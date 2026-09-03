from util.decorators import check_admin
from db import db
from pymongo import ASCENDING, DESCENDING

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from bson import ObjectId
from bson.errors import InvalidId

import boto3
import botocore.exceptions
import csv
import datetime
import io
import pytz
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


def _object_ids(raw_ids):
    """Parse client ids, or None if any is malformed (a 400, not a 500)."""
    try:
        return [ObjectId(i) for i in raw_ids]
    except (InvalidId, TypeError):
        return None


@admin_api.route('/broadcast', methods=['POST'])
@jwt_required
@check_admin
def broadcast():
    """Send a one-off plain-text email to an explicit list of users.

    The console chunks a large send into several of these calls, all sharing
    one frontend-generated ``broadcast_id``, and every chunk accumulates into
    the same audit document.

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin account

    :reqjson users: List of user ids to email in this chunk
    :reqjson subject: Subject line, without the " - HopHacks.com" suffix
    :reqjson message: Plain-text body as typed
    :reqjson broadcast_id: Client-generated id shared by every chunk of one send
    :reqjson stage: Optional label for what this send was about

    :resjson num_sent: How many emails actually went out
    :resjson email_failures: How many of the requested ids were not emailed
    :resjson failed_ids: Those ids, for the console's "Retry failed" button
    :resjson skipped: Ids this broadcast had already emailed

    :status 200: Successful
    :status 400: Invalid request
    :status 401: Not logged in as admin
    :status 422: Not logged in
    """
    from registrations import send_broadcast

    body = request.json
    if (body is None):
        return jsonify({'msg': 'Invalid request'}), 400

    users = body.get('users')
    subject = body.get('subject')
    message = body.get('message')
    bid = body.get('broadcast_id')
    stage = body.get('stage')

    if (not isinstance(users, list)):
        return jsonify({'msg': 'Invalid request'}), 400
    for value in (subject, message, bid):
        if (not isinstance(value, str) or not value.strip()):
            return jsonify({'msg': 'Invalid request'}), 400
    if (stage is not None and not isinstance(stage, str)):
        return jsonify({'msg': 'Invalid request'}), 400

    ids = _object_ids(users)
    if (ids is None):
        return jsonify({'msg': 'Invalid request'}), 400

    requested = [str(i) for i in ids]

    # API Gateway cuts a Lambda off at 29s, so a chunk can finish sending and
    # still be reported to the browser as failed -- which makes the browser
    # re-attempt it. This guard is what makes that re-attempt safe: anyone
    # this broadcast has already emailed is skipped, not emailed twice.
    doc = db.broadcasts.find_one({'broadcast_id': bid})
    already_sent = set(doc.get('sent_ids') or []) if doc else set()

    skipped = [i for i in requested if i in already_sent]
    targets = list(db.users.find(
        {'_id': {'$in': [i for i in ids if str(i) not in already_sent]}}))

    unsent = {str(u['_id']) for u in send_broadcast(targets, subject, message)}
    sent = [str(u['_id']) for u in targets if str(u['_id']) not in unsent]

    # Anything requested that we cannot confirm sent is failed, including ids
    # with no matching account: reporting them honestly beats hiding them, and
    # a retry will simply fail them again.
    sent_set = set(sent)
    failed = [i for i in requested
              if i not in already_sent and i not in sent_set]

    # $setOnInsert, not $set: chunks of one logical send share the
    # broadcast_id, so only the first chunk defines what was sent and when.
    db.broadcasts.update_one(
        {'broadcast_id': bid},
        {
            '$setOnInsert': {
                'broadcast_id': bid,
                'subject': subject.strip(),
                'message': message,
                'stage': stage or None,
                'sent_by': ObjectId(get_jwt_identity()),
                'sent_at': datetime.datetime.now(pytz.utc)
            },
            '$addToSet': {
                'user_ids': {'$each': requested},
                'sent_ids': {'$each': sent},
                'failed_ids': {'$each': failed}
            }
        },
        upsert=True
    )

    # A re-attempted chunk can succeed for someone an earlier attempt recorded
    # as failed. They have to leave failed_ids, or "Retry failed" would email
    # them a second time. A separate update because $pull and $addToSet may
    # not touch the same field in one.
    if (sent):
        db.broadcasts.update_one(
            {'broadcast_id': bid},
            {'$pull': {'failed_ids': {'$in': sent}}}
        )

    return jsonify({'num_sent': len(sent), 'email_failures': len(failed),
                    'failed_ids': failed, 'skipped': skipped}), 200


@admin_api.route('/broadcast/retry', methods=['POST'])
@jwt_required
@check_admin
def broadcast_retry():
    """Re-send a stored broadcast to the ids it failed on.

    The resume path after Gmail's daily cap. The server decides who is
    eligible -- only ids currently in the broadcast's ``failed_ids`` -- so
    ids already sent, or never part of the send, are ignored rather than
    trusted. That makes a double-send impossible by construction, however the
    console chunks or repeats the request.

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin account

    :reqjson broadcast_id: Id of the broadcast to resume
    :reqjson users: Ids to attempt again

    :status 200: Successful
    :status 400: Invalid request
    :status 401: Not logged in as admin
    :status 404: No such broadcast
    :status 422: Not logged in
    """
    from registrations import send_broadcast

    body = request.json
    if (body is None):
        return jsonify({'msg': 'Invalid request'}), 400

    users = body.get('users')
    bid = body.get('broadcast_id')

    if (not isinstance(users, list)):
        return jsonify({'msg': 'Invalid request'}), 400
    if (not isinstance(bid, str) or not bid.strip()):
        return jsonify({'msg': 'Invalid request'}), 400

    ids = _object_ids(users)
    if (ids is None):
        return jsonify({'msg': 'Invalid request'}), 400

    doc = db.broadcasts.find_one({'broadcast_id': bid})
    if (doc is None):
        return jsonify({'msg': 'No such broadcast'}), 404

    still_failed = set(doc.get('failed_ids') or [])
    eligible = [i for i in ids if str(i) in still_failed]
    skipped = [str(i) for i in ids if str(i) not in still_failed]

    # The stored subject and message, not anything the client sends back: a
    # retry must deliver the same email the first attempt would have.
    targets = list(db.users.find({'_id': {'$in': eligible}}))
    unsent = {str(u['_id']) for u in send_broadcast(
        targets, doc.get('subject') or '', doc.get('message') or '')}
    sent = [str(u['_id']) for u in targets if str(u['_id']) not in unsent]

    if (sent):
        db.broadcasts.update_one(
            {'broadcast_id': bid},
            {'$pull': {'failed_ids': {'$in': sent}},
             '$addToSet': {'sent_ids': {'$each': sent}}}
        )

    sent_set = set(sent)
    failed = [str(i) for i in eligible if str(i) not in sent_set]

    return jsonify({'num_sent': len(sent), 'email_failures': len(failed),
                    'failed_ids': failed, 'skipped': skipped}), 200


@admin_api.route('/broadcast/test', methods=['POST'])
@jwt_required
@check_admin
def broadcast_test():
    """Send the drafted broadcast to the logged-in admin only.

    Goes down the same template path as the real send, so what the admin
    proofreads in their inbox is exactly what recipients would get. Writes no
    audit entry: nothing was broadcast.

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin account

    :reqjson subject: Subject line, without the " - HopHacks.com" suffix
    :reqjson message: Plain-text body as typed

    :status 200: Successful
    :status 400: Invalid request
    :status 401: Not logged in as admin
    :status 422: Not logged in
    """
    from registrations import send_broadcast

    body = request.json
    if (body is None):
        return jsonify({'msg': 'Invalid request'}), 400

    subject = body.get('subject')
    message = body.get('message')
    for value in (subject, message):
        if (not isinstance(value, str) or not value.strip()):
            return jsonify({'msg': 'Invalid request'}), 400

    admin = db.users.find_one({'_id': ObjectId(get_jwt_identity())})
    unsent = send_broadcast([admin], subject, message)

    return jsonify({'num_sent': 0 if unsent else 1,
                    'email_failures': len(unsent)}), 200


@admin_api.route('/broadcast/history', methods=['GET'])
@jwt_required
@check_admin
def broadcast_history():
    """The ten most recent broadcasts, newest first.

    ``failed_ids`` is part of the contract, not a detail: the console's
    "Retry failed" button posts exactly those ids back to /broadcast/retry.

    :reqheader Authorization: ``Bearer <JWT Token>``, needs to be admin account

    :status 200: Successful
    :status 401: Not logged in as admin
    :status 422: Not logged in
    """
    broadcasts = []
    for doc in db.broadcasts.find().sort('sent_at', DESCENDING).limit(10):
        sent_at = doc.get('sent_at')
        sent_by = doc.get('sent_by')
        failed_ids = doc.get('failed_ids') or []
        broadcasts.append({
            'broadcast_id': doc.get('broadcast_id'),
            'subject': doc.get('subject'),
            'message': doc.get('message'),
            'stage': doc.get('stage'),
            'sent_by': str(sent_by) if sent_by else None,
            'sent_at': sent_at.isoformat() if sent_at else None,
            'num_recipients': len(doc.get('user_ids') or []),
            'num_sent': len(doc.get('sent_ids') or []),
            'num_failed': len(failed_ids),
            'failed_ids': failed_ids
        })

    return jsonify({'broadcasts': broadcasts}), 200
