import sys
sys.path.append('../src')

from config.event import EVENT_NAME
from utils import create_json, create_json2, login_json
from flow import register_applied, login_token, admin_token, bearer


def _reg(user):
    return next(r for r in user['registrations'] if r['event'] == EVENT_NAME)


def test_accept_marks_and_emails(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
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
    register_applied(client, test_mail, create_json)
    token = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/reject', json={'user': uid}, headers=bearer(token))
        assert res.status_code == 200
        assert len(outbox) == 1

    assert _reg(test_db.users.find_one({'username': 'a@test.com'}))['status'] == 'rejected'


def test_waitlist_marks_and_emails(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    token = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/waitlist', json={'users': [uid]}, headers=bearer(token))
        assert res.status_code == 200
        assert len(outbox) == 1
        assert create_json['profile']['first_name'] in outbox[0].html

    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['status'] == 'waitlisted'
    assert reg['accept'] is False


def test_waitlist_requires_admin(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    token = login_token(client, login_json)  # non-admin
    uid = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])
    res = client.post('/api/registrations/waitlist', json={'users': [uid]}, headers=bearer(token))
    assert res.status_code == 401


def test_waitlisted_then_accepted_enables_rsvp(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])

    client.post('/api/registrations/waitlist', json={'users': [uid]}, headers=bearer(admin))
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))

    user_token = login_token(client, login_json)
    res = client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(user_token))
    assert res.status_code == 200
    assert _reg(test_db.users.find_one({'username': 'a@test.com'}))['status'] == 'rsvped'


def test_checkin_marks(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))

    res = client.post('/api/registrations/check_in', json={'user': uid}, headers=bearer(admin))
    assert res.status_code == 200
    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['checkin'] is True
    assert reg['status'] == 'checked_in'


def test_checkin_requires_admin(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    token = login_token(client, login_json)
    uid = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])
    res = client.post('/api/registrations/check_in', json={'user': uid}, headers=bearer(token))
    assert res.status_code == 401


def _uid(test_db, username='a@test.com'):
    return str(test_db.users.find_one({'username': username})['_id'])


def test_accept_twice_sends_one_email(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)

    with test_mail.record_messages() as outbox:
        client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
        assert len(outbox) == 1
        res = client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
        assert res.status_code == 200
        assert res.json['num_changed'] == 0
        assert res.json['skipped'] == [uid]
        assert len(outbox) == 1


def test_accept_mixed_batch_emails_only_transitioned(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
    admin = admin_token(client, test_db)
    uid_a = _uid(test_db)
    uid_b = _uid(test_db, 'b@test.com')

    client.post('/api/registrations/accept', json={'users': [uid_a]}, headers=bearer(admin))
    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/accept', json={'users': [uid_a, uid_b]}, headers=bearer(admin))
        assert res.json['num_changed'] == 1
        assert res.json['skipped'] == [uid_a]
        assert len(outbox) == 1
        assert outbox[0].recipients == ['b@test.com']


def test_accept_skips_rsvped(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
    user = login_token(client, login_json)
    client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(user))

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
        assert res.json['num_changed'] == 0
        assert len(outbox) == 0

    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['status'] == 'rsvped'
    assert reg['rsvp'] is True


def test_waitlist_twice_sends_one_email(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)

    with test_mail.record_messages() as outbox:
        client.post('/api/registrations/waitlist', json={'users': [uid]}, headers=bearer(admin))
        assert len(outbox) == 1
        res = client.post('/api/registrations/waitlist', json={'users': [uid]}, headers=bearer(admin))
        assert res.status_code == 200
        assert res.json['num_changed'] == 0
        assert res.json['skipped'] == [uid]
        assert len(outbox) == 1


def test_waitlist_skips_rsvped(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
    user = login_token(client, login_json)
    client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(user))

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/waitlist', json={'users': [uid]}, headers=bearer(admin))
        assert res.json['num_changed'] == 0
        assert len(outbox) == 0

    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['status'] == 'rsvped'
    assert reg['accept'] is True


def test_reject_bulk_marks_and_emails(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
    admin = admin_token(client, test_db)
    ids = [_uid(test_db), _uid(test_db, 'b@test.com')]

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/reject', json={'users': ids}, headers=bearer(admin))
        assert res.status_code == 200
        assert res.json['num_changed'] == 2
        assert len(outbox) == 2

    for username in ('a@test.com', 'b@test.com'):
        reg = _reg(test_db.users.find_one({'username': username}))
        assert reg['status'] == 'rejected'
        assert reg['accept'] is False


def test_reject_clears_accept_and_blocks_rsvp(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
    client.post('/api/registrations/reject', json={'users': [uid]}, headers=bearer(admin))

    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['status'] == 'rejected'
    assert reg['accept'] is False

    user = login_token(client, login_json)
    res = client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(user))
    assert res.status_code == 400


def test_reject_twice_sends_one_email(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)

    with test_mail.record_messages() as outbox:
        client.post('/api/registrations/reject', json={'users': [uid]}, headers=bearer(admin))
        assert len(outbox) == 1
        res = client.post('/api/registrations/reject', json={'users': [uid]}, headers=bearer(admin))
        assert res.status_code == 200
        assert res.json['num_changed'] == 0
        assert res.json['skipped'] == [uid]
        assert len(outbox) == 1


def test_reject_skips_rsvped(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
    admin = admin_token(client, test_db)
    uid_a = _uid(test_db)
    uid_b = _uid(test_db, 'b@test.com')
    client.post('/api/registrations/accept', json={'users': [uid_a]}, headers=bearer(admin))
    user = login_token(client, login_json)
    client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(user))

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/reject', json={'users': [uid_a, uid_b]}, headers=bearer(admin))
        assert res.json['num_changed'] == 1
        assert res.json['skipped'] == [uid_a]
        assert len(outbox) == 1

    assert _reg(test_db.users.find_one({'username': 'a@test.com'}))['status'] == 'rsvped'
    assert _reg(test_db.users.find_one({'username': 'b@test.com'}))['status'] == 'rejected'


def test_rejected_then_accepted_allowed(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)

    with test_mail.record_messages() as outbox:
        client.post('/api/registrations/reject', json={'users': [uid]}, headers=bearer(admin))
        res = client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
        assert res.json['num_changed'] == 1
        assert len(outbox) == 2

    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['status'] == 'accepted'
    assert reg['accept'] is True
