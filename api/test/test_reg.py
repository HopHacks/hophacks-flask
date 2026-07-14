import sys
sys.path.append('../src')

from config.event import EVENT_NAME
from utils import create_json, create_json2, login_json
from flow import register_confirmed, login_token, admin_token, bearer


def _reg(user):
    return next(r for r in user['registrations'] if r['event'] == EVENT_NAME)


def test_accept_marks_and_emails(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    register_confirmed(client, test_mail, create_json2)
    token = admin_token(client, test_db)

    ids = [str(u['_id']) for u in test_db.users.find({'is_admin': {'$ne': True}})]
    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/accept', json={'users': ids}, headers=bearer(token))
        assert res.status_code == 200
        assert len(outbox) == 2

    for u in test_db.users.find({'is_admin': {'$ne': True}}):
        reg = _reg(u)
        assert reg['accept'] is True
        assert reg['status'] == 'accepted'


def test_reject_marks_and_emails(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    token = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a'})['_id'])

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/reject', json={'user': uid}, headers=bearer(token))
        assert res.status_code == 200
        assert len(outbox) == 1

    assert _reg(test_db.users.find_one({'username': 'a'}))['status'] == 'rejected'


def test_waitlist_marks_and_emails(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    token = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a'})['_id'])

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/waitlist', json={'users': [uid]}, headers=bearer(token))
        assert res.status_code == 200
        assert len(outbox) == 1
        assert create_json['profile']['first_name'] in outbox[0].html

    reg = _reg(test_db.users.find_one({'username': 'a'}))
    assert reg['status'] == 'waitlisted'
    assert reg['accept'] is False


def test_waitlist_requires_admin(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    token = login_token(client, login_json)  # non-admin
    uid = str(test_db.users.find_one({'username': 'a'})['_id'])
    res = client.post('/api/registrations/waitlist', json={'users': [uid]}, headers=bearer(token))
    assert res.status_code == 401


def test_waitlisted_then_accepted_enables_rsvp(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a'})['_id'])

    client.post('/api/registrations/waitlist', json={'users': [uid]}, headers=bearer(admin))
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))

    user_token = login_token(client, login_json)
    res = client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(user_token))
    assert res.status_code == 200
    assert _reg(test_db.users.find_one({'username': 'a'}))['status'] == 'rsvped'


def test_checkin_marks(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a'})['_id'])
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))

    res = client.post('/api/registrations/check_in', json={'user': uid}, headers=bearer(admin))
    assert res.status_code == 200
    reg = _reg(test_db.users.find_one({'username': 'a'}))
    assert reg['checkin'] is True
    assert reg['status'] == 'checked_in'


def test_checkin_requires_admin(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    token = login_token(client, login_json)
    uid = str(test_db.users.find_one({'username': 'a'})['_id'])
    res = client.post('/api/registrations/check_in', json={'user': uid}, headers=bearer(token))
    assert res.status_code == 401
