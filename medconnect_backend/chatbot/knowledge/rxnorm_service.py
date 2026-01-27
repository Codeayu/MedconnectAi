import requests
import logging
from functools import lru_cache

RXNORM_BASE_URL = "https://rxnav.nlm.nih.gov/REST"

MIN_SCORE_THRESHOLD = 70  # RxNorm match confidence

logger = logging.getLogger(__name__)


# -------------------------
# NORMALIZATION
# -------------------------

@lru_cache(maxsize=512)
def normalize_drug_name(drug_name: str):
    """
    Normalizes drug name using RxNorm.
    Returns standardized generic name (lowercase) or None.
    """

    if not drug_name or len(drug_name) < 4:
        return None

    try:
        # ---------- STEP 1: APPROXIMATE MATCH ----------
        approx_url = f"{RXNORM_BASE_URL}/approximateTerm.json"
        params = {
            "term": drug_name,
            "maxEntries": 5
        }

        response = requests.get(approx_url, params=params, timeout=6)
        data = response.json()

        candidates = data.get("approximateGroup", {}).get("candidate", [])
        if not candidates:
            return None

        # Filter by confidence score
        best_candidate = None
        for candidate in candidates:
            score = int(candidate.get("score", 0))
            if score >= MIN_SCORE_THRESHOLD:
                best_candidate = candidate
                break

        if not best_candidate:
            return None

        rxcui = best_candidate.get("rxcui")
        if not rxcui:
            return None

        # ---------- STEP 2: GET GENERIC INGREDIENT ----------
        related_url = f"{RXNORM_BASE_URL}/rxcui/{rxcui}/related.json"
        response = requests.get(related_url, timeout=6)
        data = response.json()

        groups = data.get("relatedGroup", {}).get("conceptGroup", [])

        for group in groups:
            if group.get("tty") == "IN":  # Ingredient
                concepts = group.get("conceptProperties", [])
                if concepts:
                    return concepts[0].get("name", "").lower()

        return None

    except Exception as e:
        logger.error(f"RxNorm normalization failed: {e}")
        return None
