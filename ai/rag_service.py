"""
AgriVani — rag_service.py  (Swetha)
Takes farmer's question → searches Harini's PDF chunks(Right now it's markdown file chunks) → calls Gemini → returns structured answer.
Uses local embeddings (all-MiniLM-L6-v2) for search, Gemini only for final answer generation.
"""
 
import os
import json
import re
from dotenv import load_dotenv
from google import genai
from vector_service import search_schemes
 
load_dotenv()
 
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_KEY)
 
 
def get_eligibility_answer(farmer_query: str, farmer_profile: dict | None = None) -> dict:
    """
    Full RAG pipeline:
    1. Search Harini's scheme chunks from DB1
    2. Build a strict prompt using ONLY those chunks
    3. Call Gemini for the final answer
    4. Return structured result matching team contract
 
    Returns:
        {
            "eligible":     "Yes" | "No" | "Partially" | "Cannot determine",
            "reasoning":    "Explanation citing the rule from the PDF",
            "source":       "PM-KISAN Operational Guidelines (2018), Section 2.3, Page 1",
            "scheme_name":  "PM-KISAN",
            "context_used": [ ... ]
        }
    """
 
    # Step 1 — Search Harini's data in DB1(Increased to top_k=6 to ensure we get all rules)
    context_chunks = search_schemes(farmer_query, top_k=6)
 
    if not context_chunks:
        return {
            "eligible":     "Cannot determine",
            "reasoning":    "No relevant scheme data found. Please ensure scheme files have been ingested.",
            "source":       "N/A",
            "scheme_name":  "Unknown",
            "context_used": [],
        }
 
    # Step 2 — Build context block from retrieved chunks
    context_block = ""
    for i, chunk in enumerate(context_chunks, 1):
        context_block += f"\n--- Source {i}: {chunk.get('scheme_name', 'Unknown')} ---\n"
        context_block += f"File: {chunk.get('source', 'unknown')}\n"
        context_block += f"{chunk['text']}\n"
 
    # Step 3 — Add farmer profile if available
    profile_block = ""
    if farmer_profile:
        profile_block = "\n\nFarmer's known details:\n"
        for key, val in farmer_profile.items():
            if key not in ("farmer_id", "created_at", "updated_at", "_id"):
                profile_block += f"  - {key.replace('_', ' ').title()}: {val}\n"
 
    # Step 4 — Strict RAG prompt (Gemini cannot use outside knowledge)
    prompt = f"""You are AgriVani, an agricultural scheme eligibility assistant for Indian farmers.
 
CRITICAL RULES:
1. Answer ONLY using the CONTEXT SOURCES below.
2. If the user provides land size or crop, focus ONLY on evaluating those specific metrics against the rules.
3. ASSUME the farmer meets all other unmentioned basic criteria (like citizenship or family definition) unless they explicitly violate them.
 
CONTEXT SOURCES:
{context_block}
{profile_block}
 
FARMER'S QUESTION: {farmer_query}
 
Respond with a JSON object in this EXACT format (raw JSON only, no markdown, no backticks):
{{
  "eligible": "Yes" or "No",
  "reasoning": "2-3 sentence explanation directly referencing the land/crop rules from the source.",
  "source": "Document name if found, otherwise 'Official Guidelines'",
  "scheme_name": "Full scheme name",
  "extracted_proof": "Quote exactly 1-2 clean sentences from the context that proves your reasoning. Strip out all markdown symbols like # or *."
}}"""
 
    # Step 5 — Call Gemini for final answer
    try:
        response = client.models.generate_content(
            model="gemini-flash-lite-latest",
            contents=prompt,
        )
        raw_text = response.text.strip()
 
        # Strip markdown fences if Gemini wraps response
        raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
        raw_text = re.sub(r"\s*```$", "", raw_text)
 
        answer = json.loads(raw_text)
 
        for key in ("eligible", "reasoning", "source", "scheme_name"):
            if key not in answer:
                answer[key] = "Not provided"
 
        answer["context_used"] = [
            {
                "text":        c["text"][:300],
                "scheme_name": c.get("scheme_name", ""),
                "score":       c.get("score", 0),
            }
            for c in context_chunks
        ]
        return answer
 
    except json.JSONDecodeError:
        return {
            "eligible":     "Cannot determine",
            "reasoning":    raw_text,
            "source":       context_chunks[0].get("source", "N/A") if context_chunks else "N/A",
            "scheme_name":  context_chunks[0].get("scheme_name", "Unknown") if context_chunks else "Unknown",
            "context_used": context_chunks,
        }
    except Exception as e:
        return {
            "eligible":     "Cannot determine",
            "reasoning":    f"AI service error: {str(e)}",
            "source":       "N/A",
            "scheme_name":  "Unknown",
            "context_used": [],
        }
 
 
# Quick local test
if __name__ == "__main__":
    print("=== Test 1: PM-KISAN with 1 hectare ===\n")
    result = get_eligibility_answer(
        "Am I eligible for PM-KISAN if I have 1 hectare of land in Punjab?"
    )
    print(f"Eligible:  {result['eligible']}")
    print(f"Reasoning: {result['reasoning']}")
    print(f"Source:    {result['source']}")
    print(f"Scheme:    {result['scheme_name']}")
 
    print("\n=== Test 2: PM-KISAN with 3 hectares ===\n")
    result2 = get_eligibility_answer(
        "Am I eligible for PM-KISAN if I have 3 hectares of land?"
    )
    print(f"Eligible:  {result2['eligible']}")
    print(f"Reasoning: {result2['reasoning']}")
    print(f"Source:    {result2['source']}")
    print(f"Scheme:    {result2['scheme_name']}")
 
    print("\n=== Test 3: PM-KUSUM solar pump ===\n")
    result3 = get_eligibility_answer(
        "Can I get a subsidy for a solar pump under PM-KUSUM?"
    )
    print(f"Eligible:  {result3['eligible']}")
    print(f"Reasoning: {result3['reasoning']}")
    print(f"Source:    {result3['source']}")
    print(f"Scheme:    {result3['scheme_name']}")
 