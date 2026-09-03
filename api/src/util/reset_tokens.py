import jwt
import time

def create_reset_token(id, secret):
    return create_token(id, secret, 'reset')

def create_confirm_token(id, secret):
    # Registrants often open confirmation emails days later; the link is
    # single-use via confirm_secret regardless, so give it a week.
    return create_token(id, secret, 'confirm', 604800)

def read_reset_token(token, secret):
    return read_token(token, secret, 'reset')

def read_confim_token(token, secret):
    return read_token(token, secret, 'confirm')


def create_token(id, secret, token_type, expire_seconds=3600):
    payload = {
        'id' : id,
        'type' : token_type,
        'iat' : int(time.time()),
        'nbf' : int(time.time()),
        'exp': int(time.time() + expire_seconds)
    }

    return jwt.encode(payload, secret, algorithm='HS256')

def read_token(token, secret, token_type):
    # An empty secret means no token is outstanding for this user (never
    # issued, or already consumed). PyJWT will happily verify HS256 against
    # the empty string, which would let anyone forge tokens, so fail closed.
    if (not secret):
        return None
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
    except jwt.PyJWTError:
        return None
    if (payload.get('type') != token_type):
        return None
    return payload['id']
