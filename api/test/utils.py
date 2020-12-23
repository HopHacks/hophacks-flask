import bcrypt


def add_admin_account(client, db):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw("admin".encode(), salt)

    db.users.insert_one({
        'username': "admin",
        'hashed': hashed,
        'refresh_tokens': [],
        'profile': {},
        'is_admin' : True
    })

admin_login_json = {
    "username": "admin",
    "password": "admin"
}

create_json = {
    "username": "a",
    "password": "a",
    "confirm_url": "test.com/confirm",
    "profile": {
        "first_name": "Andrew",
        "last_name": "Wong",
        "gender": "male",
        "major": "Computer Science",
        "phone_number": "8888888888",
        "school": "Cornell University",
        "ethnicity": "Asian/Pacific Islander",
        "grad": "ugrad",
        "is_jhu": False,
        "grad_month": "05",
        "grad_year": "2022"
    }
}

login_json = {
    "username": "a",
    "password": "a"
}

create_json2 = {
    "username": "b",
    "password": "b",
    "confirm_url": "test.com/confirm",
    "profile": {
        "first_name": "Elaine",
        "last_name": "Wong",
        "gender": "female",
        "major": "Computer Science",
        "phone_number": "8888888888",
        "school": "Jooby Hooby University",
        "ethnicity": "Asian/Pacific Islander",
        "grad": "ugrad",
        "is_jhu": True,
        "grad_month": "05",
        "grad_year": "2022"
    }
}

login_json2 = {
    "username": "b",
    "password": "b"
}

create_json3 = {
    "username": "c",
    "password": "c",
    "confirm_url": "test.com/confirm",
    "profile": {
        "first_name": "Jason",
        "last_name": "Zhang",
        "gender": "female",
        "major": "Computer Science",
        "phone_number": "8888888888",
        "school": "Jooby Hooby University",
        "ethnicity": "Asian/Pacific Islander",
        "grad": "ugrad",
        "is_jhu": True,
        "grad_month": "05",
        "grad_year": "2022"
    }
}

login_json3 = {
    "username": "c",
    "password": "c"
}
