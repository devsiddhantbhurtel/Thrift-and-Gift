# serializers.py
from rest_framework import serializers
from .models import Order
import os
from django.core.files.uploadedfile import InMemoryUploadedFile, UploadedFile
from django.conf import settings
from users.serializers import UserSerializer

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Include user details in the serialization
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['order_id', 'order_date', 'user']
        extra_kwargs = {
            'user': {'required': False},
            'order_image': {'required': False},
        }

    def create(self, validated_data):
        try:
            # Handle the image file if it exists
            image_file = validated_data.get('order_image')
            if isinstance(image_file, (InMemoryUploadedFile, UploadedFile)):
                # Keep the original filename
                validated_data['order_image'].name = image_file.name

            # Create the order
            order = super().create(validated_data)
            return order
            
        except Exception as e:
            print("Error creating order:", str(e))
            raise serializers.ValidationError(f"Error creating order: {str(e)}")

    def to_representation(self, instance):
        # Get the default representation
        representation = super().to_representation(instance)
        
        # Add the full URL for the image if it exists
        if instance.order_image:
            representation['image_url'] = f'/media/{instance.order_image}'
        
        return representation