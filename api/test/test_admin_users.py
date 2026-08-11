import sys
sys.path.append('../src')

from config.event import EVENT_NAME
from utils import create_json, create_json2
from flow import register_confirmed, register_applied, admin_token, bearer


def test_users_no_query_ok(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    # No ?query= must not 500 (regression: None string concatenation in regex)
    res = client.get('/api/admin/users', headers=bearer(admin))
    assert res.status_code == 200
    assert 'a@test.com' in [u['username'] for u in res.json['users']]


def test_users_returns_current_event_registrants(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    res = client.get('/api/admin/users?query=Andrew', headers=bearer(admin))
    assert res.status_code == 200
    assert len(res.json['users']) == 1
    assert res.json['users'][0]['submitted'] is True
    assert res.json['users'][0]['apply_at'] is not None


def test_users_includes_profile_only_accounts(client, test_db, test_mail):
    # Confirmed but never submitted: the console has to show these, flagged,
    # so a profile is never mistaken for an application.
    register_confirmed(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    res = client.get('/api/admin/users?query=Andrew', headers=bearer(admin))
    assert res.status_code == 200
    assert len(res.json['users']) == 1
    user = res.json['users'][0]
    assert user['submitted'] is False
    assert user['apply_at'] is None
    assert user['registrations'] == []


def test_users_sorts_submitted_before_profile_only(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)    # a - profile only
    register_applied(client, test_mail, create_json2)     # b - submitted
    admin = admin_token(client, test_db)
    res = client.get('/api/admin/users', headers=bearer(admin))
    assert res.status_code == 200
    # The list is the review queue: applications first, oldest first.
    assert [u['username'] for u in res.json['users']] == ['b@test.com', 'a@test.com']


def test_users_tolerates_missing_is_admin(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    # Regression: legacy docs without is_admin used to KeyError into a 500
    test_db.users.update_one({'username': 'a@test.com'}, {'$unset': {'is_admin': ''}})
    res = client.get('/api/admin/users', headers=bearer(admin))
    assert res.status_code == 200
    assert 'a@test.com' in [u['username'] for u in res.json['users']]


def test_users_excludes_dormant_accounts_from_past_years(client, test_db, test_mail):
    """db.users spans every year since 2021.

    Without scoping, dropping the registration filter would surface every
    dormant old account as an unfinished 2026 application. Old accounts appear
    only if they actually applied this cycle.
    """
    import datetime
    from bson import ObjectId

    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)

    # A 2023 account that never came back: an ObjectId minted in 2023.
    test_db.users.insert_one({
        '_id': ObjectId.from_datetime(datetime.datetime(2023, 3, 1)),
        'username': 'dormant@test.com',
        'profile': {'first_name': 'Dormant', 'last_name': 'Ghost'},
        'email_confirmed': True, 'registrations': [], 'is_admin': False,
    })
    # A 2023 account that DID apply this cycle must still be listed.
    test_db.users.insert_one({
        '_id': ObjectId.from_datetime(datetime.datetime(2023, 3, 2)),
        'username': 'returning@test.com',
        'profile': {'first_name': 'Returning', 'last_name': 'Alum'},
        'email_confirmed': True, 'is_admin': False,
        'registrations': [{'event': EVENT_NAME, 'status': 'applied',
                           'apply_at': datetime.datetime(2026, 8, 1)}],
    })

    res = client.get('/api/admin/users', headers=bearer(admin))
    assert res.status_code == 200
    names = [u['username'] for u in res.json['users']]

    assert 'dormant@test.com' not in names
    assert 'returning@test.com' in names
    assert 'a@test.com' in names


def test_users_tolerates_legacy_document_shapes(client, test_db, test_mail):
    """Missing/None `registrations`, no profile, no email_confirmed.

    These used to be filtered out by the registration match; now that
    profile-only accounts are included, the aggregation has to survive them.
    """
    import datetime
    from bson import ObjectId

    admin = admin_token(client, test_db)
    recent = ObjectId.from_datetime(datetime.datetime(2026, 7, 15))
    test_db.users.insert_one({
        '_id': recent, 'username': 'ragged@test.com', 'is_admin': False,
    })
    test_db.users.insert_one({
        '_id': ObjectId.from_datetime(datetime.datetime(2026, 7, 16)),
        'username': 'nullregs@test.com', 'registrations': None,
        'profile': {'first_name': 'Null'}, 'is_admin': False,
    })

    res = client.get('/api/admin/users', headers=bearer(admin))
    assert res.status_code == 200
    rows = {u['username']: u for u in res.json['users']}
    assert rows['ragged@test.com']['submitted'] is False
    assert rows['ragged@test.com']['email_confirmed'] is False
    assert rows['ragged@test.com']['profile'] == {}
    assert rows['nullregs@test.com']['registrations'] == []
