import os
import logging
from pinecone import Pinecone
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# -------------------------
# CONFIG
# -------------------------
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

TOP_K = 5
MIN_SCORE = 0.65
NAMESPACE = "medical"

logger = logging.getLogger(__name__)

# -------------------------
# INIT (Lazy loading)
# -------------------------

_pc = None
_index = None
_embedding_model = None


def get_pinecone_index():
    global _pc, _index
    if _index is None:
        _pc = Pinecone(api_key=PINECONE_API_KEY)
        _index = _pc.Index(PINECONE_INDEX_NAME)
    return _index


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer("BAAI/bge-base-en-v1.5")
    return _embedding_model


# -------------------------
# EMBEDDING
# -------------------------

def embed_text(text: str):
    if not text.strip():
        return None

    model = get_embedding_model()
    return model.encode(
        text,
        normalize_embeddings=True
    ).tolist()


# -------------------------
# RETRIEVAL
# -------------------------

def retrieve_context(query: str):
    try:
        query_embedding = embed_text(query)
        if not query_embedding:
            return None

        index = get_pinecone_index()
        result = index.query(
            vector=query_embedding,
            top_k=TOP_K,
            include_metadata=True,
            namespace=NAMESPACE
        )

        contexts = []
        seen_texts = set()

        for match in result.matches:
            if match.score < MIN_SCORE:
                continue

            meta = match.metadata or {}
            text = meta.get("text", "").strip()
            source = meta.get("source", "medical")

            if not text or text in seen_texts:
                continue

            seen_texts.add(text)

            contexts.append(
                f"[Source: {source} | Score: {match.score:.2f}]\n{text}"
            )

        return "\n\n".join(contexts) if contexts else None

    except Exception as e:
        logger.error(f"Pinecone retrieval error: {e}")
        return None
