import pytest
import sys
import json

# import modules from app
sys.path.append('../src')
from app import create_app
from db import get_db, get_mongo_client

@pytest.fixture
def client():
    app = create_app('test.json')

    db = get_db()
    mongo_client = get_mongo_client()

    db.users.delete_many({}) # clear database
    with app.test_client() as client:
        yield client

    mongo_client.close()


@pytest.fixture
def test_db():
    yield get_db()
