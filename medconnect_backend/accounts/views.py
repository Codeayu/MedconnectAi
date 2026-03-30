from django.shortcuts import render
import logging

# Create your views here.
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle
from .token import CustomTokenObtainPairSerializer
from .models import RevokedRefreshToken

logger = logging.getLogger(__name__)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"



    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            logger.warning("Login failed: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        response = super().post(request, *args, **kwargs)

        # Mark doctor online on successful login.
        if response.status_code == status.HTTP_200_OK:
            user = serializer.user
            if getattr(user, "role", None) == "DOCTOR":
                try:
                    from django.utils import timezone
                    from doctors.models import DoctorProfile
                    profile = DoctorProfile.objects.filter(user=user).first()
                    if profile:
                        profile.is_online = True
                        profile.last_seen = timezone.now()
                        profile.save(update_fields=["is_online", "last_seen"])
                except Exception:
                    pass

        return response


class LogoutView(APIView):
    """Revoke refresh token and set doctor offline if applicable."""
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            user_id = token.get("user_id")
            jti = token.get("jti")

            # Set doctor offline during logout.
            if user_id:
                try:
                    from django.utils import timezone
                    from doctors.models import DoctorProfile
                    profile = DoctorProfile.objects.filter(user_id=user_id).first()
                    if profile:
                        profile.is_online = False
                        profile.last_seen = timezone.now()
                        profile.save(update_fields=["is_online", "last_seen"])
                except Exception:
                    pass

            if user_id and jti:
                RevokedRefreshToken.objects.get_or_create(user_id=user_id, jti=jti)

            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except TokenError:
            return Response(
                {"error": "Invalid or expired refresh token"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CustomTokenRefreshView(APIView):
    """Refresh access token while enforcing local refresh-token revocation."""
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            jti = token.get("jti")
            user_id = token.get("user_id")

            if jti and RevokedRefreshToken.objects.filter(jti=jti).exists():
                return Response(
                    {"error": "Token has been revoked. Please log in again."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data

            # Revoke the old refresh token after successful rotation.
            if user_id and jti:
                RevokedRefreshToken.objects.get_or_create(user_id=user_id, jti=jti)

            return Response(data, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
