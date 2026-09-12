import sys
sys.path.append('../src')

from utils import create_json, create_json2
from flow import register_applied, admin_token, bearer


BUSING = 'https://forms.gle/MX3EuWBdkbyqdhNy7'
PARKING = 'https://forms.gle/7K5wPURLZJoa1cK58'


def test_acceptance_email_carries_the_busing_and_parking_forms(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/accept',
                          json={'users': [uid]}, headers=bearer(admin))
        assert res.status_code == 200

    msg = outbox[-1]
    for url in (BUSING, PARKING):
        assert url in msg.html, "form link missing from HTML"
        assert url in msg.body, "form link missing from plain text"
    # The links must not be mangled by templating/escaping, and the retired
    # interest-only form must be gone.
    import re
    hrefs = re.findall(r'href="([^"]*forms\.gle[^"]*)"', msg.html)
    assert hrefs == [BUSING, PARKING]
    assert 'HiTgXEvLA9BG8T5t6' not in msg.html + msg.body
    # Surrounding copy survived templating in both parts.
    assert 'busing RSVP form' in msg.html
    assert 'parking pass request form' in msg.html
    assert 'busing RSVP form' in msg.body
    assert 'parking pass request form' in msg.body
    # The pre-event guide is promised on RSVP, not on a date that has passed.
    assert 'late August' not in msg.html


def test_other_decision_emails_do_not_mention_busing(client, test_db, test_mail):
    """Rejected and waitlisted applicants must not be invited onto a bus."""
    register_applied(client, test_mail, create_json)
    register_applied(client, test_mail, create_json2)
    admin = admin_token(client, test_db)
    a = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])
    b = str(test_db.users.find_one({'username': 'b@test.com'})['_id'])

    with test_mail.record_messages() as outbox:
        client.post('/api/registrations/reject', json={'users': [a]}, headers=bearer(admin))
        client.post('/api/registrations/waitlist', json={'users': [b]}, headers=bearer(admin))

    for msg in outbox:
        assert 'forms.gle' not in (msg.html or ''), msg.subject
        assert 'forms.gle' not in (msg.body or ''), msg.subject



def test_rsvp_info_email_carries_the_busing_and_parking_forms(client, test_db, test_mail):
    """The RSVP confirmation is the email people actually plan the weekend
    from, so both forms have to be in it, in the HTML and the text part."""
    from config.event import EVENT_NAME
    from flow import login_token
    from utils import login_json
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])
    client.post('/api/registrations/accept', json={'users': [uid]}, headers=bearer(admin))
    token = login_token(client, login_json)

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/rsvp/rsvp', json={'event': EVENT_NAME},
                          headers=bearer(token))
        assert res.status_code == 200

    msg = outbox[-1]
    assert msg.subject == "RSVP Event Info - HopHacks.com"
    for url in (BUSING, PARKING):
        assert url in msg.html
        assert url in msg.body
    assert 'HiTgXEvLA9BG8T5t6' not in msg.html + msg.body
