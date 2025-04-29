from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/clothing_bank/', include('clothing_bank.urls')),
    path('api/clothing/', include('clothing.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/reviews/', include('reviews.urls')),  
    path('api/payment/', include('payment.urls')),  # This is correct
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
