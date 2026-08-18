"""Regression tests for the 2026-08-17 incident.

A bulk accept wrote 'accepted' to the database, then Gmail refused the SMTP
session. The exception escaped the endpoint as a 500 *after* the statuses
were committed, so applicants were accepted but never emailed -- and the
status guard made every retry a no-op, which looked to the admin like the
Accept button had stopped working.
"""
import sys
sys.path.append('../src')
from unittest import mock

from config.event import EVENT_NAME
from utils import create_json, create_json2
from flow import register_applied, admin_token, bearer


DEAD_SMTP = mock.patch('registrations.mail.connect',
                       side_effect=Exception("SMTP 550 daily quota exceeded"))


def ids_for(test_db, *emails):
    return [str(test_db.users.find_one({'username': e})['_id']) for e in emails]


def reg_of(test_db, email):
    u = test_db.users.find_one({'username': email})
    return next(r for r in u['registrations'] if r['event'] == EVENT_NAME)


def test_dead_smtp_does_not_500_and_reports_the_failures(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
    admin = admin_token(client, test_db)
    targets = ids_for(test_db, 'a@test.com', 'b@test.com')

    with DEAD_SMTP:
        res = client.post('/api/registrations/accept',
                          json={'users': targets}, headers=bearer(admin))

    # The decision stands and the admin is told the emails did not go out.
    assert res.status_code == 200
    assert res.json['num_changed'] == 2
    assert res.json['email_failures'] == 2

    for email in ('a@test.com', 'b@test.com'):
        reg = reg_of(test_db, email)
        assert reg['status'] == 'accepted'
        assert reg['accept_email_sent'] is False


def test_successful_send_is_recorded(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/accept',
                          json={'users': ids_for(test_db, 'a@test.com')},
                          headers=bearer(admin))

    assert res.json['email_failures'] == 0
    assert len(outbox) == 1
    assert reg_of(test_db, 'a@test.com')['accept_email_sent'] is True


def test_resend_reaches_the_stranded_applicants(client, test_db, test_mail):
    """The recovery path: no revert, no status change, they just get the mail."""
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    targets = ids_for(test_db, 'a@test.com')

    with DEAD_SMTP:
        client.post('/api/registrations/accept', json={'users': targets},
                    headers=bearer(admin))
    assert reg_of(test_db, 'a@test.com')['accept_email_sent'] is False

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/resend_acceptance',
                          json={'users': targets}, headers=bearer(admin))

    assert res.status_code == 200
    assert res.json['num_changed'] == 1
    assert len(outbox) == 1
    assert outbox[-1].subject == "Acceptance Letter - HopHacks.com"

    reg = reg_of(test_db, 'a@test.com')
    assert reg['accept_email_sent'] is True
    # Crucially, nothing about their standing moved.
    assert reg['status'] == 'accepted'


def test_resend_does_not_disturb_an_rsvp(client, test_db, test_mail):
    """Why this exists instead of revert-then-re-accept: revert would clear
    an RSVP the applicant had already made."""
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    targets = ids_for(test_db, 'a@test.com')

    client.post('/api/registrations/accept', json={'users': targets},
                headers=bearer(admin))
    from flow import login_token
    from utils import login_json
    token = login_token(client, login_json)
    assert client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME},
                       headers=bearer(token)).status_code == 200

    res = client.post('/api/registrations/resend_acceptance',
                      json={'users': targets}, headers=bearer(admin))
    # Already RSVPed, so they plainly got their letter: skipped, not re-mailed.
    assert res.json['num_changed'] == 0
    assert res.json['skipped'] == targets
    assert reg_of(test_db, 'a@test.com')['status'] == 'rsvped'
    assert reg_of(test_db, 'a@test.com')['rsvp'] is True


def test_resend_requires_admin(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    from flow import login_token
    from utils import login_json
    token = login_token(client, login_json)
    res = client.post('/api/registrations/resend_acceptance',
                      json={'users': ids_for(test_db, 'a@test.com')},
                      headers=bearer(token))
    assert res.status_code == 401


def test_one_bad_recipient_does_not_stop_the_batch(client, test_db, test_mail):
    """A single unsendable address must not strand everyone behind it."""
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
    admin = admin_token(client, test_db)
    targets = ids_for(test_db, 'a@test.com', 'b@test.com')

    real_send = None
    def flaky(self, message):
        if message.recipients == ['a@test.com']:
            raise Exception("550 mailbox unavailable")
        return real_send(self, message)

    from flask_mail import Connection
    real_send = Connection.send
    with mock.patch.object(Connection, 'send', flaky):
        res = client.post('/api/registrations/accept',
                          json={'users': targets}, headers=bearer(admin))

    assert res.status_code == 200
    assert res.json['num_changed'] == 2
    assert res.json['email_failures'] == 1
    assert reg_of(test_db, 'a@test.com')['accept_email_sent'] is False
    assert reg_of(test_db, 'b@test.com')['accept_email_sent'] is True


def test_admin_check_survives_a_doc_without_is_admin(client, test_db, test_mail):
    """A legacy doc missing the field must give a clean 401, not a 500."""
    register_applied(client, test_mail, create_json)
    from flow import login_token
    from utils import login_json
    token = login_token(client, login_json)
    test_db.users.update_one({'username': 'a@test.com'},
                             {'$unset': {'is_admin': ''}})
    res = client.get('/api/admin/users', headers=bearer(token))
    assert res.status_code == 401
