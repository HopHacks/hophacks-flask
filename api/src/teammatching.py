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

    required_fields = [
        "first_name",
        "last_name",
        "year",
        "school",
        "major",
        "preferred_role",
        "skills",
        "interests",
        "bio"
    ]

    missing = [field for field in required_fields if field not in profile or profile[field] in [None, '', []]]
    if missing:
        return jsonify({"error": f"Missing or empty fields: {', '.join(missing)}"}), 400

    # Inject username into the profile from the user document, so it can be used in swipes field
    if not user or 'username' not in user:
        return jsonify({"error": "Username not found for user"}), 400

    profile["username"] = user["username"]

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
    team_data = user.get("teammatch", {})
    
    swipes = team_data.get("swipes", {"left": [], "right": []})
    matches = team_data.get("matches", [])

    swipes["left"] = [str(uid) for uid in swipes.get("left", [])]
    swipes["right"] = [str(uid) for uid in swipes.get("right", [])]
    matches = [str(uid) for uid in matches]

    return {
        "id": user["_id"],
        "username": user.get("username", ""),
        "team_matching_profile": user.get("team_matching_profile", {}),
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

    # Don't allow swiping on admins
    if db.users.find_one({"_id": target_id, "is_admin": True}):
        return jsonify({"error": "Cannot swipe on admin accounts"}), 403

    db.users.update_one(
        {"_id": user_id},
        {"$addToSet": {f"teammatch.swipes.{action}": target_id}}
    )

    if action == "right":
        target_user = db.users.find_one(
            {"_id": target_id, "teammatch.swipes.right": user_id, "is_admin": {"$ne": True}}
        )
        if target_user:
            db.users.update_one(
                {"_id": user_id},
                {"$addToSet": {"teammatch.matches": target_id}}
            )
            db.users.update_one(
                {"_id": target_id},
                {"$addToSet": {"teammatch.matches": user_id}}
            )
            return jsonify({"match": True}), 200

    return jsonify({"match": False}), 200

@teammatch_api.route('/matches', methods=['GET'])
@jwt_required
def get_matches():
    user_id = ObjectId(get_jwt_identity())
    user = db.users.find_one({"_id": user_id}, {"teammatch.matches": 1})
    match_ids = user.get("teammatch", {}).get("matches", []) if user else []

    # Filter out admin matches
    non_admins = db.users.find({
        "_id": { "$in": match_ids },
        "is_admin": { "$ne": True }
    })

    matches = [str(u["_id"]) for u in non_admins]
    return jsonify(matches), 200

@teammatch_api.route('/potential_matches', methods=['GET'])
@jwt_required
def get_potential_matches():
    current_user_id = ObjectId(get_jwt_identity())
    current_user = db.users.find_one({ "_id": current_user_id })

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    swiped = current_user.get("teammatch", {}).get("swipes", {})
    swiped_ids = swiped.get("left", []) + swiped.get("right", []) + [current_user_id]

    users = list(db.users.find({
        "_id": { "$nin": swiped_ids },
        "is_admin": { "$ne": True }
    }))
    return jsonify([serialize_user(u) for u in users]), 200

@teammatch_api.route('/generate_token', methods=['POST'])
def generate_token():
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    token = create_access_token(identity=str(user["_id"]), expires_delta=timedelta(days=1))

    return jsonify({
        "token": token,
        "username": user.get("username", "unknown")
    }), 200

@teammatch_api.route('/login', methods=['POST'])
def login_user():
    username = request.json.get("username")
    print(username)
    if not username:
        return jsonify({"error": "Username required"}), 400

    user = db.users.find_one({"username": username})
    if not user:
        return jsonify({"error": "User not found"}), 404

    token = create_access_token(identity=str(user["_id"]), expires_delta=timedelta(days=1))

    return jsonify({
        "access_token": token,
        "user_id": str(user["_id"]),
        "username": user.get("username", "unknown")
    }), 200

@teammatch_api.route('/user/<user_id>', methods=['GET'])
@jwt_required
def get_user_by_id(user_id):
    try:
        user = db.users.find_one({ "_id": ObjectId(user_id), "is_admin": { "$ne": True } })
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(serialize_user(user)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
