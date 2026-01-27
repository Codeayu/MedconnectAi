from django.db import models
from django.conf import settings
from django.db.models import Avg

User = settings.AUTH_USER_MODEL


class DoctorProfile(models.Model):
    SPECIALIZATION_CHOICES = [
        ('GENERAL', 'General Physician'),
        ('CARDIOLOGY', 'Cardiologist'),
        ('DERMATOLOGY', 'Dermatologist'),
        ('NEUROLOGY', 'Neurologist'),
        ('ORTHOPEDICS', 'Orthopedic'),
        ('PEDIATRICS', 'Pediatrician'),
        ('PSYCHIATRY', 'Psychiatrist'),
        ('GYNECOLOGY', 'Gynecologist'),
        ('ENT', 'ENT Specialist'),
        ('OPHTHALMOLOGY', 'Ophthalmologist'),
        ('DENTAL', 'Dentist'),
        ('OTHER', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')

    full_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100, choices=SPECIALIZATION_CHOICES, default='GENERAL')
    license_number = models.CharField(max_length=50, unique=True)
    bio = models.TextField(blank=True, null=True)
    profile_image = models.URLField(blank=True, null=True)

    experience_years = models.PositiveIntegerField()
    consultation_fee = models.PositiveIntegerField(default=0)

    # Availability & Status
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(auto_now=True)

    # Working hours (optional - can be extended)
    available_from = models.TimeField(null=True, blank=True)
    available_to = models.TimeField(null=True, blank=True)
    available_days = models.CharField(max_length=50, default="Mon,Tue,Wed,Thu,Fri")  # Comma-separated

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dr. {self.full_name} ({self.get_specialization_display()})"

    @property
    def average_rating(self):
        avg = self.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0.0

    @property
    def total_reviews(self):
        return self.reviews.count()

    @property
    def total_consultations(self):
        return self.user.doctor_consultations.filter(status='COMPLETED').count()


class DoctorReview(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='reviews')
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews')
    consultation = models.OneToOneField(
        'consultations.Consultation', 
        on_delete=models.CASCADE, 
        related_name='review',
        null=True, 
        blank=True
    )
    
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    comment = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('doctor', 'patient', 'consultation')

    def __str__(self):
        return f"Review for Dr. {self.doctor.full_name} by Patient #{self.patient.id}"

