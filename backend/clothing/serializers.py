from rest_framework import serializers
from .models import ClothingItem
from reviews.models import Review
from django.db.models import Avg

class ClothingItemSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = ClothingItem
        fields = [
            'item_id', 'title', 'description', 'size', 'price', 'condition',
            'tags', 'location', 'image', 'removed', 'removal_reason', 'removed_at', 'average_rating'
        ]

    def get_average_rating(self, obj):
        avg_rating = Review.objects.filter(product_item=obj).aggregate(Avg('rating'))['rating__avg']
        return round(avg_rating, 1) if avg_rating else 0
