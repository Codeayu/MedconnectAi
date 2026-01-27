from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from accounts.permissions import IsPatient
from consultations.models import Consultation
from .matching_engine import recommend_doctors_from_db


class MatchDoctorsView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request, consultation_id):
        try:
            consultation = Consultation.objects.get(
                id=consultation_id,
                patient=request.user
            )
        except Consultation.DoesNotExist:
            return Response(
                {"error": "Consultation not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if not consultation.ai_prediction:
            return Response(
                {"error": "AI prediction not available for this consultation"},
                status=status.HTTP_400_BAD_REQUEST
            )

        doctors = recommend_doctors_from_db(consultation.ai_prediction)

        return Response({
            "consultation_id": consultation.id,
            "recommended_doctors": doctors,
            "count": len(doctors)
        })
