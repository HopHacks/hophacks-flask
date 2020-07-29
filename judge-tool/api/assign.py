from . import algorithm
from flask import (
    Blueprint, request, jsonify, flash, redirect, render_template, url_for
)
import csv
import random
from . import db
import pymongo

bp = Blueprint('assign', __name__)

#col: judge assignments
#col2: sponsor prizes
#col3: table assignments

ALLOWED_EXTENSIONS = {"csv", "txt"}


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_assignments():
    result = db.db.col.find_one({}, {'_id': 0})
    return jsonify(result)


def get_sponsor_prizes():
    result = db.db.col2.find_one({}, {'_id': 0})
    return jsonify(result)


def assign_tables(submissions):
    tables = {}
    i = 1
    for x in submissions:
        tables[x] = i
        i += 1
    db.db.col3.replace_one({}, tables, upsert=True)


def time_constraints(assignments, submissions):
    for x in submissions:
        indices = {} #key = list, value = index
        for y in assignments:
            if x in assignments[y]:
                indices[y] = assignments[y].index(x)
        for z in indices:
            for i in indices:
                if z == i:
                    break
                if indices[z] == indices[i]:
                    if indices[i] < assignments[i].len():
                        assignments[i][indices[i]], assignments[i][indices[i] + 1] = \
                        assignments[i][indices[i] + 1], assignments[i][indices[i]]
                    else:
                        assignments[i][indices[i]], assignments[i][0] = assignments[i][0], assignments[i][indices[i]]


@bp.route('/assignments', methods=["GET", "POST"])
def assignments():
    if request.method == 'POST':
        if 'sfile' not in request.files \
           or 'jfile' not in request.files:
                return jsonify({"msg : error"}), 500

        sub_file = request.files['sfile']
        judge_file = request.files['jfile']

        try:
            per_team = int(request.form['ifile'])
        except ValueError as e:
            return jsonify({"msg : error"}), 500

        if not (sub_file and allowed_file(sub_file.filename)) \
           or not (judge_file and allowed_file(judge_file.filename)):
            return jsonify({"msg : error"}), 500

        sub_string = sub_file.read().decode('utf-8').splitlines()
        sub_dicts = [{k: v for k, v in row.items()} for row \
                     in csv.DictReader(sub_string)]
        submissions = []
        for x in sub_dicts:
            submissions.append(x['Submission Title'])
        random.Random(0).shuffle(submissions)
        assign_tables(submissions)

        judge_string = judge_file.read().decode('utf-8')
        judges = list(judge_string.split("\n"))

        result = algorithm.assign_judges(judges, submissions, per_team)
        time_constraints(result, submissions)
        db.db.col.replace_one({}, result, upsert=True)

        return get_assignments()

    if request.method == 'GET':
        return get_assignments()


@bp.route('/sponsor-prizes', methods=["GET", "POST"])
def sponsor_prizes():
    if request.method == 'POST':
        if 'sponsors_file' not in request.files:
            return jsonify({"msg : error"}), 500

        sponsors_file = request.files['sponsors_file']

        if not (sponsors_file and allowed_file(sponsors_file.filename)):
            return jsonify({"msg : error"}), 500

        file_string = sponsors_file.read().decode('utf-8').splitlines()
        dicts = [{k: v for k, v in row.items()} for row \
                     in csv.DictReader(file_string)]
        prizes = {}
        for i in dicts:
            if i['Opt-in prize'] not in prizes:
                prizes[i['Opt-in prize']] = []
            prizes[i['Opt-in prize']].append(i['Submission Title'])

        db.db.col2.replace_one({}, prizes, upsert=True)

        return get_sponsor_prizes()

    if request.method == 'GET':
        return get_sponsor_prizes()


@bp.route('/table-assignments', methods=["GET"])
def table_assignments():
    result = db.db.col3.find_one({}, {'_id': 0})
    return jsonify(result);
