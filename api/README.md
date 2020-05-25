First time
```
python -m venv hophacks-env
./hophacks-env/scripts/activate
pip install -r requirements.txt
```

Running Dev
```
./hophacks-env/scripts/activate
cd src
flask run
```

Running Server on port 8000(need gunicorn)
```
pip install -r requirements.txt
cd src
gunicorn app:app
```
