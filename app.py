from flask import Flask
import os

from api import api
from routes import routes


app = Flask(__name__)

app.secret_key = 's3cr3t'
app.debug = True
app._static_folder = os.path.abspath("templates/static/")

app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(routes, url_prefix='/')
