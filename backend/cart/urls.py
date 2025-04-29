#backend/cart/urls.py
from django.urls import path,include
from .views import CartItemViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', CartItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
