# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView, LoginView, RefreshTokenView

router = DefaultRouter()
router.register(r'list', UserViewSet)  # Changed from '' to 'list'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  # Registration endpoint
    path('login/', LoginView.as_view(), name='login'),  # Login endpoint
    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),  # Refresh token endpoint
    path('', include(router.urls)),  # Move router URLs to the end
    path('<int:pk>/', UserViewSet.as_view({'get': 'retrieve'}), name='user-detail'),
] 