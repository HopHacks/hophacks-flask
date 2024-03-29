import pytest
import sys
import json

# import modules from app
sys.path.append('../src')
from app import create_app
from db import db
from mail import mail

@pytest.fixture
def client():
    app = create_app('test.json')
    app.config['TESTING'] = True

    db.users.delete_many({}) # clear database
    
    with app.test_client() as client:
        yield client

    db.mongo_client.close()

@pytest.fixture
def test_mail():
    yield mail

@pytest.fixture
def test_db():
    yield db
