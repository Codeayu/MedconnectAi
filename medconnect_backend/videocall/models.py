from django.db import models
from django.conf import settings


class VideoRoom(models.Model):
    """Model to track video call rooms"""
    STATUS_CHOICES = [
        ('WAITING', 'Waiting'),
        ('ACTIVE', 'Active'),
        ('ENDED', 'Ended'),
    ]

    consultation = models.OneToOneField(
        'consultations.Consultation',
        on_delete=models.CASCADE,
        related_name='video_room'
    )
    room_name = models.CharField(max_length=255, unique=True)
    room_sid = models.CharField(max_length=255, blank=True, null=True)  # Twilio Room SID
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')
    
    # Track participants
    patient_joined = models.BooleanField(default=False)
    doctor_joined = models.BooleanField(default=False)
    patient_joined_at = models.DateTimeField(null=True, blank=True)
    doctor_joined_at = models.DateTimeField(null=True, blank=True)
    
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Room: {self.room_name} ({self.status})"

    class Meta:
        ordering = ['-created_at']


class CallLog(models.Model):
    """Log of video call events"""
    EVENT_CHOICES = [
        ('ROOM_CREATED', 'Room Created'),
        ('PARTICIPANT_JOINED', 'Participant Joined'),
        ('PARTICIPANT_LEFT', 'Participant Left'),
        ('CALL_STARTED', 'Call Started'),
        ('CALL_ENDED', 'Call Ended'),
        ('ERROR', 'Error'),
    ]

    video_room = models.ForeignKey(VideoRoom, on_delete=models.CASCADE, related_name='logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    event = models.CharField(max_length=50, choices=EVENT_CHOICES)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event} - {self.video_room.room_name}"

    class Meta:
        ordering = ['-timestamp']
