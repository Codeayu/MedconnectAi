from django.contrib import admin
from .models import VideoRoom, CallLog


@admin.register(VideoRoom)
class VideoRoomAdmin(admin.ModelAdmin):
    list_display = ('room_name', 'consultation', 'status', 'patient_joined', 'doctor_joined', 
                    'duration_seconds', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('room_name', 'consultation__id')
    readonly_fields = ('room_name', 'room_sid', 'created_at', 'updated_at')


@admin.register(CallLog)
class CallLogAdmin(admin.ModelAdmin):
    list_display = ('video_room', 'user', 'event', 'timestamp')
    list_filter = ('event', 'timestamp')
    search_fields = ('video_room__room_name', 'user__email')
