"""Tests for the admin console's stage broadcast.

The contract these protect is "nobody gets the same broadcast twice". A large
send is chunked by the browser because API Gateway cuts a Lambda off at 29s,
and a chunk that actually delivered can still be reported to the browser as
failed. So the server, not the client, decides who still needs an email: the
primary send skips anyone already in the broadcast's ``sent_ids``, and the
retry path will only mail ids currently sitting in ``failed_ids``.
"""
import sys
sys.path.append('../src')
from unittest import mock

from utils import create_json, create_json2, create_json3
from flow import register_applied, admin_token, bearer, login_token


DEAD_SMTP = mock.patch('registrations.mail.connect',
                       side_effect=Exception("SMTP 550 daily quota exceeded"))

SUBJECT = "Schedule update"
MESSAGE = "Doors open at 6pm.\n\nBring your ID."


def ids_for(test_db, *emails):
    return [str(test_db.users.find_one({'username': e})['_id']) for e in emails]


def post_broadcast(client, admin, users, bid='bcast-1', subject=SUBJECT,
                   message=MESSAGE, **extra):
    payload = {'users': users, 'subject': subject, 'message': message,
               'broadcast_id': bid}
    payload.update(extra)
    return client.post('/api/admin/broadcast', json=payload,
                       headers=bearer(admin))


def test_broadcast_sends_and_records_the_audit(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
    admin = admin_token(client, test_db)
    targets = ids_for(test_db, 'a@test.com', 'b@test.com')

    with test_mail.record_messages() as outbox:
        res = post_broadcast(client, admin, targets, stage='accepted')

    assert res.status_code == 200
    assert res.json['num_sent'] == 2
    assert res.json['email_failures'] == 0
    assert res.json['failed_ids'] == []
    assert res.json['skipped'] == []

    assert len(outbox) == 2
    assert {m.subject for m in outbox} == {SUBJECT + " - HopHacks.com"}
    assert sorted(r for m in outbox for r in m.recipients) == ['a@test.com',
                                                               'b@test.com']

    andrew = next(m for m in outbox if m.recipients == ['a@test.com'])
    assert 'Hi Andrew,' in andrew.html
    assert 'Doors open at 6pm.' in andrew.html
    assert 'Bring your ID.' in andrew.html
    # The text/plain alternative is what an HTML-disabled client shows, so it
    # is the typed message untouched.
    assert andrew.body == MESSAGE

    doc = test_db.broadcasts.find_one({'broadcast_id': 'bcast-1'})
    assert doc is not None
    assert set(doc['sent_ids']) == set(targets)
    assert doc['failed_ids'] == []
    assert set(doc['user_ids']) == set(targets)
    assert doc['stage'] == 'accepted'
    # Stored without the suffix: the console re-displays what was typed.
    assert doc['subject'] == SUBJECT
    assert doc['message'] == MESSAGE
    assert str(doc['sent_by']) == str(test_db.users.find_one(
        {'username': 'admin'})['_id'])
    assert doc['sent_at'] is not None


def test_broadcast_requires_admin(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    token = login_token(client, {'username': create_json['username'],
                                 'password': create_json['password']})

    assert client.post('/api/admin/broadcast',
                       json={'users': [], 'subject': SUBJECT,
                             'message': MESSAGE, 'broadcast_id': 'b'},
                       headers=bearer(token)).status_code == 401
    assert client.post('/api/admin/broadcast/retry',
                       json={'users': [], 'broadcast_id': 'b'},
                       headers=bearer(token)).status_code == 401
    assert client.post('/api/admin/broadcast/test',
                       json={'subject': SUBJECT, 'message': MESSAGE},
                       headers=bearer(token)).status_code == 401
    assert client.get('/api/admin/broadcast/history',
                      headers=bearer(token)).status_code == 401


def test_broadcast_rejects_a_malformed_request(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    good = ids_for(test_db, 'a@test.com')

    full = {'users': good, 'subject': SUBJECT, 'message': MESSAGE,
            'broadcast_id': 'bcast-1'}
    for missing in ('users', 'subject', 'message', 'broadcast_id'):
        payload = {k: v for k, v in full.items() if k != missing}
        res = client.post('/api/admin/broadcast', json=payload,
                          headers=bearer(admin))
        assert res.status_code == 400, missing

    for blank in ('subject', 'message', 'broadcast_id'):
        payload = dict(full, **{blank: '   '})
        assert client.post('/api/admin/broadcast', json=payload,
                           headers=bearer(admin)).status_code == 400

    assert post_broadcast(client, admin, 'not-a-list').status_code == 400
    assert post_broadcast(client, admin, ['not-an-objectid']).status_code == 400
    assert post_broadcast(client, admin, good, stage=7).status_code == 400


def test_dead_smtp_reports_every_id_as_failed(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
    admin = admin_token(client, test_db)
    targets = ids_for(test_db, 'a@test.com', 'b@test.com')

    with DEAD_SMTP:
        res = post_broadcast(client, admin, targets)

    assert res.status_code == 200
    assert res.json['num_sent'] == 0
    assert res.json['email_failures'] == 2
    assert set(res.json['failed_ids']) == set(targets)

    doc = test_db.broadcasts.find_one({'broadcast_id': 'bcast-1'})
    assert set(doc['failed_ids']) == set(targets)
    assert doc['sent_ids'] == []


def test_test_send_goes_only_to_the_admin_and_writes_no_audit(
        client, test_db, test_mail):
    admin = admin_token(client, test_db)

    with test_mail.record_messages() as outbox:
        res = client.post('/api/admin/broadcast/test',
                          json={'subject': SUBJECT, 'message': MESSAGE},
                          headers=bearer(admin))

    assert res.status_code == 200
    assert res.json['num_sent'] == 1
    assert res.json['email_failures'] == 0
    assert len(outbox) == 1
    assert outbox[0].recipients == ['admin']
    assert outbox[0].subject == SUBJECT + " - HopHacks.com"
    # A proof copy is not a broadcast; nothing to audit or retry.
    assert test_db.broadcasts.find_one({}) is None


def test_test_send_rejects_a_blank_draft(client, test_db, test_mail):
    admin = admin_token(client, test_db)
    for payload in ({'message': MESSAGE}, {'subject': SUBJECT},
                    {'subject': ' ', 'message': MESSAGE}):
        assert client.post('/api/admin/broadcast/test', json=payload,
                           headers=bearer(admin)).status_code == 400


def test_chunks_accumulate_into_one_audit_document(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
    admin = admin_token(client, test_db)
    a, b = ids_for(test_db, 'a@test.com', 'b@test.com')

    assert post_broadcast(client, admin, [a]).status_code == 200
    first = test_db.broadcasts.find_one({'broadcast_id': 'bcast-1'})
    assert post_broadcast(client, admin, [b]).status_code == 200

    assert test_db.broadcasts.count_documents({}) == 1
    doc = test_db.broadcasts.find_one({'broadcast_id': 'bcast-1'})
    assert set(doc['user_ids']) == {a, b}
    assert set(doc['sent_ids']) == {a, b}
    # $setOnInsert: the second chunk must not restamp the send.
    assert doc['sent_at'] == first['sent_at']

    res = client.get('/api/admin/broadcast/history', headers=bearer(admin))
    assert res.status_code == 200
    assert len(res.json['broadcasts']) == 1
    row = res.json['broadcasts'][0]
    assert row['broadcast_id'] == 'bcast-1'
    assert row['num_recipients'] == 2
    assert row['num_sent'] == 2
    assert row['num_failed'] == 0
    assert row['failed_ids'] == []
    assert row['subject'] == SUBJECT
    assert row['message'] == MESSAGE
    assert row['stage'] is None
    assert isinstance(row['sent_at'], str)
    assert isinstance(row['sent_by'], str)


def test_retry_never_double_sends(client, test_db, test_mail):
    """The whole point of the feature: a resumed send reaches exactly the
    people the first attempt missed, no matter how often it is run."""
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
    admin = admin_token(client, test_db)
    a, b = ids_for(test_db, 'a@test.com', 'b@test.com')

    assert post_broadcast(client, admin, [a]).json['num_sent'] == 1
    with DEAD_SMTP:
        assert post_broadcast(client, admin, [b]).json['email_failures'] == 1

    with test_mail.record_messages() as outbox:
        res = client.post('/api/admin/broadcast/retry',
                          json={'broadcast_id': 'bcast-1', 'users': [a, b]},
                          headers=bearer(admin))

    assert res.status_code == 200
    assert res.json['num_sent'] == 1
    assert res.json['skipped'] == [a]
    assert res.json['failed_ids'] == []
    assert len(outbox) == 1
    assert outbox[0].recipients == ['b@test.com']
    assert outbox[0].subject == SUBJECT + " - HopHacks.com"

    doc = test_db.broadcasts.find_one({'broadcast_id': 'bcast-1'})
    assert set(doc['sent_ids']) == {a, b}
    assert doc['failed_ids'] == []

    # Retrying the same ids again is now a no-op, not a second copy.
    with test_mail.record_messages() as outbox:
        res = client.post('/api/admin/broadcast/retry',
                          json={'broadcast_id': 'bcast-1', 'users': [a, b]},
                          headers=bearer(admin))

    assert res.status_code == 200
    assert res.json['num_sent'] == 0
    assert res.json['skipped'] == [a, b]
    assert len(outbox) == 0


def test_retry_ignores_ids_outside_the_broadcast(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json3)
    admin = admin_token(client, test_db)
    a, c = ids_for(test_db, 'a@test.com', 'c@test.com')

    with DEAD_SMTP:
        post_broadcast(client, admin, [a])

    with test_mail.record_messages() as outbox:
        res = client.post('/api/admin/broadcast/retry',
                          json={'broadcast_id': 'bcast-1', 'users': [c]},
                          headers=bearer(admin))

    assert res.status_code == 200
    assert res.json['num_sent'] == 0
    assert res.json['skipped'] == [c]
    assert len(outbox) == 0
    # The one who really did fail is untouched, still awaiting a retry.
    assert test_db.broadcasts.find_one(
        {'broadcast_id': 'bcast-1'})['failed_ids'] == [a]


def test_retry_on_an_unknown_broadcast_is_404(client, test_db, test_mail):
    admin = admin_token(client, test_db)
    res = client.post('/api/admin/broadcast/retry',
                      json={'broadcast_id': 'never-sent', 'users': []},
                      headers=bearer(admin))
    assert res.status_code == 404
    assert res.json['msg'] == 'No such broadcast'


def test_message_is_escaped_in_html_and_verbatim_in_text(
        client, test_db, test_mail):
    """The admin types into a plain textarea, so the body is untrusted markup
    as far as the HTML part is concerned."""
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    message = ('Hello <script>alert(1)</script> & friends\n\n'
               'Second "paragraph" <b>bold</b>')

    with test_mail.record_messages() as outbox:
        res = post_broadcast(client, admin, ids_for(test_db, 'a@test.com'),
                             message=message)

    assert res.status_code == 200
    html = outbox[0].html
    assert '&lt;script&gt;' in html
    assert '&amp; friends' in html
    assert '&lt;b&gt;bold&lt;/b&gt;' in html
    assert '<script>' not in html
    assert '<b>bold</b>' not in html

    # Blank line -> a separate <p>, so the two blocks are not run together.
    first = html.index('&amp; friends')
    second = html.index('&lt;b&gt;bold&lt;/b&gt;')
    assert first < second
    assert '</p>' in html[first:second]

    # text/plain carries no markup risk and must stay exactly as typed.
    assert outbox[0].body == message
    assert '<script>' in outbox[0].body
    assert '&' in outbox[0].body


def test_single_newline_becomes_a_line_break(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    message = 'Line one\nLine two'

    with test_mail.record_messages() as outbox:
        post_broadcast(client, admin, ids_for(test_db, 'a@test.com'),
                       message=message)

    assert 'Line one<br />Line two' in outbox[0].html
    assert outbox[0].body == 'Line one\nLine two'


def test_a_null_profile_still_gets_the_email(client, test_db, test_mail):
    """Some prod accounts store profile: None; the greeting must degrade to
    "Hi," rather than 500 the whole chunk."""
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    test_db.users.update_one({'username': 'a@test.com'},
                             {'$set': {'profile': None}})

    with test_mail.record_messages() as outbox:
        res = post_broadcast(client, admin, ids_for(test_db, 'a@test.com'))

    assert res.status_code == 200
    assert res.json['num_sent'] == 1
    assert len(outbox) == 1
    assert 'Hi,' in outbox[0].html
    assert 'Hi ,' not in outbox[0].html


def test_resending_the_same_chunk_skips_everyone(client, test_db, test_mail):
    """The re-attempt a 29s API Gateway timeout provokes: same chunk, same
    broadcast_id, and not one duplicate email."""
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
    admin = admin_token(client, test_db)
    targets = ids_for(test_db, 'a@test.com', 'b@test.com')

    assert post_broadcast(client, admin, targets).json['num_sent'] == 2

    with test_mail.record_messages() as outbox:
        res = post_broadcast(client, admin, targets)

    assert res.status_code == 200
    assert res.json['num_sent'] == 0
    assert res.json['email_failures'] == 0
    assert res.json['skipped'] == targets
    assert len(outbox) == 0


def test_a_re_attempted_chunk_that_succeeds_leaves_the_retry_list(
        client, test_db, test_mail):
    """Gmail refuses the session, the browser re-attempts the same chunk once
    mail is back and it goes through. That person must drop out of failed_ids,
    or "Retry failed" would send them a second copy."""
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    (a,) = ids_for(test_db, 'a@test.com')

    with DEAD_SMTP:
        assert post_broadcast(client, admin, [a]).json['email_failures'] == 1
    assert post_broadcast(client, admin, [a]).json['num_sent'] == 1

    doc = test_db.broadcasts.find_one({'broadcast_id': 'bcast-1'})
    assert doc['sent_ids'] == [a]
    assert doc['failed_ids'] == []

    with test_mail.record_messages() as outbox:
        res = client.post('/api/admin/broadcast/retry',
                          json={'broadcast_id': 'bcast-1', 'users': [a]},
                          headers=bearer(admin))
    assert res.json['skipped'] == [a]
    assert len(outbox) == 0
