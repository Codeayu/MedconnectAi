from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[
            ("MALE", "Male"),
            ("FEMALE", "Female"),
            ("OTHER", "Other"),
        ],
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
