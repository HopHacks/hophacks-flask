import json
import sys

sys.path.append('../src')

from app import create_app


def _make_config(tmp_path, extra):
    base = json.load(open('test.json'))
    base.update(extra)
    path = tmp_path / 'config.json'
    path.write_text(json.dumps(base))
    return str(path)


def test_empty_mail_default_sender_falls_back(tmp_path):
    """Deploy writes MAIL_DEFAULT_SENDER='' when the secret is unset; a falsy
    sender must fall back, or flask-mail asserts at send time and every
    registration 500s (broke prod 2026-07-19)."""
    app = create_app(_make_config(tmp_path, {'MAIL_DEFAULT_SENDER': ''}))
    assert app.config['MAIL_DEFAULT_SENDER'] == 'team@hophacks.com'


def test_explicit_mail_default_sender_wins(tmp_path):
    app = create_app(_make_config(tmp_path, {'MAIL_DEFAULT_SENDER': 'x@y.z'}))
    assert app.config['MAIL_DEFAULT_SENDER'] == 'x@y.z'
