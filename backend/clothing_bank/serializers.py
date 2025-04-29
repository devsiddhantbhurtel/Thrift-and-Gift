# backend/clothing_bank/serializers.py
from rest_framework import serializers
from .models import ClothingBank

class ClothingBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingBank
        fields = '__all__'
        read_only_fields = ['username']  # Make username read-only