from django.urls import path
from .views import OrderViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    path('admin-dashboard/', OrderViewSet.as_view({'get': 'list'}), name='admin-orders'),
    path('<int:pk>/update_status/', OrderViewSet.as_view({'put': 'update_status'}), name='order-update-status'),
] + router.urls
