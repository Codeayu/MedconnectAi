from django.shortcuts import render
from django.utils import timezone
from django.db.models import Q
from accounts.permissions import IsAdmin, IsDoctor, IsPatient
from doctors.models import DoctorProfile, DoctorReview
from consultations.models import Consultation
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .serializers import (
    DoctorRegisterSerializer, 
    DoctorProfileSerializer, 
    DoctorListSerializer,
    DoctorReviewSerializer,
    CreateReviewSerializer
)


class DoctorRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = DoctorRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Doctor registered. Awaiting admin approval."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApproveDoctorView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, doctor_id):
        try:
            doctor = DoctorProfile.objects.get(id=doctor_id)
            doctor.is_approved = True
            doctor.save()
            return Response({"message": "Doctor approved"})
        except DoctorProfile.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)


class DoctorProfileView(APIView):
    """Doctor's own profile management"""
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        try:
            profile = DoctorProfile.objects.get(user=request.user)
            serializer = DoctorProfileSerializer(profile)
            return Response(serializer.data)
        except DoctorProfile.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            profile = DoctorProfile.objects.get(user=request.user)
            serializer = DoctorProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DoctorProfile.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=status.HTTP_404_NOT_FOUND)


class DoctorOnlineStatusView(APIView):
    """Update doctor's online status"""
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request):
        try:
            profile = DoctorProfile.objects.get(user=request.user)
            profile.is_online = request.data.get('is_online', False)
            profile.last_seen = timezone.now()
            profile.save()
            return Response({
                "is_online": profile.is_online,
                "last_seen": profile.last_seen
            })
        except DoctorProfile.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=status.HTTP_404_NOT_FOUND)


class DoctorListView(APIView):
    """List all approved and active doctors for patients"""
    permission_classes = [AllowAny]

    def get(self, request):
        # Filter parameters
        specialization = request.query_params.get('specialization')
        is_online = request.query_params.get('is_online')
        min_rating = request.query_params.get('min_rating')
        max_fee = request.query_params.get('max_fee')
        search = request.query_params.get('search')

        # Base queryset - only approved and active doctors
        doctors = DoctorProfile.objects.filter(is_approved=True, is_active=True)

        # Apply filters
        if specialization:
            doctors = doctors.filter(specialization=specialization)
        
        if is_online and is_online.lower() == 'true':
            doctors = doctors.filter(is_online=True)
        
        if max_fee:
            doctors = doctors.filter(consultation_fee__lte=int(max_fee))
        
        if search:
            doctors = doctors.filter(
                Q(full_name__icontains=search) | 
                Q(specialization__icontains=search) |
                Q(bio__icontains=search)
            )

        # Order by online status first, then by rating
        doctors = doctors.order_by('-is_online', '-experience_years')

        serializer = DoctorListSerializer(doctors, many=True)
        
        # Filter by min_rating after serialization (since it's a property)
        data = serializer.data
        if min_rating:
            data = [d for d in data if d['average_rating'] >= float(min_rating)]

        return Response(data)


class DoctorDetailView(APIView):
    """Get detailed info about a specific doctor"""
    permission_classes = [AllowAny]

    def get(self, request, doctor_id):
        try:
            doctor = DoctorProfile.objects.get(id=doctor_id, is_approved=True, is_active=True)
            serializer = DoctorListSerializer(doctor)
            
            # Also include recent reviews
            reviews = DoctorReview.objects.filter(doctor=doctor).order_by('-created_at')[:10]
            reviews_data = DoctorReviewSerializer(reviews, many=True).data
            
            response_data = serializer.data
            response_data['reviews'] = reviews_data
            
            return Response(response_data)
        except DoctorProfile.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)


class DoctorDashboardView(APIView):
    """Doctor's dashboard with statistics"""
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        try:
            profile = DoctorProfile.objects.get(user=request.user)
            
            # Get consultation stats
            consultations = Consultation.objects.filter(doctor=request.user)
            
            pending_count = consultations.filter(status='PENDING').count()
            confirmed_count = consultations.filter(status='CONFIRMED').count()
            ongoing_count = consultations.filter(status='ONGOING').count()
            completed_count = consultations.filter(status='COMPLETED').count()
            total_count = consultations.count()
            
            # Today's appointments
            today = timezone.now().date()
            todays_appointments = consultations.filter(
                scheduled_date=today,
                status__in=['CONFIRMED', 'ONGOING']
            ).count()

            # Recent consultations
            recent_consultations = consultations.order_by('-created_at')[:10]
            from consultations.serializers import ConsultationDetailSerializer
            recent_data = ConsultationDetailSerializer(recent_consultations, many=True).data

            return Response({
                "profile": DoctorProfileSerializer(profile).data,
                "stats": {
                    "pending": pending_count,
                    "confirmed": confirmed_count,
                    "ongoing": ongoing_count,
                    "completed": completed_count,
                    "total": total_count,
                    "todays_appointments": todays_appointments,
                },
                "recent_consultations": recent_data
            })
        except DoctorProfile.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=status.HTTP_404_NOT_FOUND)


class CreateReviewView(APIView):
    """Patient creates review for a doctor after consultation"""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request, doctor_id):
        try:
            doctor = DoctorProfile.objects.get(id=doctor_id)
            
            # Check if consultation exists and is completed
            consultation_id = request.data.get('consultation')
            if consultation_id:
                consultation = Consultation.objects.get(
                    id=consultation_id, 
                    patient=request.user,
                    doctor=doctor.user,
                    status='COMPLETED'
                )
            else:
                consultation = None

            # Check if review already exists
            if DoctorReview.objects.filter(
                doctor=doctor, 
                patient=request.user,
                consultation=consultation
            ).exists():
                return Response(
                    {"error": "You have already reviewed this consultation"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            review = DoctorReview.objects.create(
                doctor=doctor,
                patient=request.user,
                consultation=consultation,
                rating=request.data.get('rating'),
                comment=request.data.get('comment', '')
            )
            
            return Response(
                DoctorReviewSerializer(review).data,
                status=status.HTTP_201_CREATED
            )
        except DoctorProfile.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        except Consultation.DoesNotExist:
            return Response({"error": "Consultation not found or not completed"}, status=status.HTTP_404_NOT_FOUND)


class SpecializationsListView(APIView):
    """List all available specializations"""
    permission_classes = [AllowAny]

    def get(self, request):
        specializations = [
            {"value": choice[0], "label": choice[1]} 
            for choice in DoctorProfile.SPECIALIZATION_CHOICES
        ]
        return Response(specializations)
