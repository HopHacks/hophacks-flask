"""Single source of truth for the current event's name and S3 key slug.

Hardcoded (not read from the working directory) so it is safe under Zappa /
Lambda, where the process CWD is not the source tree and relative ``open()``
calls fail. Update these constants once per hackathon cycle.
"""

EVENT_NAME = "Fall 2026"
EVENT_SLUG = "Fall-2026"
EVENT_DATES = "September 18-20, 2026"


def get_event_name():
    return EVENT_NAME


def get_event_slug():
    return EVENT_SLUG
