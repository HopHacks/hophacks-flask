import os

from app import create_app

# Anchor the config path to this file, not the process working directory.
# On Lambda the cwd is not api/src, so create_app()'s default relative
# 'config/config.json' would fail to load and leave the app uninitialized.
CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config", "config.json")

app = create_app(CONFIG_PATH)
