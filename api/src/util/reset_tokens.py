import jwt
import datetime

def create_reset_token(id, secret):
    return create_token(id, secret, 'reset')

def create_confirm_token(id, secret):
    return create_token(id, secret, 'confirm')

def read_reset_token(token, secret):
    return read_token(token, secret, 'reset')

def read_confim_token(token, secret):
    return read_token(token, secret, 'confirm')


def create_token(id, secret, token_type):
    payload = {
        'id' : id,
        'type' : token_type,
        'iat' : int(datetime.datetime.utcnow().timestamp()),
        'nbf' : int(datetime.datetime.utcnow().timestamp()),
        'exp ': int((datetime.datetime.utcnow() + datetime.timedelta(seconds=300)).timestamp())
    }

    return jwt.encode(payload, secret, algorithm='HS256')

def read_token(token, secret, token_type):
    payload = jwt.decode(token, secret, algorithms=['HS256'])
    if (payload['type'] != token_type):
        return None
    return payload['id']
