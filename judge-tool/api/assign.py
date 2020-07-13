from . import assign_judges
from flask import (
    Blueprint, request, jsonify, flash, redirect, render_template, url_for
)
import csv
import random
from . import db
import pymongo

bp = Blueprint('assign', __name__)

ALLOWED_EXTENSIONS = {"csv", "txt"}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_assignments():
    result = db.db.col.find_one({}, {'_id': 0})
    return render_template('display.html', result=result)


@bp.route('/upload', methods=["GET", "POST"])
def upload():
    return render_template("upload.html")


@bp.route('/display', methods=["GET", "POST"])
def display():
    if request.method == 'POST':
        if 'sfile' not in request.files \
           or 'jfile' not in request.files:
                flash('No file attached')
                return redirect(url_for("assign.upload"))

        sub_file = request.files['sfile']
        judge_file = request.files['jfile']

        try:
            per_team = int(request.form['ifile'])
        except ValueError as e:
            flash('Enter an integer')
            return redirect(url_for("assign.upload"))

        if not (sub_file and allowed_file(sub_file.filename)) \
           or not (judge_file and allowed_file(judge_file.filename)):
            flash('Incorrect file type')
            return redirect(url_for("assign.upload"))

        sub_string = sub_file.read().decode('utf-8').splitlines()
        sub_dicts = [{k: v for k, v in row.items()} for row \
                     in csv.DictReader(sub_string)]
        submissions = []
        for x in sub_dicts:
            submissions.append(x['Submission Title'])
        random.Random(0).shuffle(submissions)
        
        judge_string = judge_file.read().decode('utf-8')
        judges = list(judge_string.split("\n"))
        
        result = assign_judges.assign_judges(judges, submissions, per_team)
        db.db.col.replace_one({}, result, upsert=True)

        return get_assignments()

    if request.method == 'GET':
        return get_assignments()
