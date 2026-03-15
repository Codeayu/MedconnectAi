from rest_framework import serializers
from .models import Consultation
from doctors.models import DoctorProfile


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
    is_reviewed = serializers.SerializerMethodField()
    consultation_type_display = serializers.CharField(source='get_consultation_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Consultation
        fields = [
            'id', 'patient', 'doctor', 'patient_name', 'patient_email', 'patient_phone',
            'patient_age', 'patient_gender',
            'doctor_name', 'doctor_specialization', 'doctor_profile_id',
            'is_reviewed',
            'consultation_type', 'consultation_type_display',
            'scheduled_date', 'scheduled_time',
            'symptoms', 'ai_prediction', 'diagnosis', 'prescription', 'notes',
            'status', 'status_display', 'fee', 'is_paid',
            'created_at', 'updated_at', 'completed_at'
        ]

    def get_patient_name(self, obj):
        profile = getattr(obj.patient, 'patientprofile', None)
        return profile.full_name if profile else obj.patient.email

    def get_patient_email(self, obj):
        return obj.patient.email

    def get_patient_phone(self, obj):
        return obj.patient.phone

    def get_patient_age(self, obj):
        profile = getattr(obj.patient, 'patientprofile', None)
        return profile.age if profile else None

    def get_patient_gender(self, obj):
        profile = getattr(obj.patient, 'patientprofile', None)
        return profile.gender if profile else None

    def get_doctor_name(self, obj):
        if obj.doctor:
            profile = getattr(obj.doctor, 'doctor_profile', None)
            if profile:
                return f"Dr. {profile.full_name}"
            return obj.doctor.email
        return "Unassigned"

    def get_doctor_specialization(self, obj):
        if obj.doctor:
            profile = getattr(obj.doctor, 'doctor_profile', None)
            if profile:
                return profile.get_specialization_display()
            return None
        return None

    def get_doctor_profile_id(self, obj):
        if obj.doctor:
            profile = getattr(obj.doctor, 'doctor_profile', None)
            if profile:
                return profile.id
            return None
        return None

    def get_is_reviewed(self, obj):
        return hasattr(obj, 'review') and obj.review is not None


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
