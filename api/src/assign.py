from util import algorithm
from flask import (
    Blueprint, request, jsonify, flash, redirect, render_template, url_for
)
import csv
import random
from db import db

assign_api = Blueprint('assign', __name__)

#col: judge assignments
#col2: sponsor prizes
#col3: table assignments
#col4: room assignments

ALLOWED_EXTENSIONS = {"csv", "txt"}


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_assignments():
    result = db.judge.find_one({}, {'_id': 0})
    return jsonify(result)


def get_sponsor_prizes():
    result = db.sponsor.find_one({}, {'_id': 0})
    return jsonify(result)


def get_tables():
    result = db.table.find_one({}, {'_id': 0})
    return jsonify(result)


def get_rooms():
    result = db.room.find_one({}, {'_id': 0})
    return jsonify(result)


def assign_tables(submissions):
    # print("submissions")
    # print(submissions)
    tables = {}
    i = 1
    for x in submissions:
        tables[x] = i
        i += 1
    db.table.replace_one({}, tables, upsert=True)


def assign_rooms(room_file):
    file_string = room_file.read().decode('utf-8-sig').splitlines()
    dicts = [{k: v for k, v in row.items()} for row \
                 in csv.DictReader(file_string)]
    rooms = {}
    print(dicts)
    for i in dicts:
        rooms[i['Room']] = i['Capacity']

    temp_tables = db.table.find_one({}, {'_id': 0})
    tables = {v: k for k, v in temp_tables.items()}
    assignments = {}

    total = 0
    for room in rooms:
        total += int(rooms[room])
    assignments = {}
    counter = 1
    end = False
    for room in rooms:
        assignments[room]= []
    currCap = 0
    i = 1
    while i <= len(tables):
        currCap += 4
        for room in rooms:
            if currCap > float(rooms[room]) * 0.8:
                continue
            assignments[room].append(tables[i])
            i = i + 1
            if i > len(tables):
                break
    # for room in rooms:
    #     # print(room)
    #     cap = int(rooms[room])
    #     teams = int(cap/4)
    #     i = 0
    #     # print(room)
    #     assignments[room] = []
    #     # print("tables")
    #     # print(tables)
    #     # print("assignments")
    #     # print(assignments)
    #     while i < int(teams*.8):
    #         if counter == len(tables) + 1:
    #             end = True
    #             break
    #         print("room")
    #         print(room)
    #         print("counter")
    #         print(counter)
    #         # if counter in tables :
    #         assignments[room].append(tables[counter])
    #         i += 1
    #         counter += 1
    #     if end:
    #         break
    # print(tables)
    db.room.replace_one({}, assignments, upsert=True)


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


@assign_api.route('/assignments', methods=["GET", "POST"])
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
        print(sub_string)
        sub_dicts = [{k: v for k, v in row.items()} for row \
                     in csv.DictReader(sub_string)]
        submissions = []
        print("hello")
        print(sub_dicts)
        for x in sub_dicts:
            submissions.append(x['Submission Title'])
        random.Random(0).shuffle(submissions)

        assign_tables(submissions)
        assign_rooms(room_file)

        judge_string = judge_file.read().decode('utf-8')
        judges = list(judge_string.split("\n"))

        result = algorithm.assign_judges(judges, submissions, per_team)
        time_constraints(result, submissions)
        db.judge.replace_one({}, result, upsert=True)

        return get_assignments()

    if request.method == 'GET':
        return get_assignments()


@assign_api.route('/sponsor-prizes', methods=["GET", "POST"])
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
        print("dicts")
        print(dicts[1])
        for i in dicts:
            print(i)
            for j in i['Opt-In Prizes'].split(","):
                if j not in prizes:
                    prizes[j] = []                
                prizes[j].append(i['Submission Title'])

        db.sponsor.replace_one({}, prizes, upsert=True)

        return get_sponsor_prizes()

    if request.method == 'GET':
        return get_sponsor_prizes()


@assign_api.route('/table-assignments', methods=["GET"])
def table_assignments():
    return get_tables()


@assign_api.route('/room-assignments', methods=["GET", "POST"])
def room_assignments():
    return get_rooms()
