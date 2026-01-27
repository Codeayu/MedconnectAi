from django.urls import path
from .views import (
    DoctorRegisterView, 
    ApproveDoctorView,
    DoctorProfileView,
    DoctorOnlineStatusView,
    DoctorListView,
    DoctorDetailView,
    DoctorDashboardView,
    CreateReviewView,
    SpecializationsListView
)

urlpatterns = [
    # Doctor registration & approval
    path("register/", DoctorRegisterView.as_view()),
    path("approve/<int:doctor_id>/", ApproveDoctorView.as_view()),
    
    # Doctor's own profile
    path("profile/", DoctorProfileView.as_view()),
    path("online-status/", DoctorOnlineStatusView.as_view()),
    path("dashboard/", DoctorDashboardView.as_view()),
    
    # Public doctor listing
    path("list/", DoctorListView.as_view()),
    path("specializations/", SpecializationsListView.as_view()),
    path("<int:doctor_id>/", DoctorDetailView.as_view()),
    path("<int:doctor_id>/review/", CreateReviewView.as_view()),
]
