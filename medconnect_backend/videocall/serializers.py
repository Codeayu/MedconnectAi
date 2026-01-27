from rest_framework import serializers
from .models import VideoRoom, CallLog


class VideoRoomSerializer(serializers.ModelSerializer):
    consultation_id = serializers.IntegerField(source='consultation.id', read_only=True)
    
    class Meta:
        model = VideoRoom
        fields = [
            'id', 'consultation_id', 'room_name', 'status',
            'patient_joined', 'doctor_joined',
            'started_at', 'ended_at', 'duration_seconds',
            'created_at'
        ]


class VideoTokenSerializer(serializers.Serializer):
    """Serializer for video token response"""
    token = serializers.CharField()
    room_name = serializers.CharField()
    identity = serializers.CharField()
    room_status = serializers.CharField()


class JoinRoomSerializer(serializers.Serializer):
    """Serializer for joining a video room"""
    consultation_id = serializers.IntegerField()


class CallLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = CallLog
        fields = ['id', 'event', 'user_email', 'details', 'timestamp']
