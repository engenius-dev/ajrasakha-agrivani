"""
AgriVani — db_service.py  (Swetha)
DB2 (farmer profiles) and DB3 (query history / Proof Card).
Does NOT produce answers — that is rag_service.py's job.
"""

import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

_db = None


def _get_db():
    global _db
    if _db is None:
        _db = MongoClient(MONGODB_URI)["agrivani"]
    return _db


# ── DB2: Farmer Profiles ──────────────────────────────────────────────────────

def upsert_farmer_profile(farmer_id: str, profile_data: dict) -> dict:
    """Save or update farmer profile in DB2."""
    db = _get_db()
    profile_data["farmer_id"]  = farmer_id
    profile_data["updated_at"] = datetime.now(timezone.utc)
    db["users"].update_one(
        {"farmer_id": farmer_id},
        {
            "$set":         profile_data,
            "$setOnInsert": {"created_at": datetime.now(timezone.utc)},
        },
        upsert=True,
    )
    return get_farmer_profile(farmer_id)


def get_farmer_profile(farmer_id: str) -> dict | None:
    return _get_db()["users"].find_one({"farmer_id": farmer_id}, {"_id": 0})


# ── DB3: Query History (Proof Card) ──────────────────────────────────────────

def save_query_history(
    farmer_id:   str,
    transcript:  str,
    context:     list[dict],
    eligible:    str,
    reasoning:   str,
    source:      str,
    scheme_name: str,
    language:    str = "English",
) -> str:
    """Save a completed eligibility result to DB3. Returns inserted document ID."""
    result = _get_db()["history"].insert_one({
        "farmer_id":    farmer_id,
        "transcript":   transcript,
        "context_used": context,
        "eligible":     eligible,
        "reasoning":    reasoning,
        "source":       source,
        "scheme_name":  scheme_name,
        "language":     language,
        "timestamp":    datetime.now(timezone.utc),
    })
    return str(result.inserted_id)


def get_farmer_history(farmer_id: str, limit: int = 10) -> list[dict]:
    """Last N eligibility checks for a farmer. Used for Proof Card screen."""
    cursor = (
        _get_db()["history"]
        .find({"farmer_id": farmer_id}, {"_id": 0})
        .sort("timestamp", -1)
        .limit(limit)
    )
    return list(cursor)
