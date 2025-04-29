from rest_framework import viewsets
from rest_framework.response import Response
from .models import ClothingBank
from .serializers import ClothingBankSerializer
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ClothingBankViewSet(viewsets.ModelViewSet):
    queryset = ClothingBank.objects.all()  # Default queryset
    serializer_class = ClothingBankSerializer

    def get_queryset(self):
        queryset = self.queryset
        donator_user = self.request.query_params.get('donator_user')
        if donator_user is not None:
            queryset = queryset.filter(donator_user=donator_user)
        return queryset

    def update(self, request, *args, **kwargs):
        logger.debug(f"Request data: {request.data}")  # Log the incoming data
        instance = self.get_object()
        
        # Handle removal
        if 'removed' in request.data and request.data['removed']:
            instance.removed = True
            instance.removal_reason = request.data.get('removal_reason')
            instance.removed_at = request.data.get('removed_at')
            instance.save()
            return Response(self.get_serializer(instance).data)
            
        return super().update(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(donator_user=self.request.user)
