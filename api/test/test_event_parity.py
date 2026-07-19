import pathlib
import re
import sys

import pytest

sys.path.append('../src')

from config.event import EVENT_NAME


def test_frontend_event_constant_matches_backend():
    """EVENT_NAME (api) and CURRENT_EVENT (frontend) are hand-maintained and
    must stay equal, or registrations get keyed under a name the frontend and
    admin tooling never query."""
    event_ts = (
        pathlib.Path(__file__).resolve().parents[2]
        / 'frontend' / 'app' / 'util' / 'event.ts'
    )
    if not event_ts.exists():
        pytest.skip("frontend not present in this checkout")

    match = re.search(r'CURRENT_EVENT\s*=\s*"([^"]+)"', event_ts.read_text())
    assert match is not None, "CURRENT_EVENT not found in frontend/app/util/event.ts"
    assert match.group(1) == EVENT_NAME
