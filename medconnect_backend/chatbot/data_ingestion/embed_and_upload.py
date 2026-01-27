import os
import uuid
from dotenv import load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

from chatbot.data_ingestion.utils.pdf_loader import load_pdf_text
from chatbot.data_ingestion.utils.text_chunker import chunk_text

# -------------------------
# INIT
# -------------------------

load_dotenv()

RAW_PDF_DIR = os.path.join(os.path.dirname(__file__), "raw_pdfs")
NAMESPACE = "medical"
CHUNK_SIZE = 200
MAX_METADATA_TEXT = 500
BATCH_SIZE = 50

# Embedding model (LOCAL, FREE)
embedding_model = SentenceTransformer(
    "BAAI/bge-base-en-v1.5"
)

# Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

# -------------------------
# EMBEDDING
# -------------------------

def embed_text(text: str) -> list:
    """
    Convert text to normalized embedding
    """
    embedding = embedding_model.encode(
        text,
        normalize_embeddings=True
    )
    return embedding.tolist()

# -------------------------
# HELPERS
# -------------------------

def batch(iterable, size):
    for i in range(0, len(iterable), size):
        yield iterable[i:i + size]

# -------------------------
# INGESTION PIPELINE
# -------------------------

def ingest_pdfs(pdf_dir=None):
    """
    Ingests PDFs from the specified directory into Pinecone.
    """
    if pdf_dir is None:
        pdf_dir = RAW_PDF_DIR
    
    # Ensure directory exists
    if not os.path.exists(pdf_dir):
        os.makedirs(pdf_dir)
        print(f"Created directory: {pdf_dir}")
        print("Please add PDF files to this directory and run again.")
        return

    for file_name in os.listdir(pdf_dir):

        if not file_name.lower().endswith(".pdf"):
            continue

        pdf_path = os.path.join(pdf_dir, file_name)
        print(f"📄 Processing: {file_name}")

        text = load_pdf_text(pdf_path)

        if not text.strip():
            print(f"⚠️ No text extracted from {file_name}")
            continue

        chunks = chunk_text(text, chunk_size=CHUNK_SIZE)
        vectors = []

        for i, chunk in enumerate(chunks):
            embedding = embed_text(chunk)

            vectors.append({
                "id": f"{file_name}_{i}",
                "values": embedding,
                "metadata": {
                    "text": chunk[:MAX_METADATA_TEXT],  # SAFE
                    "source": file_name.replace(".pdf", ""),
                    "document": file_name,
                    "chunk_id": i,
                    "category": "medical_guideline"
                }
            })

        # Batch upsert (IMPORTANT)
        for b in batch(vectors, BATCH_SIZE):
            index.upsert(b, namespace=NAMESPACE)

        print(f"✅ Uploaded {len(vectors)} chunks from {file_name}")

# -------------------------
# ENTRY POINT
# -------------------------

if __name__ == "__main__":
    ingest_pdfs()
