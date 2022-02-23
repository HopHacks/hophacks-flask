from db import db
from mail import mail
from util.reset_tokens import *
from util.decorators import check_admin
from flask import Blueprint, request, Response, current_app, render_template, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from registrations import send_apply_confirm
import bcrypt
import jwt
import json
import datetime
from bson import ObjectId
import pytz

from pymongo import MongoClient
import argparse

@announcements_api.route('/create', methods = ['POST'])
def create():
    if (request.json is None):
        return Response('Data not in json format', status=400)
    if not (all(field in request.json for field in ['title', 'body',])
            and validate_profile(request)):
        return Response('Invalid request', status=400)
    title = request.json['title']
    body = request.json['body']
   # confirm_url = request.json['confirm_url']
   # profile = request.json['profile']
   with MongoClient("mongodb://localhost:27017") as client:
        db = client['hophacks']
        coll = db['announcements']
        # db.announcements.insert_one({
        coll.insert_one({
            'title': title,
            'body': body
        })
    # return jsonify({"msg": "user added"}), 200