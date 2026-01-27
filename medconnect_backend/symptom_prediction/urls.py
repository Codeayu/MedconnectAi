from django.urls import path
from .views import PredictAndRecommendView

urlpatterns = [
    path('predict-and-recommend/', PredictAndRecommendView.as_view()),
]
