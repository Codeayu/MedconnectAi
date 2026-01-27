import os
import requests
import logging

OPENFDA_BASE_URL = "https://api.fda.gov/drug/label.json"
OPENFDA_API_KEY = os.getenv("OPENFDA_API_KEY")

MAX_FIELD_LENGTH = 800  # keep LLM context small

logger = logging.getLogger(__name__)


# -------------------------
# CORE FETCH FUNCTION
# -------------------------

def fetch_drug_information(drug_name: str):
    """
    Fetches drug information from OpenFDA.
    Returns a concise, medical-safe context string.
    """

    try:
        params = {
            "search": (
                f'openfda.generic_name:{drug_name} '
                f'OR openfda.brand_name:{drug_name}'
            ),
            "limit": 1
        }

        if OPENFDA_API_KEY:
            params["api_key"] = OPENFDA_API_KEY

        response = requests.get(
            OPENFDA_BASE_URL,
            params=params,
            timeout=6
        )

        if response.status_code != 200:
            logger.warning(f"OpenFDA error: {response.status_code}")
            return None

        data = response.json()
        results = data.get("results", [])

        if not results:
            return None

        return format_drug_data(results[0], drug_name)

    except Exception as e:
        logger.error(f"OpenFDA exception: {e}")
        return None


# -------------------------
# FORMAT RESPONSE
# -------------------------

def format_drug_data(label: dict, drug_name: str) -> str:
    """
    Extracts and formats important drug information
    in a safe, concise manner for LLM use.
    """

    def safe_get(field):
        value = label.get(field, [])
        if isinstance(value, list) and value:
            text = value[0]
            return text[:MAX_FIELD_LENGTH]
        return "Information not available."

    formatted = f"""
[Drug Information — OpenFDA]

Drug Name:
{drug_name.title()}

Primary Use:
{safe_get("purpose")}

Approved Uses:
{safe_get("indications_and_usage")}

Important Warnings:
{safe_get("warnings")}

Common Side Effects:
{safe_get("adverse_reactions")}

Precautions:
{safe_get("precautions")}

Note:
This information is sourced from the U.S. FDA drug labeling database.
"""

    return formatted.strip()
