import sys
sys.path.append('../src')

from utils import create_json, login_json
from flow import register_confirmed, admin_token, bearer


def test_promote_and_list_admins(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    admin = admin_token(client, test_db)

    res = client.post('/api/admin/admins', json={'username': 'A@TEST.com'},
                      headers=bearer(admin))
    assert res.status_code == 200
    assert 'a@test.com' in res.json['msg']

    res = client.get('/api/admin/admins', headers=bearer(admin))
    assert res.status_code == 200
    assert 'a@test.com' in res.json['admins']

    # Idempotent: promoting an existing admin succeeds without change.
    res = client.post('/api/admin/admins', json={'username': 'a@test.com'},
                      headers=bearer(admin))
    assert res.status_code == 200
    assert 'already' in res.json['msg']


def test_promote_unknown_email_404(client, test_db, test_mail):
    admin = admin_token(client, test_db)
    res = client.post('/api/admin/admins', json={'username': 'ghost@test.com'},
                      headers=bearer(admin))
    assert res.status_code == 404


def test_promote_requires_admin(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    res = client.post('/api/auth/login', json=login_json)
    token = res.json['access_token']
    res = client.post('/api/admin/admins', json={'username': 'a@test.com'},
                      headers=bearer(token))
    assert res.status_code == 401


def test_admin_emails_config_promotes_on_login(client, test_db, test_mail, app):
    register_confirmed(client, test_mail, create_json)
    assert not test_db.users.find_one({'username': 'a@test.com'}).get('is_admin')

    app.config['ADMIN_EMAILS'] = 'somebody@else.com, A@test.COM'
    res = client.post('/api/auth/login', json=login_json)
    assert res.status_code == 200
    assert test_db.users.find_one({'username': 'a@test.com'})['is_admin'] is True
