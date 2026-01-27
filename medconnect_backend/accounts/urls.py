from .views import CustomTokenObtainPairView
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
]