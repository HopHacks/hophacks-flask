from util.decorators import check_admin
from db import db
from pymongo import ASCENDING, DESCENDING

from flask import Blueprint, request, Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from bson import ObjectId
from bson.errors import InvalidId

import boto3
import botocore.exceptions
from botocore.config import Config as BotoConfig
import csv
import datetime
import io
import pytz
import time
import traceback
from werkzeug.utils import secure_filename

from config.event import EVENT_NAME, EVENT_SLUG, EVENT_CYCLE_START
from resumes import BUCKET as RESUME_BUCKET
from util.github_from_resume import github_url_from_resume_bytes, github_url_from_text

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
        'level_of_study', 'country', 'age', 'gender', 'status', 'apply_at', 'rsvp',
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
            profile.get('gender', ''),
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


def _csv_cell(value):
    if value is None:
        return 'N/A'
    text = str(value).replace('\x00', '').strip()
    return text if text else 'N/A'


# Keys the sponsor-info extractor may request, in CSV header form.
SPONSOR_INFO_FIELDS = {
    'name': 'name',
    'email': 'email',
    'phone': 'phone number',
    'grad_year': 'graduation year',
    'linkedin_url': 'LinkedIn profile URL',
    'github_url': 'GitHub profile URL',
    'school': 'school',
    'major': 'major',
    'first_name': 'first name',
    'last_name': 'last name',
}

# Same ladder as the Applications status filter. "all" is every current-event
# registrant; the rest match that event's registrations[].status.
SPONSOR_INFO_STATUSES = (
    'all',
    'applied',
    'accepted',
    'waitlisted',
    'rsvped',
    'checked_in',
    'rejected',
)

# API Gateway cuts the request at 29s. Resume scraping must finish (or give
# up) before that, or the whole CSV 504s. Misses become N/A. Sequential on
# purpose: a thread pool on Lambda was 500ing the GitHub column in prod.
S3_EXPORT_DEADLINE_S = 20.0
MAX_RESUME_SCAN_BYTES = 2 * 1024 * 1024


def _github_from_profile(user):
    """GitHub URL stored on the account, or None if we have to look at the resume."""
    profile = user.get('profile')
    if not isinstance(profile, dict):
        return None
    for key in ('github_url', 'github'):
        val = profile.get(key)
        if val is None:
            continue
        from_profile = github_url_from_text(val)
        if from_profile:
            return from_profile
        raw = str(val).strip()
        if raw:
            return raw
    return None


def _github_from_resume(user, s3_client):
    """Scrape github.com/<user> from the resume object; N/A on any failure."""
    filename = user.get('resume')
    if not filename or s3_client is None:
        return 'N/A'

    object_name = '{}/{}-{}'.format(EVENT_SLUG, user['_id'], filename)
    try:
        body = s3_client.get_object(
            Bucket=RESUME_BUCKET, Key=object_name
        )['Body'].read(MAX_RESUME_SCAN_BYTES)
        return github_url_from_resume_bytes(body, filename) or 'N/A'
    except Exception:
        return 'N/A'


def _s3_client_or_none():
    try:
        return boto3.client('s3', config=BotoConfig(
            connect_timeout=2,
            read_timeout=3,
            retries={'max_attempts': 1},
        ))
    except Exception:
        return None


def _github_column(users):
    """Map user _id -> GitHub URL, scraping resumes until the Gateway deadline."""
    github_by_id = {}
    need_resume = []
    for user in users:
        from_profile = _github_from_profile(user)
        if from_profile:
            github_by_id[user['_id']] = from_profile
        elif user.get('resume'):
            need_resume.append(user)
        else:
            github_by_id[user['_id']] = 'N/A'

    if not need_resume:
        return github_by_id

    deadline = time.monotonic() + S3_EXPORT_DEADLINE_S
    if time.monotonic() >= deadline:
        for user in need_resume:
            github_by_id[user['_id']] = 'N/A'
        return github_by_id

    s3_client = _s3_client_or_none()
    for user in need_resume:
        if time.monotonic() >= deadline:
            github_by_id[user['_id']] = 'N/A'
            continue
        github_by_id[user['_id']] = _github_from_resume(user, s3_client)
    return github_by_id


def _current_event_users(status):
    elem = {'event': EVENT_NAME}
    if status != 'all':
        elem['status'] = status
    return list(db.users.find({
        'is_admin': {'$ne': True},
        'registrations': {'$elemMatch': elem},
    }))


def _display_name(user):
    profile = user.get('profile') if isinstance(user.get('profile'), dict) else {}
    return '{} {}'.format(
        profile.get('first_name') or '',
        profile.get('last_name') or '',
    ).strip()


def _resume_zip_name(user, used):
    """Unique zip entry like Last_First_email.pdf."""
    profile = user.get('profile') if isinstance(user.get('profile'), dict) else {}
    first = secure_filename(str(profile.get('first_name') or 'unknown')) or 'unknown'
    last = secure_filename(str(profile.get('last_name') or 'unknown')) or 'unknown'
    email = secure_filename(str(user.get('username') or user['_id'])) or 'user'
    original = str(user.get('resume') or 'resume.pdf')
    ext = original.rsplit('.', 1)[-1].lower() if '.' in original else 'pdf'
    if ext not in ('pdf', 'doc', 'docx'):
        ext = 'pdf'
    base = '{}_{}_{}'.format(last, first, email)
    name = '{}.{}'.format(base, ext)
    n = 2
    while name in used:
        name = '{}_{}.{}'.format(base, n, ext)
        n += 1
    used.add(name)
    return name


def _sponsor_field_value(user, key, github_by_id):
    profile = user.get('profile') if isinstance(user.get('profile'), dict) else {}
    if key == 'name':
        return _csv_cell(_display_name(user))
    if key == 'email':
        return _csv_cell(user.get('username'))
    if key == 'phone':
        return _csv_cell(profile.get('phone_number'))
    if key == 'grad_year':
        return _csv_cell(profile.get('grad_year'))
    if key == 'linkedin_url':
        return _csv_cell(profile.get('linkedin_url'))
    if key == 'github_url':
        return github_by_id.get(user['_id'], 'N/A')
    if key == 'school':
        return _csv_cell(profile.get('otherSchool') or profile.get('school'))
    if key == 'major':
        return _csv_cell(profile.get('major'))
    if key == 'first_name':
        return _csv_cell(profile.get('first_name'))
    if key == 'last_name':
        return _csv_cell(profile.get('last_name'))
    return 'N/A'


def _parse_sponsor_info_request():
    """(fields, status) or a (response, code) error tuple in the third slot."""
    if request.method == 'GET':
        raw = request.args.get('fields') or ''
        raw_fields = [part.strip() for part in raw.split(',') if part.strip()]
        status = (request.args.get('status') or 'all').strip().lower()
    else:
        body = request.get_json(silent=True) or {}
        raw_fields = body.get('fields')
        status = str(body.get('status') or 'all').strip().lower()

    if not isinstance(raw_fields, list) or not raw_fields:
        return None, None, (jsonify({'error': 'Select at least one field'}), 400)

    fields = []
    for item in raw_fields:
        if not isinstance(item, str) or item not in SPONSOR_INFO_FIELDS:
            return None, None, (
                jsonify({'error': 'Unknown field: {}'.format(item)}), 400)
        if item not in fields:
            fields.append(item)

    if status not in SPONSOR_INFO_STATUSES:
        return None, None, (
            jsonify({'error': 'Unknown status: {}'.format(status)}), 400)

    return fields, status, None


@admin_api.route('/export_sponsor_info', methods=['GET', 'POST'])
@jwt_required
@check_admin
def export_sponsor_info_csv():
    """CSV of current-event applicants for the requested account fields.

    GitHub is not a signup field: when ``github_url`` is requested it is
    scraped from the resume and filled with N/A if nothing is found. Resume
    fetches are sequential and stop after ``S3_EXPORT_DEADLINE_S`` so a bad
    PDF or Lambda thread pool cannot 500 the whole export.

    Filter with ``status`` (applied / accepted / waitlisted / rsvped /
    checked_in / rejected, or all). GET query params match the other admin
    CSV downloads; POST JSON is still accepted.
    """
    try:
        fields, status, err = _parse_sponsor_info_request()
        if err is not None:
            return err

        users = _current_event_users(status)
        github_by_id = {}
        if 'github_url' in fields:
            try:
                github_by_id = _github_column(users)
            except Exception:
                github_by_id = {user['_id']: 'N/A' for user in users}

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([SPONSOR_INFO_FIELDS[key] for key in fields])

        for user in users:
            writer.writerow([
                _sponsor_field_value(user, key, github_by_id) for key in fields
            ])

        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=hophacks_sponsor_info.csv'}
        )
    except Exception as exc:
        return jsonify({
            'error': 'Export failed: {}'.format(exc),
            'traceback': traceback.format_exc().splitlines()[-25:],
        }), 500


@admin_api.route('/export_resumes', methods=['GET'])
@jwt_required
@check_admin
def export_resumes_manifest():
    """JSON list of current-event applicants who have a resume on file.

    The zip is built in the browser (API Gateway cannot return a multi-resume
    zip under its 6MB cap). Each row is fetched one-at-a-time via
    ``/resume_file``.
    """
    status = (request.args.get('status') or 'all').strip().lower()
    if status not in SPONSOR_INFO_STATUSES:
        return jsonify({'error': 'Unknown status: {}'.format(status)}), 400

    users = _current_event_users(status)
    used_names = set()
    resumes = []
    missing = 0
    for user in users:
        if not user.get('resume'):
            missing += 1
            continue
        resumes.append({
            'id': str(user['_id']),
            'filename': user.get('resume'),
            'zip_name': _resume_zip_name(user, used_names),
            'name': _display_name(user),
            'email': user.get('username') or '',
        })
    return jsonify({'resumes': resumes, 'missing': missing})


@admin_api.route('/resume_file', methods=['GET'])
@jwt_required
@check_admin
def resume_file():
    """Raw resume bytes for one applicant (the zip builder's per-file fetch)."""
    raw_id = request.args.get('id')
    try:
        oid = ObjectId(raw_id)
    except (InvalidId, TypeError):
        return jsonify({'error': 'Invalid id'}), 400

    user = db.users.find_one({'_id': oid})
    if not user or not user.get('resume'):
        return jsonify({'error': 'No resume uploaded'}), 404

    object_name = '{}/{}-{}'.format(EVENT_SLUG, user['_id'], user['resume'])
    try:
        body = boto3.client('s3').get_object(
            Bucket=RESUME_BUCKET, Key=object_name
        )['Body'].read()
    except Exception:
        return jsonify({'error': 'Resume could not be read from storage'}), 404

    filename = secure_filename(str(user.get('resume'))) or 'resume.pdf'
    return Response(
        body,
        mimetype='application/octet-stream',
        headers={
            'Content-Disposition': 'attachment; filename={}'.format(filename)
        },
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
