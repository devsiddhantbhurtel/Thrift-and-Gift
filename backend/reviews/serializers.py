from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'review_id', 'rating', 'comment', 'created_at',
            'reviewer_user', 'reviewer_user_name', 'product_item',
            'order'
        ]
        read_only_fields = ['review_id', 'created_at', 'reviewer_user', 'reviewer_user_name']

    def validate_rating(self, value):
        if not isinstance(value, int) or value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be an integer between 1 and 5")
        return value

    def validate(self, data):
        # Validate that the order exists and is completed
        order = data.get('order')
        if order and order.order_status != 'completed':
            raise serializers.ValidationError("Can only review completed orders")
        return data
