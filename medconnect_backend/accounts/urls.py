from .views import CustomTokenObtainPairView, LogoutView, CustomTokenRefreshView
from django.urls import path

urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view()),
    path("refresh/", CustomTokenRefreshView.as_view()),
    path("logout/", LogoutView.as_view()),
]