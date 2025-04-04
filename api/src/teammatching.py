from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from db import db
from datetime import timedelta
from bson import ObjectId

teammatch_api = Blueprint('teammatch_api', __name__)

def serialize_user(user):
    user["_id"] = str(user["_id"])
    user["swipes"] = user.get("swipes", {"left": [], "right": []})
    user["matches"] = user.get("matches", [])

    user["swipes"]["left"] = [str(uid) for uid in user["swipes"].get("left", [])]
    user["swipes"]["right"] = [str(uid) for uid in user["swipes"].get("right", [])]
    user["matches"] = [str(uid) for uid in user.get("matches", [])]

    return user

@teammatch_api.route('/swipe', methods=['POST'])
@jwt_required
def swipe():
    user_id = ObjectId(get_jwt_identity())
    data = request.json
    target_id = ObjectId(data.get("target_id"))
    action = data.get("action")

    if not target_id or action not in {"right", "left"}:
        return jsonify({"error": "Invalid request"}), 400

    db.teammatch.update_one({"_id": user_id}, {"$addToSet": {"swipes.{}".format(action): target_id}})

    if action == "right":
        target_user = db.teammatch.find_one({"_id": target_id, "swipes.right": user_id})
        if target_user:
            db.teammatch.update_one({"_id": user_id}, {"$addToSet": {"matches": target_id}})
            db.teammatch.update_one({"_id": target_id}, {"$addToSet": {"matches": user_id}})
            return jsonify({"match": True}), 200

    return jsonify({"match": False}), 200

@teammatch_api.route('/matches', methods=['GET'])
@jwt_required
def get_matches():
    user_id = ObjectId(get_jwt_identity())
    user = db.teammatch.find_one({"_id": user_id}, {"matches": 1})
    matches = [str(uid) for uid in user.get("matches", [])] if user else []
    return jsonify(matches), 200

@teammatch_api.route('/potential_matches', methods=['GET'])
@jwt_required
def get_potential_matches():
    current_user_id = ObjectId(get_jwt_identity())

    users = list(db.teammatch.find({ "_id": { "$ne": current_user_id } }))
    return jsonify([serialize_user(u) for u in users]), 200


@teammatch_api.route('/generate_token', methods=['POST'])
def generate_token():
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    user = db.teammatch.find_one({"_id": ObjectId(user_id)})
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
    if not username:
        return jsonify({"error": "Username required"}), 400

    user = db.teammatch.find_one({"username": username})
    if not user:
        return jsonify({"error": "User not found"}), 404

    token = create_access_token(identity=str(user["_id"]), expires_delta=timedelta(days=1))

    return jsonify({
        "access_token": token,
        "user_id": str(user["_id"]),
        "username": user.get("username", "unknown")
    }), 200
