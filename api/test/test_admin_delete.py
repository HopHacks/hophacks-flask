import sys
sys.path.append('../src')

from utils import create_json, login_json
from flow import register_confirmed, admin_token, bearer


def test_delete_user(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    admin = admin_token(client, test_db)

    res = client.delete('/api/admin/users', json={'username': 'A@TEST.com'},
                        headers=bearer(admin))
    assert res.status_code == 200
    assert test_db.users.find_one({'username': 'a@test.com'}) is None


def test_delete_unknown_email_404(client, test_db, test_mail):
    admin = admin_token(client, test_db)
    res = client.delete('/api/admin/users', json={'username': 'ghost@test.com'},
                        headers=bearer(admin))
    assert res.status_code == 404


def test_delete_refuses_admin_target(client, test_db, test_mail):
    admin = admin_token(client, test_db)
    res = client.delete('/api/admin/users', json={'username': 'admin'},
                        headers=bearer(admin))
    assert res.status_code == 400
    assert test_db.users.find_one({'username': 'admin'}) is not None


def test_delete_requires_admin(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    res = client.post('/api/auth/login', json=login_json)
    token = res.json['access_token']
    res = client.delete('/api/admin/users', json={'username': 'a@test.com'},
                        headers=bearer(token))
    assert res.status_code == 401
    assert test_db.users.find_one({'username': 'a@test.com'}) is not None
