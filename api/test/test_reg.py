from utils import *

event='Spring_1970'
event2='Fall_1923'

apply_json = {
    'event': event,
    'details': {
        'pizza_preference': 'pineapple'
    }
}

apply_json2 = {
    'event': event2,
    'details': {
        'pizza_preference': 'pineapple'
    }
}

# Test apply process
def test_apply(client, test_db, test_mail):
    # test that successful registration gives good response
    response = client.post('/api/accounts/create', json=create_json)
    assert response.status_code == 200

    response = client.post('/api/auth/login', json=login_json)
    assert response.status_code == 200
    token = response.json['access_token']

    with test_mail.record_messages() as outbox:

        response = client.post('/api/registrations/apply', json=apply_json, headers={'Authorization': 'Bearer ' + token})
        assert response.status_code == 200
        assert len(outbox) == 1

        user = test_db.users.find_one({'username': login_json['username']})
        assert user['registrations'][0]['event'] == event
        assert user['registrations'][0]['details'] == apply_json['details']
        assert user['registrations'][0]['accept'] == False
        assert user['registrations'][0]['checkin'] == False

    # test that you can't apply again to the same event
    response = client.post('/api/registrations/apply', json=apply_json, headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 400

    # test that you can do a different one
    response = client.post('/api/registrations/apply', json=apply_json2, headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 200

def test_accept(client, test_db, test_mail):
    # Register three accounts but apply two accounts
    response = client.post('/api/accounts/create', json=create_json)
    response = client.post('/api/accounts/create', json=create_json2)
    response = client.post('/api/accounts/create', json=create_json3)

    response = client.post('/api/auth/login', json=login_json)
    token = response.json['access_token']
    response = client.post('/api/registrations/apply', json=apply_json, headers={'Authorization': 'Bearer ' + token})

    response = client.post('/api/auth/login', json=login_json2)
    token = response.json['access_token']
    response = client.post('/api/registrations/apply', json=apply_json, headers={'Authorization': 'Bearer ' + token})

    # Login as admin
    add_admin_account(client, test_db)
    response = client.post('/api/auth/login', json=admin_login_json)
    token = response.json['access_token']

    users = test_db.users.find({})
    ids = [str(user['_id']) for user in users]

    accept_json = {
        'event': event,
        'users': ids
    }

    # Accept both accounts
    with test_mail.record_messages() as outbox:
        response = client.post('/api/registrations/accept', json=accept_json, headers={'Authorization': 'Bearer ' + token})
        assert len(outbox) == 2

    # check applied accounts are marked
    users = test_db.users.find({})
    for user in users:
        if (user['username'] != login_json3['username'] and user['username'] != 'admin'):
            assert user['registrations'][0]['accept']

def test_checkin(client, test_db):
    response = client.post('/api/accounts/create', json=create_json)
    response = client.post('/api/auth/login', json=login_json)
    token = response.json['access_token']
    response = client.post('/api/registrations/apply', json=apply_json, headers={'Authorization': 'Bearer ' + token})

    user = test_db.users.find_one({})
    user_id = str(user['_id'])

    add_admin_account(client, test_db)
    response = client.post('/api/auth/login', json=admin_login_json)
    token = response.json['access_token']

    checkin_json = {
        'event': event,
        'user': user_id
    }

    response = client.post('/api/registrations/check_in', json=checkin_json, headers={'Authorization': 'Bearer ' + token})
    assert response.status_code == 200

    user = test_db.users.find_one({})
    assert user['registrations'][0]['checkin']
