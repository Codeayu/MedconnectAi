from django.urls import path
from .views import MatchDoctorsView

urlpatterns = [
    path('match/<int:consultation_id>/', MatchDoctorsView.as_view()),
]

