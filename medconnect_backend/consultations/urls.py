from django.urls import path
from .views import (
    CreateConsultationView,
    BookConsultationView,
    PatientConsultationsView,
    DoctorConsultationsView,
    ConsultationDetailView,
    UpdateConsultationStatusView,
    CancelConsultationView,
    AcceptConsultationView,
    RejectConsultationView,
    StartConsultationView,
)

urlpatterns = [
    # Create/Book
    path("create/", CreateConsultationView.as_view()),
    path("book/", BookConsultationView.as_view()),
    
    # List consultations
    path("patient/", PatientConsultationsView.as_view()),
    path("doctor/", DoctorConsultationsView.as_view()),
    
    # Single consultation operations
    path("<int:consultation_id>/", ConsultationDetailView.as_view()),
    path("<int:consultation_id>/update-status/", UpdateConsultationStatusView.as_view()),
    path("<int:consultation_id>/cancel/", CancelConsultationView.as_view()),
    path("<int:consultation_id>/accept/", AcceptConsultationView.as_view()),
    path("<int:consultation_id>/reject/", RejectConsultationView.as_view()),
    path("<int:consultation_id>/start/", StartConsultationView.as_view()),
]
