import sys
sys.path.append('../src')

import csv
import io

from utils import create_json, create_json2, create_json3, login_json
from flow import register_confirmed, register_applied, login_token, admin_token, bearer


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


def test_export_includes_gender(client, test_db, test_mail):
    """Sponsor decks report gender alongside the other demographics, and
    the stats endpoint already counts it; the export has to carry it too.
    Optional at signup, so a legacy row without it is blank, not broken."""
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)

    res = client.get('/api/admin/export', headers=bearer(admin))
    rows = list(csv.DictReader(io.StringIO(res.data.decode())))
    assert rows[0]['gender'] == create_json['profile']['gender']

    test_db.users.update_one({'username': 'a@test.com'},
                             {'$unset': {'profile.gender': ''}})
    res = client.get('/api/admin/export', headers=bearer(admin))
    rows = list(csv.DictReader(io.StringIO(res.data.decode())))
    assert rows[0]['gender'] == ''


def test_export_header_and_row_widths_match(client, test_db, test_mail):
    """A column added to one list and not the other silently shifts every
    field after it, which is worse than a missing column."""
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)

    res = client.get('/api/admin/export', headers=bearer(admin))
    rows = list(csv.reader(io.StringIO(res.data.decode())))
    header, first = rows[0], rows[1]
    assert len(header) == len(first), (len(header), len(first))


def test_export_unsubmitted_lists_profile_only_accounts(client, test_db, test_mail):
    """The nudge list: this cycle's accounts that never submitted."""
    register_confirmed(client, test_mail, create_json)   # profile only
    register_applied(client, test_mail, create_json2)    # submitted
    admin = admin_token(client, test_db)

    res = client.get('/api/admin/export_unsubmitted', headers=bearer(admin))
    assert res.status_code == 200
    assert 'hophacks_not_submitted.csv' in res.headers['Content-Disposition']

    rows = list(csv.DictReader(io.StringIO(res.data.decode())))
    emails = [r['email'] for r in rows]
    assert 'a@test.com' in emails
    # Submitted applicants belong to the other export, not this one.
    assert 'b@test.com' not in emails

    row = next(r for r in rows if r['email'] == 'a@test.com')
    assert row['first_name'] == 'Andrew'
    assert row['phone_number'] == '8888888888'
    assert row['email_confirmed'] == 'True'


def test_export_unsubmitted_excludes_dormant_old_accounts(client, test_db, test_mail):
    """db.users spans every year since 2021; a 2023 account that never came
    back is not one of this cycle's dropouts."""
    import datetime
    from bson import ObjectId

    admin = admin_token(client, test_db)
    test_db.users.insert_one({
        '_id': ObjectId.from_datetime(datetime.datetime(2023, 3, 1)),
        'username': 'dormant@test.com',
        'profile': {'first_name': 'Dormant'},
        'email_confirmed': True, 'registrations': [], 'is_admin': False,
    })

    res = client.get('/api/admin/export_unsubmitted', headers=bearer(admin))
    rows = list(csv.DictReader(io.StringIO(res.data.decode())))
    assert 'dormant@test.com' not in [r['email'] for r in rows]


def test_export_unsubmitted_survives_ragged_docs(client, test_db, test_mail):
    """Unconfirmed signups and legacy-shaped docs must not 500 the export."""
    import datetime
    from bson import ObjectId

    admin = admin_token(client, test_db)
    # Signed up, never confirmed, never submitted: the most common dropout.
    assert client.post('/api/accounts/create', json=create_json).status_code == 200
    # A ragged doc with no profile at all.
    test_db.users.insert_one({
        '_id': ObjectId.from_datetime(datetime.datetime(2026, 8, 1)),
        'username': 'ragged@test.com', 'is_admin': False,
    })

    res = client.get('/api/admin/export_unsubmitted', headers=bearer(admin))
    assert res.status_code == 200
    rows = {r['email']: r for r in csv.DictReader(io.StringIO(res.data.decode()))}
    assert rows['a@test.com']['email_confirmed'] == 'False'
    assert rows['ragged@test.com']['first_name'] == ''


def test_export_unsubmitted_requires_admin(client, test_db, test_mail):
    register_confirmed(client, test_mail, create_json)
    token = login_token(client, login_json)
    assert client.get('/api/admin/export_unsubmitted',
                      headers=bearer(token)).status_code == 401


DEFAULT_SPONSOR_FIELDS = [
    'name', 'email', 'phone', 'grad_year', 'linkedin_url', 'github_url',
]


def test_export_sponsor_info_requires_admin(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    token = login_token(client, login_json)
    assert client.post(
        '/api/admin/export_sponsor_info',
        json={'fields': DEFAULT_SPONSOR_FIELDS},
        headers=bearer(token),
    ).status_code == 401


def test_export_sponsor_info_from_profile(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    test_db.users.update_one({'username': 'a@test.com'}, {'$set': {
        'profile.grad_year': '2027',
        'profile.linkedin_url': 'https://linkedin.com/in/andrew',
        'profile.github_url': 'https://github.com/andrew',
        'profile.phone_number': '8888888888',
    }})
    admin = admin_token(client, test_db)

    res = client.post(
        '/api/admin/export_sponsor_info',
        json={'fields': DEFAULT_SPONSOR_FIELDS},
        headers=bearer(admin),
    )
    assert res.status_code == 200
    assert res.mimetype == 'text/csv'
    assert 'hophacks_sponsor_info.csv' in res.headers.get('Content-Disposition', '')

    rows = list(csv.DictReader(io.StringIO(res.get_data(as_text=True))))
    assert len(rows) == 1
    row = rows[0]
    assert row['name'] == 'Andrew Wong'
    assert row['email'] == 'a@test.com'
    assert row['phone number'] == '8888888888'
    assert row['graduation year'] == '2027'
    assert row['LinkedIn profile URL'] == 'https://linkedin.com/in/andrew'
    assert row['GitHub profile URL'] == 'https://github.com/andrew'


def test_export_sponsor_info_github_na_without_resume(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    res = client.post(
        '/api/admin/export_sponsor_info',
        json={'fields': DEFAULT_SPONSOR_FIELDS},
        headers=bearer(admin),
    )
    rows = list(csv.DictReader(io.StringIO(res.get_data(as_text=True))))
    assert rows[0]['GitHub profile URL'] == 'N/A'
    assert rows[0]['graduation year'] == 'N/A'
    assert rows[0]['LinkedIn profile URL'] == 'N/A'


def test_export_sponsor_info_github_from_resume(client, test_db, test_mail, monkeypatch):
    register_applied(client, test_mail, create_json)
    test_db.users.update_one(
        {'username': 'a@test.com'}, {'$set': {'resume': 'Andrew.pdf'}})

    class FakeBody:
        def read(self):
            return b"%PDF-1.4 /URI (https://github.com/resume-user) %%EOF"

    class FakeS3:
        def get_object(self, Bucket, Key):
            assert 'Andrew.pdf' in Key
            return {'Body': FakeBody()}

    monkeypatch.setattr('admin.boto3.client', lambda *a, **k: FakeS3())
    admin = admin_token(client, test_db)
    res = client.post(
        '/api/admin/export_sponsor_info',
        json={'fields': DEFAULT_SPONSOR_FIELDS},
        headers=bearer(admin),
    )
    rows = list(csv.DictReader(io.StringIO(res.get_data(as_text=True))))
    assert rows[0]['GitHub profile URL'] == 'https://github.com/resume-user'


def test_export_sponsor_info_subset_skips_resume(client, test_db, test_mail, monkeypatch):
    register_applied(client, test_mail, create_json)
    test_db.users.update_one(
        {'username': 'a@test.com'}, {'$set': {'resume': 'Andrew.pdf'}})

    def fail_s3(*a, **k):
        raise AssertionError('should not fetch resumes unless GitHub is requested')

    monkeypatch.setattr('admin.boto3.client', fail_s3)
    admin = admin_token(client, test_db)
    res = client.post(
        '/api/admin/export_sponsor_info',
        json={'fields': ['name', 'email']},
        headers=bearer(admin),
    )
    assert res.status_code == 200
    rows = list(csv.DictReader(io.StringIO(res.get_data(as_text=True))))
    assert list(rows[0].keys()) == ['name', 'email']
    assert 'GitHub profile URL' not in rows[0]


def test_export_sponsor_info_rejects_unknown_field(client, test_db, test_mail):
    register_applied(client, test_mail, create_json)
    admin = admin_token(client, test_db)
    res = client.post(
        '/api/admin/export_sponsor_info',
        json={'fields': ['name', 'ssn']},
        headers=bearer(admin),
    )
    assert res.status_code == 400
