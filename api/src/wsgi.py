import os
import traceback

# Anchor the config path to this file, not the process working directory:
# on Lambda the cwd is not api/src, so a relative 'config/config.json' fails.
CONFIG_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "config", "config.json"
)

# If the real app fails to build at cold start, Zappa would otherwise leave
# `app` undefined/None and every request 500s with an opaque
# "'NoneType' object is not callable" — hiding the actual cause in CloudWatch.
# Surface the real traceback in the HTTP response so we can diagnose it.
try:
    from app import create_app

    app = create_app(CONFIG_PATH)
except Exception:
    _boot_error = traceback.format_exc()

    from flask import Flask, jsonify

    app = Flask(__name__)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def _report_boot_error(path):
        return (
            jsonify(
                {
                    "boot_error": True,
                    "cwd": os.getcwd(),
                    "config_path": CONFIG_PATH,
                    "config_exists": os.path.exists(CONFIG_PATH),
                    "task_root_listing": sorted(os.listdir("/var/task"))[:40]
                    if os.path.isdir("/var/task")
                    else None,
                    "traceback": _boot_error.splitlines(),
                }
            ),
            500,
        )
