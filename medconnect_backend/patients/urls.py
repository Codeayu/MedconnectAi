from django.urls import path
from .views import PatientProfileView, PatientRegisterView

urlpatterns = [
    path("register/", PatientRegisterView.as_view()),
    path("profile/", PatientProfileView.as_view()),
]
