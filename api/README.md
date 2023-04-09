A [MongoDB](https://docs.mongodb.com/manual/installation/) instance
is needed to run the site. By default the application looks for one
running on the same machine.

#### 1. Setup Virtual Environment

We recommend creating a [Python virtual environment](https://docs.python.org/3/tutorial/venv.html)
for running the API server.

```
python -m venv hophacks-env
```

For Windows:

```
.\hophacks-env\scripts\activate
```

For Linux

```
source hophacks-env/bin/activate
```

#### 2. Install Requirements

Then install the requirements (with your virtual environment activated)

```
pip install -r requirements.txt
```

#### 3. Configuration

You also need to create a `config.json` file for the server. We provide a python
script to generate one, (along with an admin account to the users database).
To run this, go to the `src/config` directory and do

```
python config.py dev
```

Note this script will also prompt you for admin account credentials.

#### 4. Running

Running Dev:

```
cd src
flask run
```

Running Server on port 8000 (need gunicorn):

```
cd src
gunicorn app:app
```
