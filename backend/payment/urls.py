# backend/payment/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, InitiateKhaltiPayment, VerifyKhaltiPayment

router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    path('admin-dashboard/', PaymentViewSet.as_view({'get': 'list'}), name='admin-payments'),
    path('initiate-khalti/', InitiateKhaltiPayment.as_view(), name='initiate-khalti'),
    path('verify-khalti/', VerifyKhaltiPayment.as_view(), name='verify-khalti'),
    path('<int:pk>/update_status/', PaymentViewSet.as_view({'put': 'update_status'}), name='payment-update-status'),
] + router.urls
