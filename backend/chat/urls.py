from django.urls import path
from .views import ChatViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', ChatViewSet, basename='chat')

urlpatterns = [
    path('messages/', ChatViewSet.as_view({'get': 'messages'}), name='chat-messages'),
    path('users/', ChatViewSet.as_view({'get': 'users'}), name='chat-users'),
    path('', ChatViewSet.as_view({'post': 'create', 'get': 'list'}), name='chat'),
]