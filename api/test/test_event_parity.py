import pathlib
import re
import sys

import pytest

sys.path.append('../src')

from config.event import EVENT_NAME, EVENT_DATES


def _event_ts():
    event_ts = (
        pathlib.Path(__file__).resolve().parents[2]
        / 'frontend' / 'app' / 'util' / 'event.ts'
    )
    if not event_ts.exists():
        pytest.skip("frontend not present in this checkout")
    return event_ts.read_text()


def test_frontend_event_constant_matches_backend():
    """EVENT_NAME (api) and CURRENT_EVENT (frontend) are hand-maintained and
    must stay equal, or registrations get keyed under a name the frontend and
    admin tooling never query."""
    match = re.search(r'CURRENT_EVENT\s*=\s*"([^"]+)"', _event_ts())
    assert match is not None, "CURRENT_EVENT not found in frontend/app/util/event.ts"
    assert match.group(1) == EVENT_NAME


def test_frontend_event_dates_match_backend():
    """EVENT_DATES (api, shown in every email) and CURRENT_EVENT_DATES
    (frontend) must stay equal so emails and pages never disagree."""
    match = re.search(r'CURRENT_EVENT_DATES\s*=\s*"([^"]+)"', _event_ts())
    assert match is not None, "CURRENT_EVENT_DATES not found in frontend/app/util/event.ts"
    assert match.group(1) == EVENT_DATES
