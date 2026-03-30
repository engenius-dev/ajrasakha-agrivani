"""
AgriVani — ingest.py  (Swetha)
Uses local sentence-transformers for embeddings — no API key needed, free, fast.
Model: all-MiniLM-L6-v2 → 384 dimensions
 
Run once:  python ingest.py
"""
 
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
 
load_dotenv()
 
MONGODB_URI = os.getenv("MONGODB_URI")
 
client     = MongoClient(MONGODB_URI)
collection = client["agrivani"]["schemes"]   # DB1
 
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "schemes")
print(f"\nLoading scheme files from: {DATA_PATH}\n")
 
loader = DirectoryLoader(
    DATA_PATH,
    glob="**/*.md",
    loader_cls=TextLoader,
    loader_kwargs={"encoding": "utf-8"},
    show_progress=True,
)
documents = loader.load()
print(f"Loaded {len(documents)} file(s).")
 
if not documents:
    print("ERROR: No .md files found in /data/schemes/")
    exit(1)
 
splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=120,
    separators=["\n## ", "\n### ", "\n* ", "\n- ", "\n", " ", ""],
)
chunks = splitter.split_documents(documents)
print(f"Split into {len(chunks)} chunk(s).\n")
 
# Load free local embedding model (downloads once, ~90MB)
print("Loading local embedding model (all-MiniLM-L6-v2)...")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
print("Model loaded.\n")
 
print("Clearing old scheme embeddings from DB1...")
collection.delete_many({})
 
print("Embedding and uploading chunks...\n")
batch = []
for i, chunk in enumerate(chunks):
    vector      = embedding_model.encode(chunk.page_content).tolist()
    source_file = os.path.basename(chunk.metadata.get("source", "unknown"))
    scheme_name = os.path.splitext(source_file)[0].upper().replace("-", " ")
 
    batch.append({
        "text":        chunk.page_content,
        "source":      chunk.metadata.get("source", "unknown"),
        "scheme_name": scheme_name,
        "embedding":   vector,
    })
    print(f"  {i + 1}/{len(chunks)} chunks embedded...")
 
collection.insert_many(batch)
print(f"\nDone! {len(batch)} chunks uploaded to agrivani.schemes (DB1).")
print("Harini's scheme data is now searchable.")
 