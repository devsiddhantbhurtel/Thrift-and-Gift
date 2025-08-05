from rest_framework import viewsets
from .models import ClothingItem
from .serializers import ClothingItemSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsSeller, IsBuyer
import logging
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from django.utils import timezone
import random

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ClothingItemViewSet(viewsets.ModelViewSet):
    serializer_class = ClothingItemSerializer
    queryset = ClothingItem.objects.all()  # Define the queryset at the class level

    def get_permissions(self):
        # Allow access to all authenticated users (buyers and sellers)
        if self.action in ['list', 'retrieve', 'random_items']:
            return [IsAuthenticated()]
        # For create, update, and delete actions, require the user to be a seller
        return [IsAuthenticated(), IsSeller()]

    def get_queryset(self):
        queryset = self.queryset  # Use the class-level queryset
        seller_id = self.request.query_params.get('seller_id')
        if seller_id is not None:
            queryset = queryset.filter(clothing_user_id=seller_id)
        return queryset

    @action(detail=False, methods=['get'])
    def random_items(self, request):
        # Get all non-removed items
        available_items = self.queryset.filter(removed=False)
        # Get 4 random items
        random_items = list(available_items)
        if len(random_items) > 4:
            random_items = random.sample(random_items, 4)
        serializer = self.get_serializer(random_items, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        logger.debug(f"Request data: {request.data}")  # Log the incoming data
        instance = self.get_object()

        # Handle removal
        if 'removed' in request.data and request.data['removed']:
            instance.removed = True
            instance.removal_reason = request.data.get('removal_reason', '')
            instance.removed_at = timezone.now()  # Set the current timestamp
            instance.save()
            return Response(self.get_serializer(instance).data)

        return super().update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        logger.debug(f"Request data: {request.data}")  # Log the incoming data
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        # Ensure the clothing_user_id is set to the current user
        serializer.save(clothing_user_id=self.request.user.user_id)
