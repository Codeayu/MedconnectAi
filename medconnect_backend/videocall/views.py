import uuid
from datetime import datetime
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant
from twilio.rest import Client

from .models import VideoRoom, CallLog
from .serializers import VideoRoomSerializer, VideoTokenSerializer
from consultations.models import Consultation
from accounts.permissions import IsDoctor, IsPatient


def get_twilio_client():
    """Get Twilio REST client"""
    return Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)


def generate_room_name(consultation_id):
    """Generate unique room name for a consultation"""
    return f"medconnect-consultation-{consultation_id}-{uuid.uuid4().hex[:8]}"


class CreateVideoRoomView(APIView):
    """Create a video room for a consultation (Doctor only)"""
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request):
        consultation_id = request.data.get('consultation_id')
        
        if not consultation_id:
            return Response(
                {"error": "consultation_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify the doctor owns this consultation
            consultation = Consultation.objects.get(
                id=consultation_id,
                doctor=request.user,
                status__in=['CONFIRMED', 'ONGOING']
            )
        except Consultation.DoesNotExist:
            return Response(
                {"error": "Consultation not found or not authorized"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if room already exists
        try:
            existing_room = VideoRoom.objects.get(consultation=consultation)
            if existing_room.status != 'ENDED':
                return Response({
                    "message": "Video room already exists",
                    "room": VideoRoomSerializer(existing_room).data
                })
        except VideoRoom.DoesNotExist:
            pass

        # Create room name
        room_name = generate_room_name(consultation_id)

        # Create Twilio room (optional - rooms are created automatically when first participant joins)
        try:
            client = get_twilio_client()
            twilio_room = client.video.rooms.create(
                unique_name=room_name,
                type='group',  # or 'peer-to-peer' for 1-on-1
                max_participants=2
            )
            room_sid = twilio_room.sid
        except Exception as e:
            # If Twilio room creation fails, still create local room
            # Twilio will create it when participants join
            room_sid = None
            print(f"Twilio room creation error (will be created on join): {e}")

        # Create local room record
        video_room = VideoRoom.objects.create(
            consultation=consultation,
            room_name=room_name,
            room_sid=room_sid,
            status='WAITING'
        )

        # Log the event
        CallLog.objects.create(
            video_room=video_room,
            user=request.user,
            event='ROOM_CREATED',
            details=f"Room created by Dr. {request.user.email}"
        )

        # Update consultation status to ONGOING
        consultation.status = 'ONGOING'
        consultation.save()

        return Response({
            "message": "Video room created successfully",
            "room": VideoRoomSerializer(video_room).data
        }, status=status.HTTP_201_CREATED)


class GetVideoTokenView(APIView):
    """Get Twilio access token to join a video room"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        consultation_id = request.data.get('consultation_id')
        
        if not consultation_id:
            return Response(
                {"error": "consultation_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            consultation = Consultation.objects.get(id=consultation_id)
            
            # Verify user is part of this consultation
            if request.user != consultation.patient and request.user != consultation.doctor:
                return Response(
                    {"error": "You are not authorized for this consultation"},
                    status=status.HTTP_403_FORBIDDEN
                )
                
        except Consultation.DoesNotExist:
            return Response(
                {"error": "Consultation not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get or create video room
        try:
            video_room = VideoRoom.objects.get(consultation=consultation)
        except VideoRoom.DoesNotExist:
            # Create room if it doesn't exist (for patient joining)
            room_name = generate_room_name(consultation_id)
            video_room = VideoRoom.objects.create(
                consultation=consultation,
                room_name=room_name,
                status='WAITING'
            )

        if video_room.status == 'ENDED':
            return Response(
                {"error": "This video call has ended"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Determine identity
        is_doctor = request.user == consultation.doctor
        identity = f"doctor_{request.user.id}" if is_doctor else f"patient_{request.user.id}"
        display_name = request.user.email.split('@')[0]

        # Generate Twilio Access Token
        try:
            # Create access token
            token = AccessToken(
                settings.TWILIO_ACCOUNT_SID,
                settings.TWILIO_API_KEY_SID,
                settings.TWILIO_API_KEY_SECRET,
                identity=identity
            )

            # Add video grant
            video_grant = VideoGrant(room=video_room.room_name)
            token.add_grant(video_grant)

            # Update room status
            if is_doctor:
                video_room.doctor_joined = True
                video_room.doctor_joined_at = timezone.now()
            else:
                video_room.patient_joined = True
                video_room.patient_joined_at = timezone.now()

            # If both joined, mark as active
            if video_room.doctor_joined and video_room.patient_joined:
                video_room.status = 'ACTIVE'
                if not video_room.started_at:
                    video_room.started_at = timezone.now()

            video_room.save()

            # Log the event
            CallLog.objects.create(
                video_room=video_room,
                user=request.user,
                event='PARTICIPANT_JOINED',
                details=f"{'Doctor' if is_doctor else 'Patient'} joined the room"
            )

            return Response({
                "token": token.to_jwt(),
                "room_name": video_room.room_name,
                "identity": identity,
                "display_name": display_name,
                "room_status": video_room.status,
                "is_doctor": is_doctor
            })

        except Exception as e:
            return Response(
                {"error": f"Failed to generate token: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EndVideoCallView(APIView):
    """End a video call"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        consultation_id = request.data.get('consultation_id')
        
        if not consultation_id:
            return Response(
                {"error": "consultation_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            consultation = Consultation.objects.get(id=consultation_id)
            
            # Verify user is part of this consultation
            if request.user != consultation.patient and request.user != consultation.doctor:
                return Response(
                    {"error": "You are not authorized"},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            video_room = VideoRoom.objects.get(consultation=consultation)
            
        except (Consultation.DoesNotExist, VideoRoom.DoesNotExist):
            return Response(
                {"error": "Video room not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # End the room
        video_room.status = 'ENDED'
        video_room.ended_at = timezone.now()
        
        # Calculate duration
        if video_room.started_at:
            duration = (video_room.ended_at - video_room.started_at).total_seconds()
            video_room.duration_seconds = int(duration)
        
        video_room.save()

        # Try to end Twilio room
        try:
            client = get_twilio_client()
            client.video.rooms(video_room.room_name).update(status='completed')
        except Exception as e:
            print(f"Error ending Twilio room: {e}")

        # Log the event
        is_doctor = request.user == consultation.doctor
        CallLog.objects.create(
            video_room=video_room,
            user=request.user,
            event='CALL_ENDED',
            details=f"Call ended by {'Doctor' if is_doctor else 'Patient'}. Duration: {video_room.duration_seconds}s"
        )

        return Response({
            "message": "Video call ended",
            "duration_seconds": video_room.duration_seconds
        })


class VideoRoomStatusView(APIView):
    """Get video room status"""
    permission_classes = [IsAuthenticated]

    def get(self, request, consultation_id):
        try:
            consultation = Consultation.objects.get(id=consultation_id)
            
            # Verify user is part of this consultation
            if request.user != consultation.patient and request.user != consultation.doctor:
                return Response(
                    {"error": "You are not authorized"},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            video_room = VideoRoom.objects.get(consultation=consultation)
            
            return Response({
                "room": VideoRoomSerializer(video_room).data,
                "can_join": video_room.status != 'ENDED'
            })
            
        except VideoRoom.DoesNotExist:
            return Response({
                "room": None,
                "can_join": False,
                "message": "No video room created yet"
            })
        except Consultation.DoesNotExist:
            return Response(
                {"error": "Consultation not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LeaveVideoCallView(APIView):
    """Mark user as left from video call"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        consultation_id = request.data.get('consultation_id')
        
        if not consultation_id:
            return Response(
                {"error": "consultation_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            consultation = Consultation.objects.get(id=consultation_id)
            video_room = VideoRoom.objects.get(consultation=consultation)
            
            is_doctor = request.user == consultation.doctor
            
            # Log the event
            CallLog.objects.create(
                video_room=video_room,
                user=request.user,
                event='PARTICIPANT_LEFT',
                details=f"{'Doctor' if is_doctor else 'Patient'} left the room"
            )

            return Response({"message": "Left the call"})
            
        except (Consultation.DoesNotExist, VideoRoom.DoesNotExist):
            return Response(
                {"error": "Video room not found"},
                status=status.HTTP_404_NOT_FOUND
            )
