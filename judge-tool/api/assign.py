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
#col4: room assignments

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


def get_tables():
    result = db.db.col3.find_one({}, {'_id': 0})
    return jsonify(result);


def get_rooms():
    result = db.db.col4.find_one({}, {'_id': 0})
    return jsonify(result)


def assign_tables(submissions):
    tables = {}
    i = 1
    for x in submissions:
        tables[x] = i
        i += 1
    db.db.col3.replace_one({}, tables, upsert=True)


def assign_rooms(room_file):
    file_string = room_file.read().decode('utf-8-sig').splitlines()
<<<<<<< HEAD >> f0b9d79825ab53a55e2e2fdfa344dc1d82be61ba
    dicts = [{k: v for k, v in row.items()} for row \
                 in csv.DictReader(file_string)]
    rooms = {}
    print(dicts)
    for i in dicts:
        rooms[i['Room']] = i['Capacity']

    temp_tables = db.db.col3.find_one({}, {'_id': 0})
    tables = {v: k for k, v in temp_tables.items()}
    assignments = {}

    total = 0
    for room in rooms:
        total += int(rooms[room])

    if (total <= len(tables)):
        return jsonify({"msg : error"}), 500

    assignments = {}
    counter = 1
    end = False
    for room in rooms:
        cap = int(rooms[room])
        teams = int(cap/4)
        i = 0
        assignments[room] = []
        while i < int(teams*.8):
            if counter == len(tables) + 1:
                end = True
                break
            assignments[room].append(tables[counter])
            i += 1
            counter += 1
        if end:
            break

    db.db.col4.replace_one({}, assignments, upsert=True)


def time_constraints(assignments, submissions):
    positions = {}
    for sub in submissions:
        positions[sub] = {}
        for a in assignments:
            for item in assignments[a]:
                if item == sub:
                    positions[sub][a] = assignments[a].index(item)

    for pos in positions:
        for key_a in positions[pos]:
            for key_b in positions[pos]:
                if key_a == key_b:
                    break
                    if positions[pos][key_a] == positions[pos][key_b]:
                        if positions[pos][key_a] < len(assignments[key_a]) - 1:
                            assignments[key_a][positions[pos][key_a]], \
                            assignments[key_a][positions[pos][key_a] + 1] = \
                            assignments[key_a][positions[pos][key_a] + 1], \
                            assignments[key_a][positions[pos][key_a]]
                        else:
                            assignments[key_a][positions[pos][key_a]], \
                            assignments[key_a][0] = \
                            assignments[key_a][0], \
                            assignments[key_a][positions[pos][key_a]]


@bp.route('/assignments', methods=["GET", "POST"])
def assignments():
    if request.method == 'POST':
        if 'sfile' not in request.files \
           or 'jfile' not in request.files \
           or 'room_file' not in request.files:
                return jsonify({"msg : error"}), 500

        sub_file = request.files['sfile']
        judge_file = request.files['jfile']
        room_file = request.files['room_file']

        try:
            per_team = int(request.form['ifile'])
        except ValueError as e:
            return jsonify({"msg : error"}), 500

        if not (sub_file and allowed_file(sub_file.filename)) \
           or not (judge_file and allowed_file(judge_file.filename)) \
           or not (room_file and allowed_file(room_file.filename)):
            return jsonify({"msg : error"}), 500

        sub_string = sub_file.read().decode('utf-8-sig').splitlines()
<<<<<<< HEAD
        print(sub_string)
=======
>>>>>>> f0b9d79825ab53a55e2e2fdfa344dc1d82be61ba
        sub_dicts = [{k: v for k, v in row.items()} for row \
                     in csv.DictReader(sub_string)]
        submissions = []
        for x in sub_dicts:
            submissions.append(x['Submission Title'])
        random.Random(0).shuffle(submissions)

        assign_tables(submissions)
        assign_rooms(room_file)

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
    return get_tables()


@bp.route('/room-assignments', methods=["GET", "POST"])
def room_assignments():
    return get_rooms()
