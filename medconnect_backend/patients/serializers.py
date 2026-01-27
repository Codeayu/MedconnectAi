from rest_framework import serializers
from accounts.models import User
from .models import PatientProfile


class PatientRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField()
    age = serializers.IntegerField(required=False, allow_null=True)
    gender = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        # Create user account
        user = User.objects.create_user(
            email=validated_data["email"],
            phone=validated_data["phone"],
            password=validated_data["password"],
            role="PATIENT"
        )

        # Create patient profile
        patient = PatientProfile.objects.create(
            user=user,
            full_name=validated_data["full_name"],
            age=validated_data.get("age"),
            gender=validated_data.get("gender", "")
        )
        return patient


class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ["full_name", "age", "gender"]
