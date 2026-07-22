"""Judge tool API — workflow 1 (assignments, tables, rooms).

Mounted at /api/judgetool.
"""

from datetime import datetime

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from db import db
from util.decorators import check_admin
from util.judgetool_logic import (
    ValidationError,
    apply_time_constraints,
    assign_judges,
    assign_rooms,
    assign_tables,
    build_enriched_assignments,
    build_submission_directory,
    parse_judges_per_team,
    parse_judges_txt,
    parse_rooms_csv,
    parse_submissions_csv_with_meta,
    shuffle_submissions,
)
from config.event import EVENT_SLUG

import csv

assign_api = Blueprint("assign", __name__)

ALLOWED_EXTENSIONS = {"csv", "txt"}
DEFAULT_EVENT_ID = f"hophacks-{EVENT_SLUG.lower()}"
DEVPOST_BASE_URL = f"https://{DEFAULT_EVENT_ID}.devpost.com/submissions"

TABLE_COLLECTION = "table_assignments"
ROOM_COLLECTION = "room_assignments"
JUDGE_COLLECTION = "judge_assignments"
SUBMISSION_COLLECTION = "submission_directory"


def allowed_file(filename):
    return (
        filename
        and "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def _event_id_from_request():
    value = request.args.get("eventId") or request.form.get("eventId")
    if value and str(value).strip():
        return str(value).strip()
    return DEFAULT_EVENT_ID


def _upsert_by_event(collection, event_id, payload):
    now = datetime.utcnow()
    getattr(db, collection).update_one(
        {"eventId": event_id},
        {
            "$set": {**payload, "updatedAt": now},
            "$setOnInsert": {"createdAt": now},
        },
        upsert=True,
    )


# ---------- Legacy sponsor / table / room GETs (kept for old UI) ----------


def get_sponsor_prizes():
    result = db.sponsor.find_one({}, {"_id": 0})
    return jsonify(result)


def get_tables():
    event_id = _event_id_from_request()
    doc = getattr(db, TABLE_COLLECTION).find_one({"eventId": event_id}, {"_id": 0})
    if doc and "assignments" in doc:
        return jsonify(doc["assignments"])
    # Fall back to legacy flat document
    legacy = db.table.find_one({}, {"_id": 0})
    return jsonify(legacy)


def get_rooms():
    event_id = _event_id_from_request()
    doc = getattr(db, ROOM_COLLECTION).find_one({"eventId": event_id}, {"_id": 0})
    if doc and "assignments" in doc:
        return jsonify(doc["assignments"])
    legacy = db.room.find_one({}, {"_id": 0})
    return jsonify(legacy)


# ---------- Workflow 1 ----------


@assign_api.route("/assignments", methods=["POST"])
@jwt_required
@check_admin
def create_assignments():
    try:
        if "sfile" not in request.files:
            return jsonify({"error": "Missing sfile (submissions CSV)"}), 400
        if "jfile" not in request.files:
            return jsonify({"error": "Missing jfile (judges TXT)"}), 400
        if "room_file" not in request.files:
            return jsonify({"error": "Missing room_file (rooms CSV)"}), 400
        if request.form.get("ifile") is None or str(request.form.get("ifile")).strip() == "":
            return jsonify({"error": "Missing ifile (judges per team)"}), 400

        sub_file = request.files["sfile"]
        judge_file = request.files["jfile"]
        room_file = request.files["room_file"]

        if not (
            allowed_file(sub_file.filename)
            and allowed_file(judge_file.filename)
            and allowed_file(room_file.filename)
        ):
            return jsonify({"error": "Files must be .csv or .txt as appropriate"}), 400

        event_id = _event_id_from_request()

        submissions, csv_meta = parse_submissions_csv_with_meta(
            sub_file.read().decode("utf-8-sig")
        )
        submissions = shuffle_submissions(submissions)
        judges = parse_judges_txt(judge_file.read().decode("utf-8"))
        rooms = parse_rooms_csv(room_file.read().decode("utf-8-sig"))
        judges_per_team = parse_judges_per_team(request.form.get("ifile"))

        if not csv_meta.get("trackColumn"):
            warnings_pre = [
                'No "Opt-In Prizes" (track) column found in submissions CSV. '
                f"Columns seen: {', '.join(csv_meta.get('columns') or [])}"
            ]
        else:
            warnings_pre = []

        table_assignments = assign_tables(submissions)
        room_assignments, warnings = assign_rooms(table_assignments, rooms)
        warnings = warnings_pre + warnings
        judge_assignments = apply_time_constraints(
            assign_judges(submissions, judges, judges_per_team)
        )
        submission_directory = build_submission_directory(
            submissions,
            table_assignments,
            room_assignments,
            DEVPOST_BASE_URL,
        )

        _upsert_by_event(
            TABLE_COLLECTION, event_id, {"assignments": table_assignments}
        )
        _upsert_by_event(
            ROOM_COLLECTION,
            event_id,
            {"assignments": room_assignments, "warnings": warnings},
        )
        _upsert_by_event(
            JUDGE_COLLECTION,
            event_id,
            {
                "assignments": judge_assignments,
                "judgesPerTeam": judges_per_team,
            },
        )
        _upsert_by_event(
            SUBMISSION_COLLECTION,
            event_id,
            {
                "submissions": submission_directory,
                "csvMeta": csv_meta,
            },
        )

        # Keep legacy flat collections in sync for older consumers
        db.table.replace_one({}, table_assignments, upsert=True)
        db.room.replace_one({}, room_assignments, upsert=True)
        db.judge.replace_one({}, judge_assignments, upsert=True)

        return jsonify(
            {
                "eventId": event_id,
                "counts": {
                    "validSubmissions": len(submissions),
                    "judges": len(judges),
                    "rooms": len(rooms),
                    "judgesPerTeam": judges_per_team,
                    "tracks": len(csv_meta.get("tracksFound") or []),
                },
                "csvMeta": csv_meta,
                "warnings": warnings,
                "tableAssignments": table_assignments,
                "roomAssignments": room_assignments,
                "judgeAssignments": judge_assignments,
            }
        ), 200

    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {e}"}), 500


@assign_api.route("/assignments", methods=["GET"])
@jwt_required
@check_admin
def get_assignments():
    try:
        event_id = _event_id_from_request()

        judge_doc = getattr(db, JUDGE_COLLECTION).find_one({"eventId": event_id})
        table_doc = getattr(db, TABLE_COLLECTION).find_one({"eventId": event_id})
        room_doc = getattr(db, ROOM_COLLECTION).find_one({"eventId": event_id})

        # Fall back to legacy flat docs if event-scoped docs missing
        if not judge_doc:
            legacy = db.judge.find_one({}, {"_id": 0})
            if not legacy:
                return jsonify(
                    {"error": f'No assignments found for eventId "{event_id}"'}
                ), 400
            judge_assignments = legacy
        else:
            judge_assignments = judge_doc.get("assignments", {})

        if not table_doc:
            table_assignments = db.table.find_one({}, {"_id": 0}) or {}
        else:
            table_assignments = table_doc.get("assignments", {})

        if not room_doc:
            room_assignments = db.room.find_one({}, {"_id": 0}) or {}
        else:
            room_assignments = room_doc.get("assignments", {})

        submission_doc = getattr(db, SUBMISSION_COLLECTION).find_one(
            {"eventId": event_id}
        )
        submission_lookup = {}
        if submission_doc and submission_doc.get("submissions"):
            submission_lookup = {
                s["slug"]: s for s in submission_doc["submissions"] if s.get("slug")
            }

        return jsonify(
            build_enriched_assignments(
                event_id,
                judge_assignments,
                table_assignments,
                room_assignments,
                DEVPOST_BASE_URL,
                submission_lookup,
            )
        ), 200

    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {e}"}), 500


@assign_api.route("/submissions", methods=["GET"])
@jwt_required
@check_admin
def get_submissions():
    """All submissions with table/room/track info for track-specific judging."""
    try:
        event_id = _event_id_from_request()
        doc = getattr(db, SUBMISSION_COLLECTION).find_one({"eventId": event_id})
        if not doc or not doc.get("submissions"):
            return jsonify(
                {"error": f'No submissions found for eventId "{event_id}"'}
            ), 400

        submissions = doc["submissions"]
        csv_meta = doc.get("csvMeta") or {}
        tracks = sorted(
            {
                track
                for sub in submissions
                for track in (sub.get("tracks") or [])
            }
        )
        prizes = sorted(
            {
                prize
                for sub in submissions
                for prize in (sub.get("prizes") or [])
            }
        )

        return jsonify(
            {
                "eventId": event_id,
                "submissions": submissions,
                "tracks": tracks,
                "prizes": prizes,
                "csvMeta": csv_meta,
            }
        ), 200
    except Exception as e:
        return jsonify({"error": f"Internal server error: {e}"}), 500


@assign_api.route("/sponsor-prizes", methods=["GET", "POST"])
@jwt_required
@check_admin
def sponsor_prizes():
    if request.method == "POST":
        if "sponsors_file" not in request.files:
            return jsonify({"error": "Missing sponsors_file"}), 400

        sponsors_file = request.files["sponsors_file"]
        if not (sponsors_file and allowed_file(sponsors_file.filename)):
            return jsonify({"error": "sponsors_file must be a CSV"}), 400

        file_string = sponsors_file.read().decode("utf-8").splitlines()
        dicts = [{k: v for k, v in row.items()} for row in csv.DictReader(file_string)]
        prizes = {}
        for i in dicts:
            if i.get("Project Title") in ("Untitled", "SAMPLE"):
                continue
            for j in (i.get("Opt-In Prizes") or "").split(", "):
                if j == "":
                    continue
                prizes.setdefault(j, []).append(i["Project Title"])

            for j in (i.get("Which Track Are You Submitting To?") or "").split(", "):
                if not j:
                    continue
                prizes.setdefault(j, []).append(i["Project Title"])

        db.sponsor.replace_one({}, prizes, upsert=True)
        return get_sponsor_prizes()

    return get_sponsor_prizes()


@assign_api.route("/table-assignments", methods=["GET"])
@jwt_required
@check_admin
def table_assignments():
    return get_tables()


@assign_api.route("/room-assignments", methods=["GET"])
@jwt_required
@check_admin
def room_assignments():
    return get_rooms()
