import json
from pathlib import Path
from doctors.models import DoctorProfile

BASE_DIR = Path(__file__).resolve().parent
DISEASE_MAP_PATH = BASE_DIR / "data/disease_to_specialist.json"

with open(DISEASE_MAP_PATH, "r", encoding="utf-8") as f:
    DISEASE_MAP = json.load(f)


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

    # 1️⃣ Map diseases → specializations
    specializations = set()
    for disease in diseases:
        specializations.update(
            DISEASE_MAP.get(
                disease,
                DISEASE_MAP.get("_default", ["General Physician"])
            )
        )

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
