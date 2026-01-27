from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from .models import PatientProfile
from .serializers import PatientProfileSerializer, PatientRegisterSerializer
from accounts.permissions import IsPatient


class PatientRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PatientRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Patient registered successfully. You can now login."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request):
        profile, _ = PatientProfile.objects.get_or_create(
            user=request.user,
            defaults={"full_name": request.user.email},
        )
        serializer = PatientProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request):
        serializer = PatientProfileSerializer(data=request.data)
        if serializer.is_valid():
            PatientProfile.objects.update_or_create(
                user=request.user,
                defaults=serializer.validated_data,
            )
            return Response(
                {"message": "Patient profile saved"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
