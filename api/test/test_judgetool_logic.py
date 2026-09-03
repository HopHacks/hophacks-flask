import sys

sys.path.append("../src")

from util.judgetool_logic import (
    ValidationError,
    apply_time_constraints,
    assign_judges,
    assign_rooms,
    assign_tables,
    build_enriched_assignments,
    extract_slug,
    format_display_name,
    parse_judges_txt,
    parse_rooms_csv,
    parse_submissions_csv,
    shuffle_submissions,
    teams_per_room,
)


SAMPLE_CSV = """Project Title,Submission Url
SAMPLE,https://devpost.com/submissions/00000-sample
Untitled,https://devpost.com/submissions/00001-untitled
Cool Project,https://devpost.com/submissions/12345-cool-project
Other Project,https://devpost.com/submissions/67890-other-project
Empty Url,
"""


def test_filter_invalid_submissions():
    submissions = parse_submissions_csv(SAMPLE_CSV)
    assert len(submissions) == 2
    assert [s["slug"] for s in submissions] == [
        "12345-cool-project",
        "67890-other-project",
    ]


def test_extract_slug():
    assert (
        extract_slug("https://devpost.com/submissions/12345-my-project")
        == "12345-my-project"
    )
    assert (
        extract_slug("https://devpost.com/submissions/12345-my-project/")
        == "12345-my-project"
    )


def test_missing_columns():
    try:
        parse_submissions_csv("Title,Url\nA,https://x.com/a")
        assert False
    except ValidationError:
        pass


def test_deterministic_shuffle():
    submissions = parse_submissions_csv(SAMPLE_CSV)
    first = [s["slug"] for s in shuffle_submissions(submissions)]
    second = [s["slug"] for s in shuffle_submissions(submissions)]
    assert first == second


def test_table_assignment():
    submissions = shuffle_submissions(parse_submissions_csv(SAMPLE_CSV))
    tables = assign_tables(submissions)
    assert len(tables) == len(submissions)
    assert min(tables.values()) == 1
    assert max(tables.values()) == len(submissions)


def test_room_capacity_rule():
    assert teams_per_room(160) == 32
    assert teams_per_room(96) == 19


def test_room_assignment_overflow_warning():
    tables = {"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}
    rooms = {"Tiny": 8}
    _, warnings = assign_rooms(tables, rooms)
    assert len(warnings) > 0


def test_judge_assignment_even_load():
    submissions = shuffle_submissions(parse_submissions_csv(SAMPLE_CSV))
    judges = ["Alice Smith", "Bob Jones", "Charlie Lee", "Dana Patel"]
    assignments = assign_judges(submissions, judges, 2)

    for submission in submissions:
        assigned = [
            j for j, slugs in assignments.items() if submission["slug"] in slugs
        ]
        assert len(set(assigned)) == 2

    counts = [len(q) for q in assignments.values()]
    assert max(counts) - min(counts) <= 1


def test_judges_per_team_validation():
    submissions = shuffle_submissions(parse_submissions_csv(SAMPLE_CSV))
    judges = ["Alice", "Bob"]
    try:
        assign_judges(submissions, judges, 5)
        assert False
    except ValidationError:
        pass


def test_time_constraints_resolves_adjacent_pair():
    assignments = {
        "Judge A": ["project1", "project2", "project8"],
        "Judge B": ["project1", "project2", "project5"],
    }
    result = apply_time_constraints(assignments)
    pair_a = f"{result['Judge A'][0]}::{result['Judge A'][1]}"
    pair_b = f"{result['Judge B'][0]}::{result['Judge B'][1]}"
    assert pair_a != pair_b


def test_format_display_name():
    assert format_display_name("12345-my-cool-project") == "My Cool Project"


def test_enriched_get_shape():
    result = build_enriched_assignments(
        "hophacks-fall-2026",
        {
            "Bob Jones": ["67890-other-project", "12345-cool-project"],
            "Alice Smith": ["12345-cool-project"],
        },
        {"12345-cool-project": 1, "67890-other-project": 2},
        {
            "BSC 210": ["12345-cool-project"],
            "BSC 204": ["67890-other-project"],
        },
        "https://hophacks-fall-2026.devpost.com/submissions",
    )
    assert result["assignments"][0]["judgeName"] == "Alice Smith"
    bob = result["assignments"][1]
    assert bob["submissions"][0]["tableNumber"] == 1
    assert bob["submissions"][0]["displayName"] == "Cool Project"
    assert bob["submissions"][0]["room"] == "BSC 210"


def test_parse_judges_and_rooms():
    assert parse_judges_txt("Alice\nBob\nAlice\n\nCharlie\n") == [
        "Alice",
        "Bob",
        "Charlie",
    ]
    rooms = parse_rooms_csv("Room,Capacity\nBSC 210,160\nBSC 204,96\n")
    assert rooms == {"BSC 210": 160, "BSC 204": 96}
