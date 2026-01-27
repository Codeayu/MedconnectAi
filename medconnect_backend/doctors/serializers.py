from rest_framework import serializers
from accounts.models import User
from doctors.models import DoctorProfile, DoctorReview
from patients.models import PatientProfile


class DoctorRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    full_name = serializers.CharField()
    specialization = serializers.CharField()
    license_number = serializers.CharField()
    experience_years = serializers.IntegerField()
    consultation_fee = serializers.IntegerField()
    bio = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return value

    def validate_license_number(self, value):
        if DoctorProfile.objects.filter(license_number=value).exists():
            raise serializers.ValidationError("This license number is already registered.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            phone=validated_data["phone"],
            password=validated_data["password"],
            role="DOCTOR"
        )

        doctor = DoctorProfile.objects.create(
            user=user,
            full_name=validated_data["full_name"],
            specialization=validated_data["specialization"],
            license_number=validated_data["license_number"],
            experience_years=validated_data["experience_years"],
            consultation_fee=validated_data["consultation_fee"],
            bio=validated_data.get("bio", ""),
            is_approved=False,  # Requires admin approval
        )
        return doctor


class DoctorProfileSerializer(serializers.ModelSerializer):
    """Serializer for doctor's own profile management"""
    email = serializers.EmailField(source='user.email', read_only=True)
    average_rating = serializers.ReadOnlyField()
    total_reviews = serializers.ReadOnlyField()
    total_consultations = serializers.ReadOnlyField()
    specialization_display = serializers.CharField(source='get_specialization_display', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            'id', 'email', 'full_name', 'specialization', 'specialization_display',
            'license_number', 'bio', 'profile_image', 'experience_years', 
            'consultation_fee', 'is_approved', 'is_active', 'is_online',
            'available_from', 'available_to', 'available_days',
            'average_rating', 'total_reviews', 'total_consultations', 'created_at'
        ]
        read_only_fields = ['id', 'email', 'is_approved', 'created_at']


class DoctorListSerializer(serializers.ModelSerializer):
    """Serializer for listing doctors (patient view)"""
    average_rating = serializers.ReadOnlyField()
    total_reviews = serializers.ReadOnlyField()
    total_consultations = serializers.ReadOnlyField()
    specialization_display = serializers.CharField(source='get_specialization_display', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            'id', 'user_id', 'full_name', 'specialization', 'specialization_display',
            'profile_image', 'bio', 'experience_years', 'consultation_fee',
            'is_online', 'last_seen', 'available_from', 'available_to', 'available_days',
            'average_rating', 'total_reviews', 'total_consultations'
        ]


class DoctorReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    
    class Meta:
        model = DoctorReview
        fields = ['id', 'rating', 'comment', 'patient_name', 'created_at']
        read_only_fields = ['id', 'patient_name', 'created_at']

    def get_patient_name(self, obj):
        try:
            profile = PatientProfile.objects.get(user=obj.patient)
            return profile.full_name
        except PatientProfile.DoesNotExist:
            return "Anonymous"


class CreateReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorReview
        fields = ['rating', 'comment', 'consultation']

