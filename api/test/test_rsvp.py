import sys
sys.path.append('../src')

from config.event import EVENT_NAME
from utils import create_json, login_json
from flow import register_confirmed, login_token, admin_token, bearer


def _reg(user):
    return next(r for r in user['registrations'] if r['event'] == EVENT_NAME)


def _accept_self(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
    return login_token(client, login_json)


def test_rsvp_requires_acceptance(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    token = login_token(client, login_json)
    res = client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(token))
    assert res.status_code == 400


def test_rsvp_success(client, test_db, test_mail):
    token = _accept_self(client, test_db, test_mail)
    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(token))
        assert res.status_code == 200
        assert len(outbox) == 1
    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['rsvp'] is True
    assert reg['status'] == 'rsvped'


def test_rsvp_twice_conflict(client, test_db, test_mail):
    token = _accept_self(client, test_db, test_mail)
    client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(token))
    res = client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(token))
    assert res.status_code == 409


def test_rsvp_cancel(client, test_db, test_mail):
    token = _accept_self(client, test_db, test_mail)
    client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(token))
    res = client.post('/api/registrations/rsvp/cancel', json={'event': EVENT_NAME}, headers=bearer(token))
    assert res.status_code == 200
    reg = _reg(test_db.users.find_one({'username': 'a@test.com'}))
    assert reg['rsvp'] is False
    assert reg['status'] == 'accepted'


def test_rsvp_view(client, test_db, test_mail):
    token = _accept_self(client, test_db, test_mail)
    res = client.get('/api/registrations/rsvp/view', headers=bearer(token))
    assert res.status_code == 200
    assert EVENT_NAME in res.json['allList']

    client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME}, headers=bearer(token))
    res = client.get('/api/registrations/rsvp/view', headers=bearer(token))
    assert EVENT_NAME in res.json['rsvpList']
