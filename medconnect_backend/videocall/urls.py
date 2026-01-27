from django.urls import path
from .views import (
    CreateVideoRoomView,
    GetVideoTokenView,
    EndVideoCallView,
    VideoRoomStatusView,
    LeaveVideoCallView
)

urlpatterns = [
    path('create-room/', CreateVideoRoomView.as_view(), name='create-video-room'),
    path('get-token/', GetVideoTokenView.as_view(), name='get-video-token'),
    path('end-call/', EndVideoCallView.as_view(), name='end-video-call'),
    path('leave/', LeaveVideoCallView.as_view(), name='leave-video-call'),
    path('status/<int:consultation_id>/', VideoRoomStatusView.as_view(), name='video-room-status'),
]
