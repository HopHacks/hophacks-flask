import sys
sys.path.append('../src')

from config.event import EVENT_NAME
from utils import create_json, login_json
from flow import register_applied, login_token, admin_token, bearer


def _reg(user):
    return next(r for r in user['registrations'] if r['event'] == EVENT_NAME)


def _uid(test_db, username='a@test.com'):
    return str(test_db.users.find_one({'username': username})['_id'])


def test_revert_requires_admin(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    token = login_token(client, login_json)
    uid = _uid(test_db)
    res = client.post('/api/registrations/revert', json={'users': [uid]}, headers=bearer(token))
    assert res.status_code == 401


def test_revert_accepted_resets_and_sends_no_email(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/revert', json={'users': [uid]}, headers=bearer(admin))
        assert res.status_code == 200
        assert res.json['num_changed'] == 1
        assert len(outbox) == 0

    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['status'] == 'applied'
    assert reg['accept'] is False
    assert 'accept_at' not in reg

    user = login_token(client, login_json)
    res = client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(user))
    assert res.status_code == 400


def test_revert_rsvped_resets_flags(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
    user = login_token(client, login_json)
    client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(user))

    res = client.post('/api/registrations/revert', json={'users': [uid]}, headers=bearer(admin))
    assert res.json['num_changed'] == 1

    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['status'] == 'applied'
    assert reg['rsvp'] is False
    assert 'rsvp_time' not in reg

    res = client.get('/api/registrations/rsvp/status', headers=bearer(user))
    assert res.status_code == 200
    assert res.json['status'] is False


def test_revert_checked_in_resets(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
    client.post('/api/registrations/check_in', json={'user': uid}, headers=bearer(admin))

    res = client.post('/api/registrations/revert', json={'users': [uid]}, headers=bearer(admin))
    assert res.json['num_changed'] == 1

    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['status'] == 'applied'
    assert reg['checkin'] is False
    assert 'checkin_at' not in reg


def test_revert_applied_is_skipped(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)

    res = client.post('/api/registrations/revert', json={'users': [uid]}, headers=bearer(admin))
    assert res.status_code == 200
    assert res.json['num_changed'] == 0
    assert res.json['skipped'] == [uid]


def test_revert_then_accept_reissues_email(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = _uid(test_db)

    with test_mail.record_messages() as outbox:
        client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
        assert len(outbox) == 1
        client.post('/api/registrations/revert', json={'users': [uid]}, headers=bearer(admin))
        assert len(outbox) == 1
        res = client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
        assert res.json['num_changed'] == 1
        assert len(outbox) == 2

    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['status'] == 'accepted'
    assert reg['accept'] is True
