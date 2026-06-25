from utils import add_admin_account, admin_login_json


def _clear(test_db):
    test_db.interest.delete_many({})


def test_create_records_signup(client, test_db):
    _clear(test_db)

    response = client.post('/api/interest/', json={
        'first_name': 'Ada',
        'last_name': 'Lovelace',
        'email': 'Ada@JHU.edu',
        'mlh_emails': True,
    })
    assert response.status_code == 200

    # email is normalized to lowercase before storage
    doc = test_db.interest.find_one({'email': 'ada@jhu.edu'})
    assert doc is not None
    assert doc['first_name'] == 'Ada'
    assert doc['last_name'] == 'Lovelace'
    assert doc['mlh_emails'] is True
    assert doc['source'] == 'website'
    assert 'created_at' in doc
    assert test_db.interest.count_documents({}) == 1


def test_duplicate_email_is_deduped(client, test_db):
    _clear(test_db)

    client.post('/api/interest/', json={'first_name': 'Ada', 'email': 'a@b.com'})
    client.post('/api/interest/', json={'first_name': 'Ada B', 'email': 'a@b.com'})

    assert test_db.interest.count_documents({}) == 1
    # latest submission wins
    assert test_db.interest.find_one({'email': 'a@b.com'})['first_name'] == 'Ada B'


def test_names_are_optional(client, test_db):
    _clear(test_db)

    response = client.post('/api/interest/', json={'email': 'email-only@x.com'})
    assert response.status_code == 200

    doc = test_db.interest.find_one({'email': 'email-only@x.com'})
    assert doc['first_name'] == ''
    assert doc['last_name'] == ''


def test_missing_email_rejected(client, test_db):
    _clear(test_db)

    response = client.post('/api/interest/', json={'first_name': 'No', 'last_name': 'Email'})
    assert response.status_code == 400
    assert test_db.interest.count_documents({}) == 0


def test_invalid_email_rejected(client, test_db):
    _clear(test_db)

    response = client.post('/api/interest/', json={'email': 'not-an-email'})
    assert response.status_code == 400
    assert test_db.interest.count_documents({}) == 0


def test_count_endpoint(client, test_db):
    _clear(test_db)

    client.post('/api/interest/', json={'email': 'one@x.com'})
    client.post('/api/interest/', json={'email': 'two@x.com'})

    response = client.get('/api/interest/count')
    assert response.status_code == 200
    assert response.json['count'] == 2


def test_all_requires_admin(client, test_db):
    _clear(test_db)
    client.post('/api/interest/', json={'email': 'one@x.com'})

    # no token -> rejected by jwt (missing Authorization header)
    assert client.get('/api/interest/all').status_code == 401

    add_admin_account(client, test_db)
    token = client.post('/api/auth/login', json=admin_login_json).json['access_token']

    response = client.get('/api/interest/all', headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 200
    assert len(response.json['interest']) == 1
    assert response.json['interest'][0]['email'] == 'one@x.com'
