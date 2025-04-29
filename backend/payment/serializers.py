from rest_framework import serializers
from .models import Payment  # ✅ Only import models, not views
from users.serializers import UserSerializer
from clothing.serializers import ClothingItemSerializer  # Import the clothing item serializer

class PaymentSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)  # Include sender details
    item = ClothingItemSerializer(read_only=True)  # Include item details
    
    class Meta:
        model = Payment
        fields = '__all__'  # ✅ Ensure all fields are serialized
