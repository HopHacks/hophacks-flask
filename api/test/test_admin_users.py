import sys
sys.path.append('../src')

from utils import create_json
from flow import register_confirmed, admin_token, bearer


def test_users_no_query_ok(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    # No ?query= must not 500 (regression: None string concatenation in regex)
    res = client.get('/api/admin/users', headers=bearer(admin))
    assert res.status_code == 200
    assert 'a@test.com' in [u['username'] for u in res.json['users']]


def test_users_returns_current_event_registrants(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    res = client.get('/api/admin/users?query=Andrew', headers=bearer(admin))
    assert res.status_code == 200
    assert len(res.json['users']) == 1
    assert res.json['users'][0]['apply_at'] is not None
