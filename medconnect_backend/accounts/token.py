from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"


    def validate(self, attrs):
        data = super().validate(attrs)

        data["role"] = self.user.role
        data["email"] = self.user.email
        data["user_id"] = self.user.id
        
        # Get full_name from profile
        full_name = None
        if self.user.role == "PATIENT":
            try:
                from patients.models import PatientProfile
                profile = PatientProfile.objects.filter(user=self.user).first()
                if profile:
                    full_name = profile.full_name
            except:
                pass
        elif self.user.role == "DOCTOR":
            try:
                from doctors.models import DoctorProfile
                profile = DoctorProfile.objects.filter(user=self.user).first()
                if profile:
                    full_name = profile.full_name
            except:
                pass
        
        data["full_name"] = full_name or self.user.email.split('@')[0]
        return data