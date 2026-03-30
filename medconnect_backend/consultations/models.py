from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Consultation(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("ONGOING", "Ongoing"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
        ("REJECTED", "Rejected"),
    ]

    CONSULTATION_TYPE_CHOICES = [
        ("VIDEO", "Video Call"),
        ("AUDIO", "Audio Call"),
        ("CHAT", "Chat"),
        ("IN_PERSON", "In-Person"),
    ]

    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="patient_consultations",
    )

    doctor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="doctor_consultations",
    )

    # Booking Details
    consultation_type = models.CharField(
        max_length=20,
        choices=CONSULTATION_TYPE_CHOICES,
        default="VIDEO"
    )
    scheduled_date = models.DateField(null=True, blank=True)
    scheduled_time = models.TimeField(null=True, blank=True)
    
    # Symptoms and AI prediction
    symptoms = models.TextField(blank=True, null=True)
    ai_prediction = models.JSONField(null=True, blank=True)
    
    # Doctor's notes
    diagnosis = models.TextField(blank=True, null=True)
    prescription = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    # Fee
    fee = models.PositiveIntegerField(default=0)
    is_paid = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Consultation #{self.id} - {self.patient.email} with {self.doctor.email if self.doctor else 'Unassigned'}"
