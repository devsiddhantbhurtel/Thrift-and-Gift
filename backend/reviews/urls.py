from django.urls import path, include
from .views import ReviewViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', ReviewViewSet)  # Register the ReviewViewSet

urlpatterns = [
    path('', include(router.urls)),  # Include the router URLs
]