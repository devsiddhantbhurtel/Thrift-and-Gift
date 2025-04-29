from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()  # Default queryset
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user  # Get the authenticated user

        # If user is superuser AND accessing from admin dashboard, return all orders
        if user.is_superuser and 'admin-dashboard' in self.request.path:
            return queryset
            
        # For regular users and superusers viewing their own orders, filter by user
        return queryset.filter(user=user)

    def create(self, request, *args, **kwargs):
        try:
            print("Received data:", request.data)  # Debug log
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)  # Debug log
                return Response(
                    {"error": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print("Error in create:", str(e))  # Debug log
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        # Automatically set the user to the authenticated user when creating an order
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['PUT'])
    def update_status(self, request, pk=None):
        try:
            print(f"Attempting to update order {pk} with data:", request.data)  # Debug log
            order = Order.objects.get(order_id=pk)  # Use order_id instead of pk
            new_status = request.data.get('order_status')
            
            valid_statuses = ['pending', 'shipped', 'completed', 'cancelled']
            if not new_status:
                return Response(
                    {"error": "order_status field is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if new_status not in valid_statuses:
                return Response(
                    {"error": f"Invalid status. Must be one of {valid_statuses}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            order.order_status = new_status
            order.save()
            
            serializer = self.get_serializer(order)
            return Response(serializer.data)
            
        except Order.DoesNotExist:
            print(f"Order with ID {pk} not found")  # Debug log
            return Response(
                {"error": f"Order with ID {pk} not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error updating order status: {str(e)}")  # Debug log
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
