from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from db import db
from datetime import timedelta
from bson import ObjectId

teammatch_api = Blueprint('teammatch_api', __name__)

@teammatch_api.route('/has_team_profile', methods=['GET'])
@jwt_required
def has_team_profile():
    user_id = ObjectId(get_jwt_identity())
    user = db.users.find_one({"_id": user_id})

    has_team_matching = "team_matching" in user and bool(user["team_matching"])

    return jsonify({"in_team_matching": has_team_matching}), 200


@teammatch_api.route('/create', methods=['POST'])
@jwt_required
def create_team_profile():
    user_id = ObjectId(get_jwt_identity())
    user = db.users.find_one({"_id": user_id})
    profile = request.get_json()

    print(profile)

    required_fields = [
        "first_name",
        "last_name",
        "year",
        "school",
        "major",
        "preferred_roles",
        "skills",
        "interests",
        "bio",
        "preferred_contact"
    ]

    missing = [field for field in required_fields if field not in profile or profile[field] in [None, '', []]]
    if missing:
        return jsonify({"error": f"Missing or empty fields: {', '.join(missing)}"}), 400

    # Inject username for swiping logic
    if not user or 'username' not in user:
        return jsonify({"error": "Username not found for user"}), 400

    profile["username"] = user["username"]

    # Set the preferred form of contact based on method selected
    method = profile["preferred_contact"]
    if method.lower() == "phone":
        phone = user.get("profile", {}).get("phone_number")
        if not phone:
            return jsonify({"error": "Phone number not found in user profile"}), 400
        profile["preferred_contact"] = phone
    elif method.lower() == "email":
        profile["preferred_contact"] = user["username"]
    else:
        return jsonify({"error": "Invalid preferred_contact"}), 400

    db.users.update_one(
        {"_id": user_id},
        {"$set": {"team_matching.team_matching_profile": profile}}
    )

    return jsonify({"message": "Team matching profile created/updated"}), 200


@teammatch_api.route('/swiping_status', methods=['GET'])
def swiping_status():
    return jsonify({"is_live": True}), 200

def serialize_user(user):
    user["_id"] = str(user["_id"])
    team_data = user.get("team_matching", {})
    
    swipes = team_data.get("swipes", {"left": [], "right": []})
    matches = team_data.get("matches", [])

    swipes["left"] = [str(uid) for uid in swipes.get("left", [])]
    swipes["right"] = [str(uid) for uid in swipes.get("right", [])]
    matches = [str(uid) for uid in matches]

    return {
        "id": user["_id"],
        "username": user.get("username", ""),
        "team_matching_profile": team_data.get("team_matching_profile", {}),
        "swipes": swipes,
        "matches": matches
    }

@teammatch_api.route('/swipe', methods=['POST'])
@jwt_required
def swipe():
    user_id = ObjectId(get_jwt_identity())
    data = request.json
    target_id = ObjectId(data.get("target_id"))
    action = data.get("action")

    if not target_id or action not in {"right", "left"}:
        return jsonify({"error": "Invalid request"}), 400

    if db.users.find_one({"_id": target_id, "is_admin": True}):
        return jsonify({"error": "Cannot swipe on admin accounts"}), 403

    db.users.update_one(
        {"_id": user_id},
        {"$addToSet": {f"team_matching.swipes.{action}": target_id}}
    )

    if action == "right":
        target_user = db.users.find_one(
            {"_id": target_id, "team_matching.swipes.right": user_id, "is_admin": {"$ne": True}}
        )
        if target_user:
            db.users.update_one(
                {"_id": user_id},
                {"$addToSet": {"team_matching.matches": target_id}}
            )
            db.users.update_one(
                {"_id": target_id},
                {"$addToSet": {"team_matching.matches": user_id}}
            )
            return jsonify({"match": True}), 200

    return jsonify({"match": False}), 200

@teammatch_api.route('/matches', methods=['GET'])
@jwt_required
def get_matches():
    user_id = ObjectId(get_jwt_identity())

    # Get list of matched user IDs from the current user
    user = db.users.find_one({"_id": user_id}, {"team_matching.matches": 1})
    match_ids = user.get("team_matching", {}).get("matches", []) if user else []

    # Find matched users and return only their team_matching_profile
    matched_users = db.users.find({
        "_id": {"$in": match_ids},
        "is_admin": {"$ne": True},
        "team_matching.team_matching_profile": {"$exists": True}
    }, {
        "team_matching.team_matching_profile": 1
    })

    profiles = [
        u["team_matching"]["team_matching_profile"]
        for u in matched_users
        if "team_matching" in u and "team_matching_profile" in u["team_matching"]
    ]

    return jsonify(profiles), 200

@teammatch_api.route('/potential_matches', methods=['GET'])
@jwt_required
def get_potential_matches():
    current_user_id = ObjectId(get_jwt_identity())
    current_user = db.users.find_one({"_id": current_user_id})

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    swiped = current_user.get("team_matching", {}).get("swipes", {})
    swiped_ids = swiped.get("left", []) + swiped.get("right", []) + [current_user_id]

    users = list(db.users.find({
        "_id": {"$nin": swiped_ids},
        "is_admin": {"$ne": True}
    }))

    return jsonify([serialize_user(u) for u in users]), 200

@teammatch_api.route('/user/<user_id>', methods=['GET'])
@jwt_required
def get_user_by_id(user_id):
    try:
        user = db.users.find_one({
            "_id": ObjectId(user_id),
            "is_admin": {"$ne": True}
        })
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(serialize_user(user)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

ROLE_COMPATIBILITY = {
    "Designer": [
        "Frontend Developer", "Product Manager", "Full Stack Developer"
    ],
    "Frontend Developer": [
        "Backend Developer", "Full Stack Developer", "Designer", "Product Manager"
    ],
    "Backend Developer": [
        "Frontend Developer", "Full Stack Developer", "DevOps/Infrastructure", "Data Scientist"
    ],
    "Full Stack Developer": [
        "Designer", "Product Manager", "Data Scientist", "DevOps/Infrastructure", "Hardware Hacker"
    ],
    "Product Manager": [
        "Designer", "Frontend Developer", "Backend Developer", "Data Scientist"
    ],
    "Hardware Hacker": [
        "Full Stack Developer", "DevOps/Infrastructure"
    ],
    "DevOps/Infrastructure": [
        "Backend Developer", "Full Stack Developer", "Hardware Hacker"
    ],
    "Data Scientist": [
        "Backend Developer", "Full Stack Developer", "Product Manager"
    ],
    "Other": [
        "Frontend Developer", "Backend Developer", "Full Stack Developer"
    ]
}

def jaccard_score(set_a, set_b):
        a, b = set(map(str.lower, set_a)), set(map(str.lower, set_b))
        if not a or not b:
            return 0
        intersection = len(a & b)
        union = len(a | b)
        return intersection / union if union > 0 else 0

def complementary_role_score(roles_a, roles_b):
    def normalize(r):
        return r.strip().lower()
    
    roles_a = [normalize(r) for r in roles_a]
    roles_b = [normalize(r) for r in roles_b]
    compat_map = {k.lower(): [x.lower() for x in v] for k, v in ROLE_COMPATIBILITY.items()}
    
    matches = 0
    total = 0
    
    for role in roles_a:
        compatible = compat_map.get(role, [])
        for r in roles_b:
            if r in compatible:
                matches += 1
            total += 1
    
    return matches / total if total else 0

def class_year_score(class_a, class_b):
    try:
        diff = abs(int(class_a) - int(class_b))
        if diff == 0:
            return 1.0  # Perfect match
        elif diff == 1:
            return 0.75
        elif diff == 2:
            return 0.5
        elif diff == 3:
            return 0.25
        else:
            return 0  # Too far apart
    except:
        return 0  # Missing or invalid year

def total_match_score(user_a, user_b):
    role_score = complementary_role_score(user_a["preferred_roles"], user_b["preferred_roles"])
    skills_score = jaccard_score(user_a["skills"], user_b["skills"])
    interests_score = jaccard_score(user_a["interests"], user_b["interests"])
    class_score = class_year_score(user_a.get("graduation_year"), user_b.get("graduation_year"))

    return (
        0.35 * role_score +
        0.25 * skills_score +
        0.25 * interests_score +
        0.15 * class_score
    )

@teammatch_api.route('/match_scores', methods=['GET'])
@jwt_required
def get_match_scores():
    user_id = ObjectId(get_jwt_identity())
    current_user = db.users.find_one({"_id": user_id})
    current_profile = current_user.get("team_matching", {}).get("team_matching_profile")

    if not current_profile:
        return jsonify({"error": "Team matching profile not found"}), 400

    swiped = current_user.get("team_matching", {}).get("swipes", {})
    swiped_ids = swiped.get("left", []) + swiped.get("right", []) + [user_id]

    potential_users = db.users.find({
        "_id": {"$nin": swiped_ids},
        "is_admin": {"$ne": True},
        "team_matching.team_matching_profile": {"$exists": True}
    })

    match_scores = []
    for user in potential_users:
        profile = user["team_matching"]["team_matching_profile"]
        score = total_match_score(current_profile, profile)

        match_scores.append({
            "username": user.get("username"),
            "profile": profile,
            "score": round(score, 3)
        })

    match_scores.sort(key=lambda x: x["score"], reverse=True)
    top_matches = match_scores[:20]

    return jsonify(top_matches), 200

