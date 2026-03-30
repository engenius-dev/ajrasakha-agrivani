"""
AgriVani — vector_service.py  (Swetha)
Semantic search against DB1. Called by rag_service.py.
"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
GEMINI_KEY  = os.getenv("GEMINI_API_KEY")

_collection       = None
_embeddings_model = None


def _get_collection():
    global _collection
    if _collection is None:
        _collection = MongoClient(MONGODB_URI)["agrivani"]["schemes"]
    return _collection


def _get_embeddings():
    global _embeddings_model
    if _embeddings_model is None:
        _embeddings_model = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=GEMINI_KEY,
        )
    return _embeddings_model


def search_schemes(user_query: str, top_k: int = 3) -> list[dict]:
    """
    Converts farmer's question to a vector → finds top_k matching chunks
    from Harini's scheme data stored in DB1.

    Returns list of: { text, source, scheme_name, score }
    """
    query_vector = _get_embeddings().embed_query(user_query)

    pipeline = [
        {
            "$vectorSearch": {
                "index":         "default",   # must match the index name in Atlas UI
                "path":          "embedding",
                "queryVector":   query_vector,
                "numCandidates": 100,
                "limit":         top_k,
            }
        },
        {
            "$project": {
                "_id":         0,
                "text":        1,
                "source":      1,
                "scheme_name": 1,
                "page":        1,
                "score":       {"$meta": "vectorSearchScore"},
            }
        },
    ]

    return list(_get_collection().aggregate(pipeline))


if __name__ == "__main__":
    q = "Am I eligible for PM-KISAN if I have 1 hectare of land?"
    print(f"Query: {q}\n")
    results = search_schemes(q)
    if not results:
        print("No results. Run ingest.py first.")
    for i, r in enumerate(results, 1):
        print(f"[{i}] {r.get('scheme_name')}  score={r['score']:.4f}")
        print(f"    {r['text'][:300]}\n")
