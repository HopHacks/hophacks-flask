from . import assign_judges
from flask import (
    Blueprint, current_app, request, jsonify, flash, g, redirect, render_template, session, url_for
)
from werkzeug.utils import secure_filename
import os

bp = Blueprint('assign', __name__)

ALLOWED_EXTENSIONS = {"csv", "txt"}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/upload', methods=["GET", "POST"])
def upload():
    return render_template("upload.html")

@bp.route('/display', methods=["GET", "POST"])
def display():
    print("hello")
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
        s = secure_filename(sub_file.filename)
        j = secure_filename(judge_file.filename)
        sub_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], s))
        judge_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], j))
        result = assign_judges.assign_judges(j, s, per_team)
        return render_template("display.html", result=result)
