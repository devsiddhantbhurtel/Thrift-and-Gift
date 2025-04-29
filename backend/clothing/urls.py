from django.urls import path,include
from .views import ClothingItemViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', ClothingItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
