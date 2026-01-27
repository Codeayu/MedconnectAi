from django.shortcuts import render

# Create your views here.
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from .token import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print("RAW REQUEST DATA 👉", request.data)

        if not serializer.is_valid():
            print("JWT ERROR 👉", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().post(request, *args, **kwargs)
