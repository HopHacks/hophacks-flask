Note: A local [MongoDB](https://docs.mongodb.com/manual/installation/) instance
is needed to run the site.

First time:
```
python -m venv hophacks-env
./hophacks-env/scripts/activate
pip install -r requirements.txt
```

You also need to create a `config.json` file for the server. We provide a python
script to generate one, (along with an admin account to the users database).
To run this, go to the `src/config` directory and do
```
python config.py dev
```
Note this script will prompt you for admin account credentials.

Running Dev:
```
./hophacks-env/scripts/activate
cd src
flask run
```

Running Server on port 8000 (need gunicorn):
```
pip install -r requirements.txt
cd src
gunicorn app:app
```
