from flask import Blueprint

api = Blueprint('api', __name__)

@api.route('/add')
def register():
    return("hello world")
