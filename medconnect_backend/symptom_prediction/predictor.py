import numpy as np
from .model_loader import model, label_encoder

def predict_top_diseases(symptom_vector, top_k=3):
    probs = model.predict_proba([symptom_vector])[0]

    top_indices = np.argsort(probs)[-top_k:][::-1]

    results = []
    for idx in top_indices:
        disease = label_encoder.inverse_transform([idx])[0]
        probability = float(probs[idx])

        results.append({
            "disease": disease,
            "prob": round(probability, 3)
        })

    return results
