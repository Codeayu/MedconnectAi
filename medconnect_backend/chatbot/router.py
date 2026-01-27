import re
from typing import Dict
from chatbot.knowledge.openfda_service import fetch_drug_information
from chatbot.knowledge.rxnorm_service import normalize_drug_name
from chatbot.knowledge.pinecone_retriever import retrieve_context

# ------------------------- CONFIG -------------------------
EMERGENCY_KEYWORDS = [
    "chest pain", "shortness of breath", "difficulty breathing",
    "unconscious", "seizure", "stroke", "heart attack",
    "heavy bleeding", "severe burn", "collapse", "can't breathe",
    "choking", "poisoning", "overdose"
]

DRUG_INTENT_KEYWORDS = [
    "medicine", "tablet", "capsule", "drug",
    "side effect", "interaction", "prescription",
    "antibiotic", "painkiller", "medication", "dose"
]

# Common health topics for general queries
HEALTH_TOPICS = [
    "fever", "cold", "flu", "cough", "headache", "pain",
    "stomach", "nausea", "vomiting", "diarrhea", "constipation",
    "tired", "fatigue", "sleep", "stress", "anxiety", "depression",
    "skin", "rash", "allergy", "diabetes", "blood pressure",
    "weight", "diet", "exercise", "vitamin", "nutrition"
]

# ------------------------- HELPERS -------------------------
def normalize_text(text: str) -> str:
    return text.lower().strip()

def contains_keywords(text: str, keywords: list) -> bool:
    return any(keyword in text for keyword in keywords)

def extract_candidate_tokens(text: str) -> list:
    """
    Extracts possible drug mentions conservatively
    """
    tokens = re.findall(r"[a-zA-Z]{4,}", text.lower())
    return list(set(tokens))

# ------------------------- MAIN ROUTER -------------------------
def route_request(user_text: str) -> Dict:
    """
    Determines routing strategy and returns structured context
    """
    text = normalize_text(user_text)
    print(f"🔀 Routing query: {text[:100]}...")

    # 1️⃣ EMERGENCY - Highest priority
    if contains_keywords(text, EMERGENCY_KEYWORDS):
        print("🚨 Route: EMERGENCY")
        return {
            "route": "EMERGENCY",
            "message": (
                "⚠️ This may indicate a medical emergency. "
                "Please seek immediate medical care or contact emergency services (call 112 or your local emergency number)."
            ),
            "confidence": "high"
        }

    # 2️⃣ DRUG INFORMATION
    if contains_keywords(text, DRUG_INTENT_KEYWORDS):
        print("💊 Checking for drug information...")
        candidates = extract_candidate_tokens(text)
        drug_context = []

        for token in candidates:
            try:
                normalized_drug = normalize_drug_name(token)
                if not normalized_drug:
                    continue
                info = fetch_drug_information(normalized_drug)
                if info:
                    drug_context.append(info)
            except Exception as e:
                print(f"⚠️ Drug lookup error for {token}: {e}")
                continue

        if drug_context:
            print(f"💊 Route: DRUG_INFO with {len(drug_context)} results")
            return {
                "route": "DRUG_INFO",
                "context": drug_context,
                "confidence": "high"
            }

    # 3️⃣ RAG - Medical Knowledge Retrieval
    print("📚 Attempting RAG retrieval...")
    try:
        rag_text = retrieve_context(user_text)
        
        if rag_text and len(rag_text.strip()) > 50:
            print(f"📚 Route: RAG with context ({len(rag_text)} chars)")
            return {
                "route": "RAG",
                "context": rag_text,
                "confidence": "high"
            }
    except Exception as e:
        print(f"⚠️ RAG retrieval error: {e}")

    # 4️⃣ GENERAL - No specific context, let LLM use its knowledge
    print("🤖 Route: RAG (general - using LLM knowledge)")
    
    # Check if it's a health-related query
    is_health_query = contains_keywords(text, HEALTH_TOPICS)
    
    return {
        "route": "RAG",
        "context": "",  # Empty context - LLM will use its own knowledge
        "confidence": "medium" if is_health_query else "low",
        "note": "No specific context found, using general medical knowledge"
    }
