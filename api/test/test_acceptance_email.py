import sys
sys.path.append('../src')

from utils import create_json, create_json2
from flow import register_applied, admin_token, bearer


def test_acceptance_email_carries_the_busing_form(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    uid = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/accept',
                          json={'users': [uid]}, headers=bearer(admin))
        assert res.status_code == 200

    msg = outbox[-1]
    assert 'https://forms.gle/HiTgXEvLA9BG8T5t6' in msg.html, "form link missing from HTML"
    assert 'https://forms.gle/HiTgXEvLA9BG8T5t6' in msg.body, "form link missing from plain text"
    # The link must not be mangled by templating/escaping.
    import re
    hrefs = re.findall(r'href="([^"]*forms\.gle[^"]*)"', msg.html)
    assert hrefs == ['https://forms.gle/HiTgXEvLA9BG8T5t6']
    # Surrounding copy survived templating.
    assert 'busing interest form' in msg.html
    assert 'no commitment' in msg.html


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
