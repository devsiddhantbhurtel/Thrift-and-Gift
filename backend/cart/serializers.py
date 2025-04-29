# cart/serializers.py
from rest_framework import serializers
from .models import CartItem
from clothing.models import ClothingItem  # Import ClothingItem
from clothing.serializers import ClothingItemSerializer

class CartItemSerializer(serializers.ModelSerializer):
    item = ClothingItemSerializer(read_only=True)  # Include nested item details
    
    class Meta:
        model = CartItem
        fields = ['cart_item_id', 'quantity', 'user', 'item']  # Include all necessary fields