from flask import Blueprint, render_template

routes = Blueprint('routes', __name__)

@routes.route('/')
def register():
    return render_template('index.html')