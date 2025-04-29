from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import CartItem  # Import CartItem from the current app
from clothing.models import ClothingItem  # Import ClothingItem from the clothing app
from .serializers import CartItemSerializer

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def get_queryset(self):
        # Return only the cart items for the logged-in user
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        item_id = request.data.get("item_id")
        quantity = int(request.data.get("quantity", 1))  # Default quantity is 1

        # Validate item_id
        try:
            item = ClothingItem.objects.get(item_id=item_id)  # Use ClothingItem instead of Item
        except ClothingItem.DoesNotExist:
            return Response(
                {"error": "Item does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate quantity
        if quantity <= 0:
            return Response(
                {"error": "Quantity must be a positive integer."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the item already exists in the user's cart
        cart_item, created = CartItem.objects.get_or_create(
            user=user,
            item=item,  # Use the ClothingItem object
            defaults={"quantity": quantity}  # Set quantity if the item is new
        )

        if not created:
            # If the item already exists, increment the quantity
            cart_item.quantity += quantity
            cart_item.save()

        # Serialize the cart item and return the response
        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)