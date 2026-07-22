"""Pure parsing + assignment logic for the judge tool (workflow 1)."""

from __future__ import annotations

import csv
import io
import math
import random
import re
from typing import Dict, List, Optional, Tuple


class ValidationError(Exception):
    """Raised for invalid uploads / inputs (maps to HTTP 400)."""


def extract_slug(submission_url: str) -> str:
    trimmed = (submission_url or "").strip()
    if not trimmed:
        raise ValidationError("Submission Url is empty")
    return trimmed.rstrip("/").split("/")[-1]


def _split_csv_list(value: str) -> List[str]:
    """Split a Devpost multi-select cell into individual options."""
    if value is None:
        return []
    text = str(value).strip()
    if not text:
        return []

    # Normalize common separators used in Devpost / Excel exports.
    text = (
        text.replace("\r\n", "\n")
        .replace("\r", "\n")
        .replace("\n", ", ")
        .replace(";", ", ")
        .replace(" / ", ", ")
        .replace(" | ", ", ")
        .replace(" and ", ", ")
    )

    # Prefer ", " (legacy hopHacks / Devpost style), then bare commas.
    if ", " in text:
        parts = text.split(", ")
    else:
        parts = text.split(",")

    seen = set()
    result: List[str] = []
    for part in parts:
        cleaned = part.strip().strip('"').strip("'")
        if not cleaned or cleaned in seen:
            continue
        seen.add(cleaned)
        result.append(cleaned)
    return result


def _find_all_track_headers(header_map: Dict[str, str]) -> List[str]:
    """All CSV columns that look like track selections (preserve order)."""
    preferred = _find_track_header(header_map)
    headers: List[str] = []
    if preferred:
        headers.append(preferred)

    for normalized, original in header_map.items():
        if "track" not in normalized:
            continue
        # Skip unrelated columns like "tracking number"
        if "tracking" in normalized:
            continue
        if original not in headers:
            headers.append(original)
    return headers


def _extract_tracks_from_row(row: dict, track_headers: List[str]) -> List[str]:
    """Union of every track value from all track-like columns."""
    seen = set()
    tracks: List[str] = []
    for header in track_headers:
        for track in _split_csv_list((row.get(header) or "").strip()):
            if track not in seen:
                seen.add(track)
                tracks.append(track)
    return tracks


def _normalize_header(header: str) -> str:
    return re.sub(r"\s+", " ", (header or "").replace("\ufeff", "").strip()).lower()


def _build_header_map(fieldnames: List[str]) -> Dict[str, str]:
    """Map normalized header -> original header."""
    mapping: Dict[str, str] = {}
    for name in fieldnames:
        if name is None:
            continue
        mapping[_normalize_header(name)] = name
    return mapping


def _row_value_from_map(row: dict, header_map: Dict[str, str], *candidates: str) -> str:
    for candidate in candidates:
        original = header_map.get(_normalize_header(candidate))
        if original is not None:
            return (row.get(original) or "").strip()
    return ""


def _find_header(header_map: Dict[str, str], *must_contain: str) -> Optional[str]:
    """Return original header whose normalized name contains all needles."""
    needles = [_normalize_header(n) for n in must_contain]
    for normalized, original in header_map.items():
        if all(n in normalized for n in needles):
            return original
    return None


def _find_track_header(header_map: Dict[str, str]) -> Optional[str]:
    """
    HopHacks Devpost exports put track / category opt-ins in "Opt-In Prizes".
    Fall back to the classic track question if that column is missing.
    """
    for candidate in (
        "Opt-In Prizes",
        "Opt In Prizes",
        "Which Track Are You Submitting To?",
        "Tracks",
        "Track",
    ):
        exact = header_map.get(_normalize_header(candidate))
        if exact:
            return exact

    for needles in (
        ("opt-in prizes",),
        ("opt in prizes",),
        ("which track",),
        ("track", "submitting"),
        ("tracks",),
        ("prizes",),
        ("track",),
    ):
        found = _find_header(header_map, *needles)
        if found:
            return found
    return None


def _find_prize_header(header_map: Dict[str, str]) -> Optional[str]:
    # Same column as tracks for HopHacks exports; keep for compatibility.
    return _find_track_header(header_map)


def parse_submissions_csv_with_meta(csv_content: str) -> Tuple[List[dict], dict]:
    """Parse Devpost CSV and report which columns supplied tracks/prizes."""
    reader = csv.DictReader(io.StringIO(csv_content))
    if reader.fieldnames is None:
        raise ValidationError("Submissions CSV is empty")

    header_map = _build_header_map(list(reader.fieldnames))
    if "project title" not in header_map or "submission url" not in header_map:
        raise ValidationError(
            "Submissions CSV missing required columns: Project Title, Submission Url"
        )

    track_headers = _find_all_track_headers(header_map)
    # Always include Opt-In Prizes as a track source for HopHacks.
    opt_in = header_map.get(_normalize_header("Opt-In Prizes")) or header_map.get(
        _normalize_header("Opt In Prizes")
    )
    if opt_in and opt_in not in track_headers:
        track_headers.insert(0, opt_in)
    elif opt_in and track_headers and track_headers[0] != opt_in:
        track_headers = [opt_in] + [h for h in track_headers if h != opt_in]

    track_header = track_headers[0] if track_headers else None

    submissions: List[dict] = []
    for row in reader:
        project_title = _row_value_from_map(row, header_map, "Project Title")
        submission_url = _row_value_from_map(row, header_map, "Submission Url")

        if project_title in ("Untitled", "SAMPLE"):
            continue
        if not submission_url:
            continue

        slug = extract_slug(submission_url)
        if not slug:
            continue

        # Tracks = every value from Opt-In Prizes (and any other track columns).
        tracks = _extract_tracks_from_row(row, track_headers)
        # Keep prizes identical to tracks for this export format.
        prizes = list(tracks)

        submissions.append(
            {
                "slug": slug,
                "projectTitle": project_title,
                "submissionUrl": submission_url,
                "tracks": tracks,
                "prizes": prizes,
            }
        )

    if not submissions:
        raise ValidationError("No valid submissions found")

    meta = {
        "trackColumn": track_header,
        "trackColumns": track_headers,
        "prizeColumn": track_header,
        "columns": [c for c in reader.fieldnames if c is not None],
        "tracksFound": sorted(
            {t for s in submissions for t in (s.get("tracks") or [])}
        ),
    }
    return submissions, meta


def parse_submissions_csv(csv_content: str) -> List[dict]:
    submissions, _meta = parse_submissions_csv_with_meta(csv_content)
    return submissions


def build_submission_directory(
    submissions: List[dict],
    table_assignments: Dict[str, int],
    room_assignments: Dict[str, List[str]],
    devpost_base_url: str,
) -> List[dict]:
    """Flat list of every submission with table/room for track judging."""
    slug_to_room = build_slug_to_room_map(room_assignments)
    directory = []

    for sub in submissions:
        slug = sub["slug"]
        directory.append(
            {
                "slug": slug,
                "projectTitle": sub.get("projectTitle") or format_display_name(slug),
                "displayName": format_display_name(slug),
                "tableNumber": table_assignments.get(slug, 0),
                "room": slug_to_room.get(slug, "Unassigned"),
                "tracks": sub.get("tracks") or [],
                "prizes": sub.get("prizes") or [],
                "devpostUrl": build_devpost_url(slug, devpost_base_url),
            }
        )

    directory.sort(key=lambda s: (s["tableNumber"], s["displayName"]))
    return directory


def parse_rooms_csv(csv_content: str) -> Dict[str, int]:
    reader = csv.DictReader(io.StringIO(csv_content))
    if reader.fieldnames is None:
        raise ValidationError("No valid rooms found")

    fields = set(reader.fieldnames)
    if "Room" not in fields or "Capacity" not in fields:
        raise ValidationError(
            "Rooms CSV missing required columns: Room, Capacity"
        )

    rooms: Dict[str, int] = {}
    for row in reader:
        room_name = (row.get("Room") or "").strip()
        capacity_raw = (row.get("Capacity") or "").strip()
        if not room_name:
            continue
        try:
            capacity = int(capacity_raw)
        except ValueError:
            raise ValidationError(f'Invalid capacity for room "{room_name}"')
        if capacity <= 0:
            raise ValidationError(f'Invalid capacity for room "{room_name}"')
        rooms[room_name] = capacity

    if not rooms:
        raise ValidationError("No valid rooms found")

    return rooms


def parse_judges_txt(txt_content: str) -> List[str]:
    seen = set()
    judges: List[str] = []
    for line in txt_content.splitlines():
        name = line.strip()
        if not name or name in seen:
            continue
        seen.add(name)
        judges.append(name)

    if not judges:
        raise ValidationError("No valid judges found")

    return judges


def parse_judges_per_team(value) -> int:
    if value is None or str(value).strip() == "":
        raise ValidationError("Missing ifile (judges per team)")
    try:
        parsed = int(str(value).strip())
    except ValueError:
        raise ValidationError(
            "Invalid ifile (judges per team must be a positive integer)"
        )
    if parsed <= 0:
        raise ValidationError(
            "Invalid ifile (judges per team must be a positive integer)"
        )
    return parsed


def shuffle_submissions(submissions: List[dict]) -> List[dict]:
    copy = list(submissions)
    random.Random(0).shuffle(copy)
    return copy


def assign_tables(submissions: List[dict]) -> Dict[str, int]:
    return {sub["slug"]: index + 1 for index, sub in enumerate(submissions)}


def teams_per_room(capacity: int) -> int:
    return math.floor((capacity * 0.8) / 4)


def assign_rooms(
    table_assignments: Dict[str, int], rooms: Dict[str, int]
) -> Tuple[Dict[str, List[str]], List[str]]:
    inverted = {table: slug for slug, table in table_assignments.items()}
    table_numbers = sorted(inverted.keys())

    room_names = list(rooms.keys())
    assignments = {name: [] for name in room_names}
    warnings: List[str] = []

    if not room_names:
        raise ValidationError("No valid rooms found")

    total_capacity = sum(teams_per_room(rooms[name]) for name in room_names)
    if len(table_numbers) > total_capacity:
        warnings.append(
            f"More teams ({len(table_numbers)}) than total room capacity "
            f"({total_capacity}). Overflow teams will be assigned to the last room."
        )

    room_index = 0
    teams_in_current = 0
    current_limit = teams_per_room(rooms[room_names[0]])

    for table_number in table_numbers:
        slug = inverted[table_number]
        if room_index >= len(room_names):
            room_index = len(room_names) - 1

        assignments[room_names[room_index]].append(slug)
        teams_in_current += 1

        if teams_in_current >= current_limit and room_index < len(room_names) - 1:
            room_index += 1
            teams_in_current = 0
            current_limit = teams_per_room(rooms[room_names[room_index]])

    return assignments, warnings


def assign_judges(
    submissions: List[dict], judges: List[str], judges_per_team: int
) -> Dict[str, List[str]]:
    if not judges:
        raise ValidationError("No valid judges found")
    if judges_per_team > len(judges):
        raise ValidationError(
            "judgesPerTeam cannot be greater than the number of judges"
        )

    judge_assignments = {judge: [] for judge in judges}
    idx = 0

    for submission in submissions:
        assigned = set()
        while len(assigned) < judges_per_team:
            judge = judges[idx % len(judges)]
            if judge not in assigned:
                judge_assignments[judge].append(submission["slug"])
                assigned.add(judge)
            idx += 1

    return judge_assignments


def _pair_key(first: str, second: str) -> str:
    return f"{first}::{second}"


def _count_adjacent_pairs(assignments: Dict[str, List[str]]) -> Dict[str, int]:
    counts: Dict[str, int] = {}
    for queue in assignments.values():
        for i in range(len(queue) - 1):
            key = _pair_key(queue[i], queue[i + 1])
            counts[key] = counts.get(key, 0) + 1
    return counts


def _would_create_conflict(
    queue: List[str],
    index: int,
    candidate: str,
    global_counts: Dict[str, int],
    current_judge_pairs: set,
) -> bool:
    left = queue[index] if index < len(queue) else None
    right = queue[index + 1] if index + 1 < len(queue) else None

    if left:
        left_key = _pair_key(left, candidate)
        left_count = global_counts.get(left_key, 0)
        left_already = left_key in current_judge_pairs
        if (not left_already and left_count >= 1) or (
            left_already and left_count > 1
        ):
            return True

    if right:
        right_key = _pair_key(candidate, right)
        right_count = global_counts.get(right_key, 0)
        right_already = right_key in current_judge_pairs
        if (not right_already and right_count >= 1) or (
            right_already and right_count > 1
        ):
            return True

    return False


def apply_time_constraints(
    judge_assignments: Dict[str, List[str]]
) -> Dict[str, List[str]]:
    result = {judge: list(queue) for judge, queue in judge_assignments.items()}

    for judge in list(result.keys()):
        queue = result[judge]
        for i in range(len(queue) - 1):
            global_counts = _count_adjacent_pairs(result)
            key = _pair_key(queue[i], queue[i + 1])
            if global_counts.get(key, 0) <= 1:
                continue
            if i + 2 >= len(queue):
                continue

            current_pairs = {
                _pair_key(queue[j], queue[j + 1])
                for j in range(len(queue) - 1)
            }
            candidate = queue[i + 2]
            if _would_create_conflict(
                queue, i, candidate, global_counts, current_pairs
            ):
                continue
            queue[i + 1], queue[i + 2] = queue[i + 2], queue[i + 1]

    return result


def format_display_name(slug: str) -> str:
    without_prefix = re.sub(r"^\d+-", "", slug)
    return " ".join(
        word[:1].upper() + word[1:] for word in without_prefix.split("-") if word
    )


def build_devpost_url(slug: str, base_url: str) -> str:
    return f"{base_url.rstrip('/')}/{slug}"


def build_slug_to_room_map(
    room_assignments: Dict[str, List[str]]
) -> Dict[str, str]:
    mapping: Dict[str, str] = {}
    for room_name, slugs in room_assignments.items():
        for slug in slugs:
            mapping[slug] = room_name
    return mapping


def build_enriched_assignments(
    event_id: str,
    judge_assignments: Dict[str, List[str]],
    table_assignments: Dict[str, int],
    room_assignments: Dict[str, List[str]],
    devpost_base_url: str,
    submission_lookup: Optional[Dict[str, dict]] = None,
) -> dict:
    slug_to_room = build_slug_to_room_map(room_assignments)
    submission_lookup = submission_lookup or {}
    enriched = []

    for judge_name in sorted(judge_assignments.keys()):
        submissions = []
        for slug in judge_assignments[judge_name]:
            meta = submission_lookup.get(slug) or {}
            submissions.append(
                {
                    "slug": slug,
                    "tableNumber": table_assignments.get(slug, 0),
                    "room": slug_to_room.get(slug, "Unassigned"),
                    "displayName": format_display_name(slug),
                    "devpostUrl": build_devpost_url(slug, devpost_base_url),
                    "tracks": list(meta.get("tracks") or []),
                    "prizes": list(meta.get("prizes") or []),
                    "projectTitle": meta.get("projectTitle")
                    or format_display_name(slug),
                }
            )
        submissions.sort(key=lambda s: s["tableNumber"])
        enriched.append({"judgeName": judge_name, "submissions": submissions})

    return {"eventId": event_id, "assignments": enriched}
