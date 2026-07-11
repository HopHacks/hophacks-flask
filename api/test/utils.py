import bcrypt


def add_admin_account(client, db):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw("admin".encode(), salt)

    db.users.insert_one({
        'username': "admin",
        'hashed': hashed,
        'refresh_tokens': [],
        'profile': {},
        'is_admin': True
    })


admin_login_json = {
    "username": "admin",
    "password": "admin"
}


def _profile(first_name, last_name, school, **overrides):
    """Build an MLH-compliant registration profile with sensible defaults."""
    profile = {
        "first_name": first_name,
        "last_name": last_name,
        "age": "20",
        "phone_number": "8888888888",
        "school": school,
        "level_of_study": "Undergraduate University (3+ year)",
        "country": "United States of America",
        # optional demographic fields
        "gender": "Prefer not to answer",
        "major": "Computer science, computer engineering, or software engineering",
        "race_ethnicity": "Asian / Pacific Islander",
        # MLH consent checkboxes
        "mlh_code_of_conduct": True,
        "mlh_data_sharing": True,
        "mlh_marketing_emails": False,
    }
    profile.update(overrides)
    return profile


create_json = {
    "username": "a",
    "password": "a",
    "confirm_url": "test.com/confirm",
    "profile": _profile("Andrew", "Wong", "Cornell University"),
}

login_json = {
    "username": "a",
    "password": "a"
}

create_json2 = {
    "username": "b",
    "password": "b",
    "confirm_url": "test.com/confirm",
    "profile": _profile("Elaine", "Wong", "Johns Hopkins University"),
}

login_json2 = {
    "username": "b",
    "password": "b"
}

create_json3 = {
    "username": "c",
    "password": "c",
    "confirm_url": "test.com/confirm",
    "profile": _profile("Jason", "Zhang", "Johns Hopkins University"),
}

login_json3 = {
    "username": "c",
    "password": "c"
}

# Negative variants: required MLH consents not accepted.
create_json_no_coc = {
    "username": "d",
    "password": "d",
    "confirm_url": "test.com/confirm",
    "profile": _profile("Dana", "Cho", "Cornell University", mlh_code_of_conduct=False),
}

create_json_no_data = {
    "username": "e",
    "password": "e",
    "confirm_url": "test.com/confirm",
    "profile": _profile("Evan", "Diaz", "Cornell University", mlh_data_sharing=False),
}
