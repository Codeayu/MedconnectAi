import re
from typing import Optional


# -------------------------
# CONFIG
# -------------------------

EMERGENCY_PHRASES = [
    "heart attack", "stroke", "unconscious",
    "severe chest pain", "difficulty breathing",
    "heavy bleeding", "seizure", "collapse"
]

SELF_HARM_PHRASES = [
    "kill myself", "suicide", "end my life",
    "overdose", "self harm", "want to die"
]

MEDICATION_ACTION_PHRASES = [
    "take", "consume", "increase dose",
    "stop medication", "double dose",
    "how much should i take"
]

DISCLAIMER = (
    "\n\n⚠️ **Medical Disclaimer:**\n"
    "This information is for educational purposes only and does not replace professional medical advice. "
    "Always consult a qualified healthcare provider before making medical decisions."
)


# -------------------------
# HELPERS
# -------------------------

def contains_phrase(text: str, phrases: list) -> bool:
    text = text.lower()
    return any(phrase in text for phrase in phrases)


def redact_dosage_advice(text: str) -> str:
    """
    Redacts explicit dosage instructions but keeps general explanations.
    """
    dosage_patterns = [
        r"\b\d+\s?(mg|ml|mcg|units|iu)\b",
        r"\b(take|consume)\s+\d+(\s?times|\s?tablets)?\b",
        r"\b\d+\s?(times|per day|daily)\b"
    ]

    for pattern in dosage_patterns:
        text = re.sub(pattern, "[dosage information removed]", text, flags=re.IGNORECASE)

    return text


# -------------------------
# MAIN SAFETY FUNCTION
# -------------------------

def apply_safety_checks(
    llm_response: str,
    user_query: str,
    route: Optional[str] = None,
    confidence: Optional[str] = None
) -> str:
    """
    Applies medical safety rules before returning response
    """

    user_text = user_query.lower()
    response_text = llm_response.strip()

    # ---------- 1️ SELF HARM ----------
    if contains_phrase(user_text, SELF_HARM_PHRASES):
        return (
            "🚨 **Immediate Support Needed**\n\n"
            "It sounds like you may be going through a very difficult time. "
            "You are not alone, and help is available.\n\n"
            "🇮🇳 India Suicide Prevention Helpline: **9152987821**\n"
            "If you are in immediate danger, please contact local emergency services."
        )

    # ---------- 2️ EMERGENCY ----------
    if route == "EMERGENCY" or contains_phrase(user_text, EMERGENCY_PHRASES):
        return (
            "🚨 **Medical Emergency Warning**\n\n"
            "Your symptoms may indicate a medical emergency. "
            "Please seek immediate medical attention or call emergency services."
        )

    # ---------- 3️ MEDICATION SAFETY ----------
    if contains_phrase(user_text, MEDICATION_ACTION_PHRASES):
        response_text = redact_dosage_advice(response_text)

    # ---------- 4️ LOW CONFIDENCE GUARD ----------
    if confidence == "low":
        response_text = (
            "⚠️ **Limited Information Available**\n\n"
            "The following information is general and may not fully address your situation.\n\n"
            + response_text
        )

    # ---------- 5️ ADD DISCLAIMER ----------
    if route != "EMERGENCY" and DISCLAIMER not in response_text:
        response_text += DISCLAIMER

    return response_text
