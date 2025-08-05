from rest_framework import serializers
from .models import Payment
from users.serializers import UserSerializer
from clothing.serializers import ClothingItemSerializer

class PaymentSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    item = ClothingItemSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = ['payment_id', 'amount', 'payment_date', 'payment_status', 'sender', 'item'] 