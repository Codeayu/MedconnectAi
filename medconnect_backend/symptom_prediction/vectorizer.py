import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
SYMPTOM_FILE = BASE_DIR / "symptom_list.json"

with open(SYMPTOM_FILE, "r", encoding="utf-8") as f:
    ALL_SYMPTOMS = json.load(f)

def build_symptom_vector(selected_symptoms):
    """
    selected_symptoms = ["itching", "chills", "joint_pain"]
    """

    vector = [0] * len(ALL_SYMPTOMS)

    unknown_symptoms = []

    for i, symptom in enumerate(ALL_SYMPTOMS):
        if symptom in selected_symptoms:
            vector[i] = 1

    for s in selected_symptoms:
        if s not in ALL_SYMPTOMS:
            unknown_symptoms.append(s)

    return vector, unknown_symptoms
