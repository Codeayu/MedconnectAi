from rest_framework import serializers
from .models import Consultation
from doctors.models import DoctorProfile
from patients.models import PatientProfile


class ConsultationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = ["doctor", "consultation_type", "scheduled_date", "scheduled_time", "symptoms", "ai_prediction"]


class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = "__all__"


class ConsultationDetailSerializer(serializers.ModelSerializer):
    """Detailed consultation with patient/doctor info"""
    patient_name = serializers.SerializerMethodField()
    patient_email = serializers.SerializerMethodField()
    patient_phone = serializers.SerializerMethodField()
    patient_age = serializers.SerializerMethodField()
    patient_gender = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    doctor_specialization = serializers.SerializerMethodField()
    doctor_profile_id = serializers.SerializerMethodField()
    consultation_type_display = serializers.CharField(source='get_consultation_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Consultation
        fields = [
            'id', 'patient', 'doctor', 'patient_name', 'patient_email', 'patient_phone',
            'patient_age', 'patient_gender',
            'doctor_name', 'doctor_specialization', 'doctor_profile_id',
            'consultation_type', 'consultation_type_display',
            'scheduled_date', 'scheduled_time',
            'symptoms', 'ai_prediction', 'diagnosis', 'prescription', 'notes',
            'status', 'status_display', 'fee', 'is_paid',
            'created_at', 'updated_at', 'completed_at'
        ]

    def get_patient_name(self, obj):
        try:
            profile = PatientProfile.objects.get(user=obj.patient)
            return profile.full_name
        except PatientProfile.DoesNotExist:
            return obj.patient.email

    def get_patient_email(self, obj):
        return obj.patient.email

    def get_patient_phone(self, obj):
        return obj.patient.phone

    def get_patient_age(self, obj):
        try:
            profile = PatientProfile.objects.get(user=obj.patient)
            return profile.age
        except PatientProfile.DoesNotExist:
            return None

    def get_patient_gender(self, obj):
        try:
            profile = PatientProfile.objects.get(user=obj.patient)
            return profile.gender
        except PatientProfile.DoesNotExist:
            return None

    def get_doctor_name(self, obj):
        if obj.doctor:
            try:
                profile = DoctorProfile.objects.get(user=obj.doctor)
                return f"Dr. {profile.full_name}"
            except DoctorProfile.DoesNotExist:
                return obj.doctor.email
        return "Unassigned"

    def get_doctor_specialization(self, obj):
        if obj.doctor:
            try:
                profile = DoctorProfile.objects.get(user=obj.doctor)
                return profile.get_specialization_display()
            except DoctorProfile.DoesNotExist:
                return None
        return None

    def get_doctor_profile_id(self, obj):
        if obj.doctor:
            try:
                profile = DoctorProfile.objects.get(user=obj.doctor)
                return profile.id
            except DoctorProfile.DoesNotExist:
                return None
        return None


class BookConsultationSerializer(serializers.Serializer):
    """Serializer for booking a consultation with a doctor"""
    doctor_id = serializers.IntegerField()
    consultation_type = serializers.ChoiceField(choices=Consultation.CONSULTATION_TYPE_CHOICES, default="VIDEO")
    scheduled_date = serializers.DateField()
    scheduled_time = serializers.TimeField()
    symptoms = serializers.CharField(required=False, allow_blank=True)
    ai_prediction = serializers.JSONField(required=False, allow_null=True)


class UpdateConsultationStatusSerializer(serializers.Serializer):
    """Serializer for updating consultation status"""
    status = serializers.ChoiceField(choices=Consultation.STATUS_CHOICES)
    diagnosis = serializers.CharField(required=False, allow_blank=True)
    prescription = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
