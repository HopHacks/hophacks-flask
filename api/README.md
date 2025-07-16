# HopHacks Flask Backend API

## Before Starting

This Flask application depend on `Python == 3.9.10`. To use this specific version of Python along with your other local Python developements, it is encouraged to use [pyenv](https://github.com/pyenv/pyenv). From the link, follow `A. Getting Pyenv`, `B. Set up your shell environment for Pyenv`, and `C. Restart your shell`. Then run

```bash
pyenv install 3.9.10
```

To activate this version in your shell

```bash
pyenv shell 3.9.10
```

To see all your downloaded versions

```bash
pyenv versions
```

## Local Developement

A MongoDB instance is needed to run the site. By default the application looks for one running on the same machine. Refer to [this](#database) section to set up database locally.

```bash
cd api
```

### Backend

#### 1. Setup Virtual Environment

We recommend creating a [Python virtual environment](https://docs.python.org/3/tutorial/venv.html)
for running the API server.

```bash
python -m venv hophacks-env
```

For Windows:

```bash
.\hophacks-env\scripts\activate
```

For Linux

```bash
source hophacks-env/bin/activate
```

#### 2. Install Requirements

Then install the requirements (with your virtual environment activated)

```bash
pip install -r requirements-2025.txt # requirements and requirements2 are deprecated
```

#### 3. Configuration

You also need to create a `config.json` file for the server. We provide a python
script to generate one, (along with an admin account to the users database).
To run this, go to the `src/config` directory and do

```bash
cd src/config
python config.py dev
```

Note this script will also prompt you for admin account credentials.

#### 4. Running

Running Dev:

```bash
cd src
flask run
```

Running Server on port 8000 (need gunicorn):

```bash
cd src
gunicorn app:app
```

### Before Running Locally

Make sure you have all the APIs that can send data publicly are disabled. They include AWS bucket, Slack, and Discord.

## Database

Production database can be accessed through logging in to [MongoDB Cloud](https://account.mongodb.com/account/login) with HopHacks Gmail account.

Local database should be set up by your own. Follow [this](https://www.mongodb.com/docs/manual/administration/install-community/) guide to install and run MongoDB Community. For example, for Mac OS:

```brew
xcode-select --install

brew tap mongodb/brew
brew update
brew install mongodb-community@8.0

brew services start mongodb-community@8.0
```

For your convenience, it is encouraged to download [MongoDB Compass](https://www.mongodb.com/try/download/compass). Then connect to `mongodb://localhost:27017`. You can also connect to production database with its URL here.

## Hosting

This application is hosted on AWS EC2 using Nginx. You could connect to the VM through our AWS Root account console.
In the VM's config.json, you could see our credentials of MongoDB and PostMaster and webhooks for Slack and Discord.
