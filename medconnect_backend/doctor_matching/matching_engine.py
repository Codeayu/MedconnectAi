import json
from pathlib import Path
from doctors.models import DoctorProfile

BASE_DIR = Path(__file__).resolve().parent
DISEASE_MAP_PATH = BASE_DIR / "data/disease_to_specialist.json"

with open(DISEASE_MAP_PATH, "r", encoding="utf-8") as f:
    DISEASE_MAP = json.load(f)

# Reverse mapping: display name → DB key (e.g. "General Physician" → "GENERAL")
SPEC_DISPLAY_TO_KEY = {display: key for key, display in DoctorProfile.SPECIALIZATION_CHOICES}


def _resolve_spec_keys(display_names):
    """Convert display names (from JSON) to DB keys, accepting both formats."""
    keys = set()
    valid_db_keys = {key for key, _ in DoctorProfile.SPECIALIZATION_CHOICES}
    for name in display_names:
        if name in valid_db_keys:
            keys.add(name)
        elif name in SPEC_DISPLAY_TO_KEY:
            keys.add(SPEC_DISPLAY_TO_KEY[name])
    return keys


def recommend_doctors_from_db(ai_prediction, top_n=5):
    """
    ai_prediction example:
    {
        "top_diseases": ["Flu", "Viral Fever"],
        "confidence": [0.6, 0.3]
    }
    """

    diseases = ai_prediction.get("top_diseases", [])
    confidences = ai_prediction.get("confidence", [])

    # 1️⃣ Map diseases → specializations (display names from JSON)
    raw_specializations = set()
    for disease in diseases:
        raw_specializations.update(
            DISEASE_MAP.get(
                disease,
                DISEASE_MAP.get("_default", ["General Physician"])
            )
        )

    # Convert display names to DB keys
    specializations = _resolve_spec_keys(raw_specializations)
    if not specializations:
        return []

    # 2️⃣ Fetch doctors from DB
    doctors = DoctorProfile.objects.filter(
        is_approved=True,
        is_active=True,
        specialization__in=specializations
    )

    if not doctors.exists():
        return []

    min_fee = min(d.consultation_fee for d in doctors)
    max_fee = max(d.consultation_fee for d in doctors) or 1

    scored_doctors = []

    # 3️⃣ Score doctors
    for doctor in doctors:
        score = 0.0

        # Specialization match (60% weight - most important)
        if doctor.specialization in specializations:
            score += 0.60

        # Experience (cap at 20 years) (25% weight)
        score += 0.25 * min(doctor.experience_years, 20) / 20

        # Affordability (15% weight)
        if max_fee > min_fee:
            score += 0.15 * (1 - (doctor.consultation_fee - min_fee) / (max_fee - min_fee))
        else:
            score += 0.15  # All same price

        scored_doctors.append({
            "doctor": doctor,
            "match_score": round(score, 3)
        })

    # 4️⃣ Sort and return top N
    scored_doctors.sort(key=lambda x: x["match_score"], reverse=True)

    return [
        {
            "doctor_id": item["doctor"].id,
            "name": item["doctor"].full_name,
            "specialization": item["doctor"].specialization,
            "experience": item["doctor"].experience_years,
            "fee": item["doctor"].consultation_fee,
            "match_score": item["match_score"]
        }
        for item in scored_doctors[:top_n]
    ]
