from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Consultation
from .serializers import (
    ConsultationCreateSerializer, 
    ConsultationSerializer,
    ConsultationDetailSerializer,
    BookConsultationSerializer,
    UpdateConsultationStatusSerializer
)
from accounts.permissions import IsPatient, IsDoctor
from doctors.models import DoctorProfile


class CreateConsultationView(APIView):
    """Legacy: Create consultation without specific doctor"""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request):
        serializer = ConsultationCreateSerializer(data=request.data)
        if serializer.is_valid():
            consultation = Consultation.objects.create(
                patient=request.user,
                ai_prediction=serializer.validated_data.get("ai_prediction"),
            )
            return Response(
                ConsultationSerializer(consultation).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookConsultationView(APIView):
    """Book a consultation with a specific doctor"""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request):
        serializer = BookConsultationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Get the doctor profile
                doctor_profile = DoctorProfile.objects.get(
                    id=serializer.validated_data['doctor_id'],
                    is_approved=True,
                    is_active=True
                )
                
                # Create consultation
                consultation = Consultation.objects.create(
                    patient=request.user,
                    doctor=doctor_profile.user,
                    consultation_type=serializer.validated_data['consultation_type'],
                    scheduled_date=serializer.validated_data['scheduled_date'],
                    scheduled_time=serializer.validated_data['scheduled_time'],
                    symptoms=serializer.validated_data.get('symptoms', ''),
                    ai_prediction=serializer.validated_data.get('ai_prediction'),
                    fee=doctor_profile.consultation_fee,
                    status='PENDING'
                )
                
                return Response(
                    ConsultationDetailSerializer(consultation).data,
                    status=status.HTTP_201_CREATED
                )
            except DoctorProfile.DoesNotExist:
                return Response(
                    {"error": "Doctor not found or not available"},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientConsultationsView(APIView):
    """Get patient's consultations"""
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request):
        status_filter = request.query_params.get('status')
        
        qs = Consultation.objects.filter(patient=request.user)
        
        if status_filter:
            qs = qs.filter(status=status_filter)
        
        qs = qs.order_by('-created_at')
        serializer = ConsultationDetailSerializer(qs, many=True)
        return Response(serializer.data)


class DoctorConsultationsView(APIView):
    """Get doctor's consultations"""
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        status_filter = request.query_params.get('status')
        
        qs = Consultation.objects.filter(doctor=request.user)
        
        if status_filter:
            qs = qs.filter(status=status_filter)
        
        qs = qs.order_by('-created_at')
        serializer = ConsultationDetailSerializer(qs, many=True)
        return Response(serializer.data)


class ConsultationDetailView(APIView):
    """Get single consultation details"""
    permission_classes = [IsAuthenticated]

    def get(self, request, consultation_id):
        try:
            # Check if user is patient or doctor of this consultation
            consultation = Consultation.objects.get(id=consultation_id)
            
            if consultation.patient != request.user and consultation.doctor != request.user:
                return Response(
                    {"error": "You don't have permission to view this consultation"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = ConsultationDetailSerializer(consultation)
            return Response(serializer.data)
        except Consultation.DoesNotExist:
            return Response({"error": "Consultation not found"}, status=status.HTTP_404_NOT_FOUND)


class UpdateConsultationStatusView(APIView):
    """Doctor updates consultation status"""
    permission_classes = [IsAuthenticated, IsDoctor]

    def put(self, request, consultation_id):
        try:
            consultation = Consultation.objects.get(id=consultation_id, doctor=request.user)
            
            serializer = UpdateConsultationStatusSerializer(data=request.data)
            if serializer.is_valid():
                new_status = serializer.validated_data['status']
                consultation.status = new_status
                
                if new_status == 'COMPLETED':
                    consultation.completed_at = timezone.now()
                
                # Update optional fields
                if 'diagnosis' in serializer.validated_data:
                    consultation.diagnosis = serializer.validated_data['diagnosis']
                if 'prescription' in serializer.validated_data:
                    consultation.prescription = serializer.validated_data['prescription']
                if 'notes' in serializer.validated_data:
                    consultation.notes = serializer.validated_data['notes']
                
                consultation.save()
                return Response(ConsultationDetailSerializer(consultation).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Consultation.DoesNotExist:
            return Response({"error": "Consultation not found"}, status=status.HTTP_404_NOT_FOUND)


class CancelConsultationView(APIView):
    """Patient or Doctor can cancel consultation"""
    permission_classes = [IsAuthenticated]

    def post(self, request, consultation_id):
        try:
            consultation = Consultation.objects.get(id=consultation_id)
            
            # Only patient or doctor can cancel
            if consultation.patient != request.user and consultation.doctor != request.user:
                return Response(
                    {"error": "You don't have permission to cancel this consultation"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Can only cancel pending or confirmed consultations
            if consultation.status not in ['PENDING', 'CONFIRMED']:
                return Response(
                    {"error": "Cannot cancel consultation in current status"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            consultation.status = 'CANCELLED'
            consultation.save()
            
            return Response(ConsultationDetailSerializer(consultation).data)
        except Consultation.DoesNotExist:
            return Response({"error": "Consultation not found"}, status=status.HTTP_404_NOT_FOUND)


class AcceptConsultationView(APIView):
    """Doctor accepts a pending consultation"""
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request, consultation_id):
        try:
            consultation = Consultation.objects.get(id=consultation_id, doctor=request.user)
            
            if consultation.status != 'PENDING':
                return Response(
                    {"error": "Can only accept pending consultations"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            consultation.status = 'CONFIRMED'
            consultation.save()
            
            return Response(ConsultationDetailSerializer(consultation).data)
        except Consultation.DoesNotExist:
            return Response({"error": "Consultation not found"}, status=status.HTTP_404_NOT_FOUND)


class RejectConsultationView(APIView):
    """Doctor rejects a pending consultation"""
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request, consultation_id):
        try:
            consultation = Consultation.objects.get(id=consultation_id, doctor=request.user)
            
            if consultation.status != 'PENDING':
                return Response(
                    {"error": "Can only reject pending consultations"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            consultation.status = 'REJECTED'
            consultation.notes = request.data.get('reason', '')
            consultation.save()
            
            return Response(ConsultationDetailSerializer(consultation).data)
        except Consultation.DoesNotExist:
            return Response({"error": "Consultation not found"}, status=status.HTTP_404_NOT_FOUND)


class StartConsultationView(APIView):
    """Doctor starts an ongoing consultation"""
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request, consultation_id):
        try:
            consultation = Consultation.objects.get(id=consultation_id, doctor=request.user)
            
            if consultation.status != 'CONFIRMED':
                return Response(
                    {"error": "Can only start confirmed consultations"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            consultation.status = 'ONGOING'
            consultation.save()
            
            return Response(ConsultationDetailSerializer(consultation).data)
        except Consultation.DoesNotExist:
            return Response({"error": "Consultation not found"}, status=status.HTTP_404_NOT_FOUND)
