from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


from .vectorizer import build_symptom_vector
from .predictor import predict_top_diseases
from doctor_matching.matching_engine import recommend_doctors_from_db

HIGH_CONFIDENCE_THRESHOLD = 0.6
LOW_CONFIDENCE_THRESHOLD = 0.4


class PredictAndRecommendView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        selected_symptoms = request.data.get("symptoms")

        if not selected_symptoms or not isinstance(selected_symptoms, list):
            return Response(
                {"error": "symptoms must be a list of symptom names"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Build vector
        symptom_vector, unknown = build_symptom_vector(selected_symptoms)

        # 2. Predict diseases
        predictions = predict_top_diseases(symptom_vector)

        top_prediction = predictions[0]
        top_prob = top_prediction["prob"]

        # 3. Confidence-based routing
        if top_prob < LOW_CONFIDENCE_THRESHOLD:
            # LOW confidence → GP only
            ai_pred_format = {
                "top_diseases": ["_default"],
                "confidence": [1.0]
            }
            decision = "low_confidence_gp_only"

        elif top_prob < HIGH_CONFIDENCE_THRESHOLD:
            # MEDIUM confidence → disease + GP
            ai_pred_format = {
                "top_diseases": [p["disease"] for p in predictions],
                "confidence": [p["prob"] for p in predictions]
            }
            decision = "medium_confidence_gp_priority"

        else:
            # HIGH confidence → normal flow
            ai_pred_format = {
                "top_diseases": [p["disease"] for p in predictions],
                "confidence": [p["prob"] for p in predictions]
            }
            decision = "high_confidence_disease_match"

        # Get recommended doctors
        doctors = recommend_doctors_from_db(ai_pred_format)

        return Response(
            {
                "confidence_level": decision,
                "top_prediction": top_prediction,
                "predictions": predictions,
                "recommended_doctors": doctors,
                "unknown_symptoms": unknown
            },
            status=status.HTTP_200_OK
        )
