"""
AgriVani — rag_service.py  (Swetha)

THIS is the file that produces the actual answer from Harini's PDF content.

Flow:
  1. Takes farmer's question
  2. Calls vector_service → gets 3 relevant chunks from Harini's PDF data in DB1
  3. Builds a strict prompt: "Answer ONLY using the text below"
  4. Calls Gemini → gets structured JSON answer
  5. Returns: { eligible, reasoning, source, scheme_name }

The key rule: Gemini is NOT allowed to use its own knowledge.
It can ONLY use the PDF chunks Harini wrote. This is what "expert-validated" means.
"""

import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv
from vector_service import search_schemes

load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_KEY)

# Use gemini-1.5-flash — free tier, fast, good for structured output
model = genai.GenerativeModel("gemini-1.5-flash")


def get_eligibility_answer(farmer_query: str, farmer_profile: dict | None = None) -> dict:
    """
    Main function. Takes farmer's question + optional profile → returns eligibility answer.

    Args:
        farmer_query:   e.g. "Am I eligible for PM-KISAN with 3 hectares in Punjab?"
        farmer_profile: optional dict with farmer details from DB2
                        e.g. { "land_size_acres": 5, "state": "Punjab", "crop_type": "wheat" }

    Returns:
        {
            "eligible":    "Yes" | "No" | "Partially" | "Cannot determine",
            "reasoning":   "Clear explanation citing the rule from the PDF",
            "source":      "PM-KISAN Operational Guidelines, Section 3.1",
            "scheme_name": "PM-KISAN",
            "context_used": [ { "text": "...", "score": 0.92 }, ... ]
        }
    """

    # ── Step 1: Search Harini's PDF data in DB1 ───────────────────────────────
    context_chunks = search_schemes(farmer_query, top_k=3)

    if not context_chunks:
        return {
            "eligible":    "Cannot determine",
            "reasoning":   "No relevant scheme data found. Please ensure scheme files have been ingested.",
            "source":      "N/A",
            "scheme_name": "Unknown",
            "context_used": [],
        }

    # ── Step 2: Build context block from Harini's chunks ─────────────────────
    context_block = ""
    for i, chunk in enumerate(context_chunks, 1):
        context_block += f"\n--- Source {i}: {chunk.get('scheme_name', 'Unknown')} ---\n"
        context_block += f"File: {chunk.get('source', 'unknown')}\n"
        context_block += f"{chunk['text']}\n"

    # ── Step 3: Build the farmer profile block (if available) ─────────────────
    profile_block = ""
    if farmer_profile:
        profile_block = "\n\nFarmer's known details:\n"
        for key, val in farmer_profile.items():
            if key not in ("farmer_id", "created_at", "updated_at", "_id"):
                profile_block += f"  - {key.replace('_', ' ').title()}: {val}\n"

    # ── Step 4: Strict RAG prompt — Gemini must only use Harini's text ─────────
    prompt = f"""You are AgriVani, an agricultural scheme eligibility assistant for Indian farmers.

CRITICAL RULE: You must answer ONLY using the scheme information provided in the CONTEXT SOURCES below.
Do NOT use any outside knowledge. If the context does not contain enough information to answer, say "Cannot determine".

CONTEXT SOURCES (extracted from official government PDF documents):
{context_block}
{profile_block}

FARMER'S QUESTION: {farmer_query}

Based ONLY on the context sources above, determine the farmer's eligibility.

Respond with a JSON object in this EXACT format (no markdown, no backticks, just raw JSON):
{{
  "eligible": "Yes" or "No" or "Partially" or "Cannot determine",
  "reasoning": "A clear 2-3 sentence explanation that directly references the rule from the source documents. Mention the specific criterion that makes them eligible or ineligible.",
  "source": "The exact document name and section number from the context, e.g. PM-KISAN Operational Guidelines, Section 3.1",
  "scheme_name": "The full scheme name, e.g. PM-KISAN"
}}"""

    # ── Step 5: Call Gemini ───────────────────────────────────────────────────
    try:
        response     = model.generate_content(prompt)
        raw_text     = response.text.strip()

        # Strip markdown fences if Gemini wraps in ```json ... ```
        raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
        raw_text = re.sub(r"\s*```$", "", raw_text)

        answer = json.loads(raw_text)

        # Validate required keys
        for key in ("eligible", "reasoning", "source", "scheme_name"):
            if key not in answer:
                answer[key] = "Not provided"

        answer["context_used"] = [
            {"text": c["text"][:300], "scheme_name": c.get("scheme_name", ""), "score": c.get("score", 0)}
            for c in context_chunks
        ]
        return answer

    except json.JSONDecodeError:
        # If Gemini doesn't return valid JSON, wrap the raw text
        return {
            "eligible":    "Cannot determine",
            "reasoning":   raw_text,
            "source":      context_chunks[0].get("source", "N/A") if context_chunks else "N/A",
            "scheme_name": context_chunks[0].get("scheme_name", "Unknown") if context_chunks else "Unknown",
            "context_used": context_chunks,
        }
    except Exception as e:
        return {
            "eligible":    "Cannot determine",
            "reasoning":   f"AI service error: {str(e)}",
            "source":      "N/A",
            "scheme_name": "Unknown",
            "context_used": [],
        }


# ── Quick local test ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== Test 1: No profile ===")
    result = get_eligibility_answer(
        "Am I eligible for PM-KISAN if I have 3 hectares of land in Punjab?"
    )
    print(f"Eligible:    {result['eligible']}")
    print(f"Reasoning:   {result['reasoning']}")
    print(f"Source:      {result['source']}")
    print(f"Scheme:      {result['scheme_name']}")

    print("\n=== Test 2: With farmer profile ===")
    profile = {
        "name": "Ravi Kumar",
        "state": "Punjab",
        "land_size_acres": 2.0,
        "annual_income": 90000,
        "crop_type": "wheat",
    }
    result2 = get_eligibility_answer(
        "Am I eligible for PM-KISAN?",
        farmer_profile=profile
    )
    print(f"Eligible:    {result2['eligible']}")
    print(f"Reasoning:   {result2['reasoning']}")
    print(f"Source:      {result2['source']}")
