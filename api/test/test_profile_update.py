import sys
sys.path.append('../src')

import copy

from utils import create_json, login_json
from flow import register_confirmed, register_applied, login_token, bearer


def get_profile(client, token):
    res = client.get('/api/accounts/profile/get', headers=bearer(token))
    assert res.status_code == 200
    return res.json['profile']


def test_essays_are_editable_before_submitting(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    token = login_token(client, login_json)

    profile = get_profile(client, token)
    profile['essay_project'] = "A redrafted answer."

    res = client.post('/api/accounts/profile/update', json={'profile': profile},
                      headers=bearer(token))
    assert res.status_code == 200

    stored = test_db.users.find_one({'username': "a@test.com"})['profile']
    assert stored['essay_project'] == "A redrafted answer."


def test_blank_draft_is_allowed_before_submitting(client, test_db, test_mail):
    # The apply page saves drafts through this endpoint, so a half-finished
    # answer must not be rejected. /apply is what enforces completeness.
    register_confirmed(client, test_mail, create_json)
    token = login_token(client, login_json)

    profile = get_profile(client, token)
    profile['essay_team'] = ""

    assert client.post('/api/accounts/profile/update', json={'profile': profile},
                       headers=bearer(token)).status_code == 200


def test_draft_over_word_limit_400(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    token = login_token(client, login_json)

    profile = get_profile(client, token)
    profile['essay_project'] = "word " * 301

    assert client.post('/api/accounts/profile/update', json={'profile': profile},
                       headers=bearer(token)).status_code == 400


def test_essays_are_frozen_after_submitting(client, test_db, test_mail):
    token = register_applied(client, test_mail, create_json)

    profile = get_profile(client, token)
    original = profile['essay_project']
    profile['essay_project'] = "Rewriting my answer after the fact."

    res = client.post('/api/accounts/profile/update', json={'profile': profile},
                      headers=bearer(token))
    assert res.status_code == 409

    stored = test_db.users.find_one({'username': "a@test.com"})['profile']
    assert stored['essay_project'] == original


def test_blanking_an_essay_after_submitting_409(client, test_db, test_mail):
    token = register_applied(client, test_mail, create_json)

    profile = get_profile(client, token)
    profile['essay_team'] = ""

    assert client.post('/api/accounts/profile/update', json={'profile': profile},
                       headers=bearer(token)).status_code == 409


def test_other_profile_fields_stay_editable_after_submitting(client, test_db, test_mail):
    # The profile form re-sends the whole document, essays included, so an
    # unchanged essay must not block an ordinary edit.
    token = register_applied(client, test_mail, create_json)

    profile = get_profile(client, token)
    profile['tshirt_size'] = "L"

    res = client.post('/api/accounts/profile/update', json={'profile': profile},
                      headers=bearer(token))
    assert res.status_code == 200

    stored = test_db.users.find_one({'username': "a@test.com"})['profile']
    assert stored['tshirt_size'] == "L"


def test_oversized_profile_rejected(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    token = login_token(client, login_json)

    profile = copy.deepcopy(get_profile(client, token))
    profile['major'] = "x" * 50001

    assert client.post('/api/accounts/profile/update', json={'profile': profile},
                       headers=bearer(token)).status_code == 400
