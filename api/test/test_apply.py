import sys
sys.path.append('../src')

from config.event import EVENT_NAME
from utils import create_json, login_json
from flow import register_confirmed, login_token, bearer


ESSAYS = {
    "essay_project": "The compiler I wrote, and why I dropped the optimizer.",
    "essay_team": "I was the one who kept the scope honest.",
}


def confirmed_token(client, test_mail):
    """An account that has confirmed its email but not applied."""
    register_confirmed(client, test_mail, create_json)
    return login_token(client, login_json)


def test_apply_submits_the_application(client, test_db, test_mail):
    token = confirmed_token(client, test_mail)

    with test_mail.record_messages() as outbox:
        res = client.post('/api/registrations/apply', json=ESSAYS,
                          headers=bearer(token))
        assert res.status_code == 200
        assert len(outbox) == 1
        assert "Received Application" in outbox[-1].subject

    user = test_db.users.find_one({'username': "a@test.com"})
    assert user['profile']['essay_project'] == ESSAYS['essay_project']
    assert user['profile']['essay_team'] == ESSAYS['essay_team']

    regs = user['registrations']
    assert len(regs) == 1
    reg = regs[0]
    assert reg['event'] == EVENT_NAME
    assert reg['status'] == "applied"
    assert reg['accept'] is False
    assert reg['checkin'] is False
    assert reg['rsvp'] is False
    # The submission date the admin console reads as "date applied".
    assert reg['apply_at'] is not None


def test_apply_requires_confirmed_email(client, test_db, test_mail):
    with test_mail.record_messages():
        assert client.post("/api/accounts/create", json=create_json).status_code == 200
    token = login_token(client, login_json)

    res = client.post('/api/registrations/apply', json=ESSAYS,
                      headers=bearer(token))
    assert res.status_code == 403

    user = test_db.users.find_one({'username': "a@test.com"})
    assert user['registrations'] == []


def test_apply_twice_conflicts_and_sends_one_email(client, test_db, test_mail):
    token = confirmed_token(client, test_mail)

    with test_mail.record_messages() as outbox:
        assert client.post('/api/registrations/apply', json=ESSAYS,
                           headers=bearer(token)).status_code == 200

        res = client.post('/api/registrations/apply',
                          json={"essay_project": "second thoughts",
                                "essay_team": "second thoughts"},
                          headers=bearer(token))
        assert res.status_code == 409
        assert len(outbox) == 1

    user = test_db.users.find_one({'username': "a@test.com"})
    # The second attempt must not overwrite the submitted answers either.
    assert user['profile']['essay_project'] == ESSAYS['essay_project']
    assert len(user['registrations']) == 1


def test_apply_rejects_blank_or_oversized_answers(client, test_db, test_mail):
    token = confirmed_token(client, test_mail)

    for key in ("essay_project", "essay_team"):
        missing = dict(ESSAYS)
        del missing[key]
        assert client.post('/api/registrations/apply', json=missing,
                           headers=bearer(token)).status_code == 400

        blank = dict(ESSAYS, **{key: "   "})
        assert client.post('/api/registrations/apply', json=blank,
                           headers=bearer(token)).status_code == 400

        long = dict(ESSAYS, **{key: "word " * 301})
        assert client.post('/api/registrations/apply', json=long,
                           headers=bearer(token)).status_code == 400

    user = test_db.users.find_one({'username': "a@test.com"})
    assert user['registrations'] == []


def test_apply_requires_login(client, test_db):
    assert client.post('/api/registrations/apply', json=ESSAYS).status_code == 401


def test_apply_survives_a_dead_mail_server(client, test_db, test_mail):
    """SMTP is the flakiest dependency here (Gmail caps us ~500 sends/day).

    A failed confirmation email must not 500 the request: the submission is
    already durable, and a 500 would tell the user it failed and then hand
    them a 409 on every retry.
    """
    from unittest import mock

    token = confirmed_token(client, test_mail)

    with mock.patch('registrations.send_apply_confirm',
                    side_effect=Exception("smtp down")):
        res = client.post('/api/registrations/apply', json=ESSAYS,
                          headers=bearer(token))

    assert res.status_code == 200
    assert res.json['email_sent'] is False

    user = test_db.users.find_one({'username': "a@test.com"})
    assert len(user['registrations']) == 1
    assert user['profile']['essay_project'] == ESSAYS['essay_project']


def test_draft_saves_only_the_essays(client, test_db, test_mail):
    token = confirmed_token(client, test_mail)
    before = test_db.users.find_one({'username': "a@test.com"})['profile']

    res = client.post('/api/registrations/apply/draft',
                      json={"essay_project": "Half an answer."},
                      headers=bearer(token))
    assert res.status_code == 200

    after = test_db.users.find_one({'username': "a@test.com"})['profile']
    assert after['essay_project'] == "Half an answer."
    # Every other field is byte-identical: a draft save touches nothing else.
    assert {k: v for k, v in after.items() if k != 'essay_project'} == \
           {k: v for k, v in before.items() if k != 'essay_project'}


def test_draft_works_for_legacy_profile_shapes(client, test_db, test_mail):
    """Pre-2026 profiles lack dietary_restrictions/tshirt_size.

    /accounts/profile/update rejects those documents outright, so the apply
    page must not depend on it to save a draft.
    """
    token = confirmed_token(client, test_mail)
    test_db.users.update_one(
        {'username': "a@test.com"},
        {'$unset': {'profile.dietary_restrictions': '', 'profile.tshirt_size': ''}})

    res = client.post('/api/registrations/apply/draft',
                      json={"essay_project": "Returning user's draft."},
                      headers=bearer(token))
    assert res.status_code == 200
    assert test_db.users.find_one(
        {'username': "a@test.com"})['profile']['essay_project'] == "Returning user's draft."


def test_draft_is_refused_after_submitting(client, test_db, test_mail):
    token = confirmed_token(client, test_mail)
    assert client.post('/api/registrations/apply', json=ESSAYS,
                       headers=bearer(token)).status_code == 200

    res = client.post('/api/registrations/apply/draft',
                      json={"essay_project": "sneaking an edit in"},
                      headers=bearer(token))
    assert res.status_code == 409

    stored = test_db.users.find_one({'username': "a@test.com"})['profile']
    assert stored['essay_project'] == ESSAYS['essay_project']


def test_draft_enforces_the_word_limit(client, test_db, test_mail):
    token = confirmed_token(client, test_mail)
    res = client.post('/api/registrations/apply/draft',
                      json={"essay_project": "word " * 301},
                      headers=bearer(token))
    assert res.status_code == 400


def test_apply_handles_legacy_registration_shapes(client, test_db, test_mail):
    """Accounts persist across years and older docs are not uniform.

    A returning user (old-event registration only), a doc with no
    `registrations` key, and the events.py `event_name` shape must all still
    be able to submit exactly once.
    """
    for mutation in (
        {'$set': {'registrations': [{'event': 'Fall 2025', 'status': 'checked_in'}]}},
        {'$unset': {'registrations': ''}},
        {'$set': {'registrations': [{'event_name': 'Fall 2026', 'status': 'applied'}]}},
    ):
        test_db.users.delete_many({})
        token = confirmed_token(client, test_mail)
        test_db.users.update_one({'username': "a@test.com"}, mutation)

        assert client.post('/api/registrations/apply', json=ESSAYS,
                           headers=bearer(token)).status_code == 200
        # ...and exactly once.
        assert client.post('/api/registrations/apply', json=ESSAYS,
                           headers=bearer(token)).status_code == 409

        regs = test_db.users.find_one({'username': "a@test.com"})['registrations']
        assert len([r for r in regs if r.get('event') == 'Fall 2026']) == 1
