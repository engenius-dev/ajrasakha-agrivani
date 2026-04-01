"""
AgriVani — main.py  (Swetha)
FastAPI server. All endpoints Himanshu's Node.js backend needs.

Run:  uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from rag_service import get_eligibility_answer
from vector_service import search_schemes
from db_service import (
    upsert_farmer_profile,
    get_farmer_profile,
    save_query_history,
    get_farmer_history,
)

app = FastAPI(
    title="AgriVani AI Engine",
    description="RAG eligibility engine for Indian agricultural schemes.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────────────────────
#  Request / Response Models  — matches the team "Contract" JSON exactly
# ─────────────────────────────────────────────────────────────────────────────

class EligibilityRequest(BaseModel):
    farmerId:   str  = Field(..., description="Farmer's unique ID")
    transcript: str  = Field(..., min_length=3, description="Farmer's spoken/typed question")
    language:   str  = Field(default="English")


class FarmerProfile(BaseModel):
    farmer_id:       str
    name:            Optional[str]   = None
    state:           Optional[str]   = None
    land_size_acres: Optional[float] = None
    crop_type:       Optional[str]   = None
    annual_income:   Optional[float] = None
    irrigation:      Optional[str]   = None
    language:        Optional[str]   = "English"


# ─────────────────────────────────────────────────────────────────────────────
#  Routes
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {"status": "AgriVani AI Engine running", "version": "2.0.0"}


# ── MAIN ENDPOINT: Full eligibility answer from Harini's PDFs ─────────────────
@app.post("/check-eligibility")
async def check_eligibility(req: EligibilityRequest):
    """
    THE main endpoint. Himanshu calls this from Express.

    Request  (matches team contract):
        { "farmerId": "user_123", "transcript": "Am I eligible for PM-Kisan if I have 3 hectares?" }

    Response (matches team contract):
        {
            "eligible":    "No",
            "reasoning":   "PM-KISAN is for farmers with up to 2 hectares. Your 3 hectares exceeds the limit.",
            "source":      "PM-KISAN Operational Guidelines (2018), Section 2.3, Page 1",
            "schemeName":  "PM-KISAN",
            "language":    "English"
        }
    """
    try:
        # Load farmer profile from DB2 so Gemini has their land size, state, etc.
        profile = get_farmer_profile(req.farmerId)

        # Call RAG pipeline: vector search DB1 → Gemini prompt → structured answer
        answer = get_eligibility_answer(
            farmer_query   = req.transcript,
            farmer_profile = profile,
        )

        # Save result to DB3 (history / Proof Card)
        save_query_history(
            farmer_id   = req.farmerId,
            transcript  = req.transcript,
            context     = answer.get("context_used", []),
            eligible    = answer["eligible"],
            reasoning   = answer["reasoning"],
            source      = answer["source"],
            scheme_name = answer["scheme_name"],
            language    = req.language,
        )

        # Return in the exact team contract format
        return {
            "eligible":   answer["eligible"],
            "reasoning":  answer["reasoning"],
            "source":     answer["source"],
            "schemeName": answer["scheme_name"],
            "language":   req.language,
            "extracted_proof": answer.get("extracted_proof", "Context evaluated securely from government documents."), # <-- ADDED THIS
            "context_used": answer.get("context_used", [])
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Context-only endpoint (optional — Himanshu can use this if he wants to
#    build the Gemini prompt himself on the Node side) ──────────────────────────
@app.post("/search")
async def search_context(body: dict):
    """
    Returns raw PDF chunks for a query. Himanshu uses this if he wants
    to call Gemini himself instead of using /check-eligibility.
    """
    text  = body.get("text", "")
    top_k = body.get("top_k", 3)
    if not text:
        raise HTTPException(status_code=400, detail="text field required")
    results = search_schemes(text, top_k=top_k)
    return {"query": text, "context": results, "context_found": len(results) > 0}


# ── DB2: Farmer Profiles ──────────────────────────────────────────────────────
@app.post("/farmer/profile")
async def save_profile(profile: FarmerProfile):
    """Save or update farmer profile."""
    try:
        data  = profile.model_dump(exclude={"farmer_id"}, exclude_none=True)
        saved = upsert_farmer_profile(profile.farmer_id, data)
        return {"success": True, "profile": saved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/farmer/profile/{farmer_id}")
async def fetch_profile(farmer_id: str):
    """Get a farmer's profile."""
    profile = get_farmer_profile(farmer_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return profile


# ── DB3: History / Proof Card ─────────────────────────────────────────────────
@app.get("/history/{farmer_id}")
async def fetch_history(farmer_id: str, limit: int = 10):
    """Get farmer's past eligibility checks for the Proof Card screen."""
    history = get_farmer_history(farmer_id, limit=limit)
    return {"farmer_id": farmer_id, "history": history, "count": len(history)}
