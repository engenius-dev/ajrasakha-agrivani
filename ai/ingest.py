"""
AgriVani — ingest.py  (Swetha — run once, or re-run when Harini adds new files)

Reads Harini's files from /data/schemes/ — supports both .md and .pdf
Chunks → embeds with Gemini → uploads to MongoDB Atlas DB1 (schemes collection).

Usage:
    python ingest.py
"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
GEMINI_KEY  = os.getenv("GEMINI_API_KEY")

client     = MongoClient(MONGODB_URI)
collection = client["agrivani"]["schemes"]   # DB1

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "schemes")
print(f"\nLoading scheme files from: {DATA_PATH}\n")

documents = []

# Load .md files (Harini's cleaned markdown files — preferred)
md_loader = DirectoryLoader(
    DATA_PATH,
    glob="**/*.md",
    loader_cls=TextLoader,
    loader_kwargs={"encoding": "utf-8"},
    show_progress=True,
)
md_docs = md_loader.load()
print(f"Loaded {len(md_docs)} Markdown file(s).")
documents.extend(md_docs)

# Load .pdf files (raw PDFs from Harini — fallback if .md not ready)
pdf_files = [f for f in os.listdir(DATA_PATH) if f.endswith(".pdf")]
for pdf_file in pdf_files:
    pdf_path = os.path.join(DATA_PATH, pdf_file)
    print(f"Loading PDF: {pdf_file}")
    pdf_loader = PyPDFLoader(pdf_path)
    pdf_docs   = pdf_loader.load()
    documents.extend(pdf_docs)
    print(f"  → {len(pdf_docs)} page(s) loaded from {pdf_file}")

if not documents:
    print("\nERROR: No .md or .pdf files found.")
    print(f"Ask Harini to put PM-KISAN.md (or PM-KISAN.pdf) in: {DATA_PATH}")
    exit(1)

print(f"\nTotal documents loaded: {len(documents)}")

# ── Chunk ─────────────────────────────────────────────────────────────────────
# Markdown headers as chunk boundaries so eligibility sections stay intact
splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=120,
    separators=["\n## ", "\n### ", "\n#### ", "\n* ", "\n- ", "\n", " ", ""],
)
chunks = splitter.split_documents(documents)
print(f"Split into {len(chunks)} chunk(s).\n")

# ── Embed (768 dimensions — matches Atlas vector index) ───────────────────────
embeddings_model = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=GEMINI_KEY,
)

# ── Wipe old data and re-upload ───────────────────────────────────────────────
print("Clearing old scheme embeddings from DB1...")
collection.delete_many({})

print("Embedding and uploading chunks...\n")
batch = []
for i, chunk in enumerate(chunks):
    vector      = embeddings_model.embed_query(chunk.page_content)
    source_file = os.path.basename(chunk.metadata.get("source", "unknown"))
    scheme_name = os.path.splitext(source_file)[0].upper().replace("-", " ")

    batch.append({
        "text":        chunk.page_content,
        "source":      chunk.metadata.get("source", "unknown"),
        "scheme_name": scheme_name,
        "page":        chunk.metadata.get("page", None),   # populated for PDFs
        "embedding":   vector,
    })

    if (i + 1) % 5 == 0 or (i + 1) == len(chunks):
        print(f"  {i + 1}/{len(chunks)} chunks embedded...")

collection.insert_many(batch)
print(f"\nDone! {len(batch)} chunks uploaded to agrivani.schemes (DB1).")
print("Harini's PDF/MD content is now searchable via vector search.")
