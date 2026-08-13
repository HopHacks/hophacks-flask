"""Single source of truth for the current event's name and S3 key slug.

Hardcoded (not read from the working directory) so it is safe under Zappa /
Lambda, where the process CWD is not the source tree and relative ``open()``
calls fail. Update these constants once per hackathon cycle.
"""

import datetime

EVENT_NAME = "Fall 2026"
EVENT_SLUG = "Fall-2026"
EVENT_DATES = "September 18-20, 2026"

# Accounts persist across years, so "made a profile but never applied" is only
# meaningful for accounts created this cycle -- otherwise every dormant account
# since 2021 reads as an unfinished application. The 2026 signup flow first
# reached master (and so prod) on 2026-07-09, so no 2026 account predates that;
# this is a deliberately safe lower bound. Bump it each cycle.
EVENT_CYCLE_START = datetime.datetime(2026, 7, 1)


def get_event_name():
    return EVENT_NAME


def get_event_slug():
    return EVENT_SLUG
