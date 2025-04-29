from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer
from clothing.models import ClothingItem
from django.core.exceptions import ObjectDoesNotExist
from orders.models import Order
from rest_framework.exceptions import NotFound, ValidationError

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        item_id = self.request.data.get('product_item')
        order_id = self.request.data.get('order')
        
        try:
            product_item = ClothingItem.objects.get(item_id=item_id)
            order = Order.objects.get(order_id=order_id)
            
            # Verify the order belongs to the user and is completed
            if order.user != self.request.user:
                raise PermissionError("Cannot review another user's order")
            if order.order_status != 'completed':
                raise ValidationError("Can only review completed orders")
                
            serializer.save(
                reviewer_user=self.request.user,
                reviewer_user_name=self.request.user.name,
                product_item=product_item,
                order=order
            )
        except (ClothingItem.DoesNotExist, Order.DoesNotExist) as e:
            raise NotFound(str(e))
        except (PermissionError, ValidationError) as e:
            raise ValidationError(str(e))