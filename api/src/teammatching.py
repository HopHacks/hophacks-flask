from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db

teammatch_api = Blueprint('teammatch_api', __name__)

@teammatch_api.route('/swipe', methods=['POST'])
@jwt_required
def swipe():
    user_id = get_jwt_identity()
    data = request.json
    target_id = data.get("target_id")
    action = data.get("action")  # "right" for like, "left" for pass

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
    user_id = get_jwt_identity()
    user = db.teammatch.find_one({"_id": user_id}, {"matches": 1})
    return jsonify(user.get("matches", [])), 200

@teammatch_api.route("/potential_matches", methods=["GET"])
def get_potential_matches():
    users = list(db.teammatch.find({}, {"_id": 0}))
    return jsonify(users), 200

