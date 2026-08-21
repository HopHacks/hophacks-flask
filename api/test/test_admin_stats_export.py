import sys
sys.path.append('../src')

import csv
import io

from utils import create_json, create_json2, create_json3, login_json
from flow import register_applied, login_token, admin_token, bearer


def test_stats_requires_admin(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    token = login_token(client, login_json)
    assert client.get('/api/admin/stats', headers=bearer(token)).status_code == 401


def test_stats_aggregation(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)   # a - Cornell
    register_applied(client, test_mail, create_json2)  # b - Johns Hopkins
    register_applied(client, test_mail, create_json3)  # c - Johns Hopkins
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
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    res = client.get('/api/admin/stats', headers=bearer(admin))
    assert res.json['total'] == 1


def test_export_requires_admin(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    token = login_token(client, login_json)
    assert client.get('/api/admin/export', headers=bearer(token)).status_code == 401


def test_export_csv_content(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    res = client.get('/api/admin/export', headers=bearer(admin))
    assert res.status_code == 200
    assert res.mimetype == 'text/csv'
    lines = [l for l in res.get_data(as_text=True).splitlines() if l.strip()]
    assert lines[0].startswith('email,first_name,last_name')
    assert any(line.startswith('a@test.com,') for line in lines[1:])
    assert len(lines) == 2  # header + one registrant


def test_export_includes_essays(client, test_db, test_mail):
    """Admins read application responses out of the export, so they must ship."""
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    res = client.get('/api/admin/export', headers=bearer(admin))

    rows = list(csv.DictReader(io.StringIO(res.get_data(as_text=True))))
    assert len(rows) == 1
    profile = create_json['profile']
    assert rows[0]['essay_project'] == profile['essay_project']
    assert rows[0]['essay_team'] == profile['essay_team']


def test_export_handles_missing_essays(client, test_db, test_mail):
    """Legacy accounts predate the essay fields; the export must not break."""
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    test_db.users.update_one(
        {'username': 'a@test.com'},
        {'$unset': {'profile.essay_project': '', 'profile.essay_team': ''}})

    res = client.get('/api/admin/export', headers=bearer(admin))
    assert res.status_code == 200
    rows = list(csv.DictReader(io.StringIO(res.get_data(as_text=True))))
    assert rows[0]['essay_project'] == ''
    assert rows[0]['essay_team'] == ''


def test_export_includes_other_free_text(client, test_db, test_mail):
    """The "Other" options store the real answer in a companion field.

    Exporting the choice without its text loses the actual school name and
    the actual dietary restriction, which is what catering and swag need.
    """
    register_applied(client, test_mail, create_json)
    test_db.users.update_one({'username': 'a@test.com'}, {'$set': {
        'profile.school': 'Other (not listed)',
        'profile.otherSchool': 'Ada Lovelace Institute',
        'profile.dietary_restrictions': 'Other',
        'profile.dietary_restrictions_other': 'No shellfish, severe',
    }})
    admin = admin_token(client, test_db)

    res = client.get('/api/admin/export', headers=bearer(admin))
    assert res.status_code == 200

    rows = list(csv.DictReader(io.StringIO(res.data.decode())))
    assert rows[0]['other_school'] == 'Ada Lovelace Institute'
    assert rows[0]['dietary_restrictions_other'] == 'No shellfish, severe'
    # The choice itself is still exported alongside its text.
    assert rows[0]['school'] == 'Other (not listed)'
    assert rows[0]['dietary_restrictions'] == 'Other'


def test_export_other_columns_blank_when_unused(client, test_db, test_mail):
    """Most applicants pick a listed option; those cells are empty, not missing."""
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)

    res = client.get('/api/admin/export', headers=bearer(admin))
    rows = list(csv.DictReader(io.StringIO(res.data.decode())))
    assert rows[0]['other_school'] == ''
    assert rows[0]['dietary_restrictions_other'] == ''


def test_export_header_and_row_widths_match(client, test_db, test_mail):
    """A column added to one list and not the other silently shifts every
    field after it, which is worse than a missing column."""
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)

    res = client.get('/api/admin/export', headers=bearer(admin))
    rows = list(csv.reader(io.StringIO(res.data.decode())))
    header, first = rows[0], rows[1]
    assert len(header) == len(first), (len(header), len(first))
