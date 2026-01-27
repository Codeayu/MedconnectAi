from django.urls import path
from chatbot.views import medical_chatbot

urlpatterns = [
    path('', medical_chatbot, name='medical_chatbot'),
]
