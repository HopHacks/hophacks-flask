import sys
sys.path.append('../src')

from utils import create_json, create_json2, create_json3, login_json
from flow import register_confirmed, login_token, admin_token, bearer


def test_stats_requires_admin(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    token = login_token(client, login_json)
    assert client.get('/api/admin/stats', headers=bearer(token)).status_code == 401


def test_stats_aggregation(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)   # a - Cornell
    register_confirmed(client, test_mail, create_json2)  # b - Johns Hopkins
    register_confirmed(client, test_mail, create_json3)  # c - Johns Hopkins
    admin = admin_token(client, test_db)

    a_id = str(test_db.users.find_one({'username': 'a@test.com'})['_id'])
    b_id = str(test_db.users.find_one({'username': 'b@test.com'})['_id'])
    client.post('/api/registrations/accept', json={'users': [a_id, b_id]}, headers=bearer(admin))

    res = client.get('/api/admin/stats', headers=bearer(admin))
    assert res.status_code == 200
    data = res.json
    assert data['total'] == 3
    assert data['by_status'].get('accepted') == 2
    assert data['by_status'].get('applied') == 1
    assert data['by_school'].get('Johns Hopkins University') == 2
    assert data['by_school'].get('Cornell University') == 1


def test_stats_excludes_admin(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    res = client.get('/api/admin/stats', headers=bearer(admin))
    assert res.json['total'] == 1


def test_export_requires_admin(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    token = login_token(client, login_json)
    assert client.get('/api/admin/export', headers=bearer(token)).status_code == 401


def test_export_csv_content(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    res = client.get('/api/admin/export', headers=bearer(admin))
    assert res.status_code == 200
    assert res.mimetype == 'text/csv'
    lines = [l for l in res.get_data(as_text=True).splitlines() if l.strip()]
    assert lines[0].startswith('email,first_name,last_name')
    assert any(line.startswith('a@test.com,') for line in lines[1:])
    assert len(lines) == 2  # header + one registrant
