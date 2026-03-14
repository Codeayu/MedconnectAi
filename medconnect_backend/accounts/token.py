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
        lab_id = None
        
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
        elif self.user.role == "LAB_PROVIDER":
            try:
                from lab_tests.models import LabProviderProfile
                profile = LabProviderProfile.objects.filter(user=self.user).first()
                if profile:
                    full_name = profile.full_name
                    lab_id = profile.lab.id if profile.lab else None
            except:
                pass
        
        data["full_name"] = full_name or self.user.email.split('@')[0]
        if lab_id:
            data["lab_id"] = lab_id
        return data