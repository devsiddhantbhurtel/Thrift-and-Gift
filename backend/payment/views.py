from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from django.conf import settings
from .models import Payment  # Import the Payment model
from orders.models import Order  # Correctly import the Order model
from .serializers import PaymentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # If user is superuser AND accessing from admin dashboard, return all payments
        if user.is_superuser and 'admin-dashboard' in self.request.path:
            return self.queryset
        # Otherwise, filter payments for the authenticated user
        return self.queryset.filter(sender=user)

    @action(detail=True, methods=['PUT'])
    def update_status(self, request, pk=None):
        try:
            print(f"Attempting to update payment {pk} with data:", request.data)  # Debug log
            payment = Payment.objects.get(payment_id=pk)  # Use payment_id instead of pk
            new_status = request.data.get('payment_status')
            
            valid_statuses = ['pending', 'completed', 'failed']
            if not new_status:
                return Response(
                    {"error": "payment_status field is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if new_status not in valid_statuses:
                return Response(
                    {"error": f"Invalid status. Must be one of {valid_statuses}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            payment.payment_status = new_status
            payment.save()
            
            serializer = self.get_serializer(payment)
            return Response(serializer.data)
            
        except Payment.DoesNotExist:
            print(f"Payment with ID {pk} not found")  # Debug log
            return Response(
                {"error": f"Payment with ID {pk} not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error updating payment status: {str(e)}")  # Debug log
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class InitiateKhaltiPayment(APIView):
    def post(self, request):
        try:
            data = request.data
            amount = data.get('amount')  # This should already be in paisa from frontend
            purchase_order_id = data.get('purchase_order_id')
            purchase_order_name = data.get('purchase_order_name')
            customer_info = data.get('customer_info')

            # Add debug logging
            print("Received amount:", amount)
            print("Full payload:", data)

            # Create payment record (convert back to NPR for storage)
            payment = Payment.objects.create(
                amount=amount // 100,  # Convert paisa to NPR for storage
                payment_status='pending',
                sender_id=data.get('sender_id'),
                item_id=data.get('item_id')
            )

            url = 'https://a.khalti.com/api/v2/epayment/initiate/'
            headers = {
                'Authorization': f'Key {settings.KHALTI_SECRET_KEY}',
                'Content-Type': 'application/json',
            }

            payload = {
                'return_url': f'{settings.FRONTEND_URL}/orders',
                'website_url': settings.FRONTEND_URL,
                'amount': amount,  # Make sure this is in paisa
                'purchase_order_id': purchase_order_id,
                'purchase_order_name': purchase_order_name,
                'customer_info': customer_info
            }

            # Debug information
            print("Sending to Khalti:")
            print(f"URL: {url}")
            print(f"Headers: {headers}")
            print(f"Payload: {payload}")

            response = requests.post(url, headers=headers, json=payload)

            # Debug response
            print(f"Khalti Response Status: {response.status_code}")
            print(f"Khalti Response Body: {response.text}")

            if response.status_code == 200:
                return Response(response.json())
            else:
                return Response(
                    {'error': 'Failed to initiate payment', 'details': response.text},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            print(f"Exception in InitiateKhaltiPayment: {str(e)}")
            return Response(
                {'error': 'Internal server error', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class VerifyKhaltiPayment(APIView):
    def get(self, request):
        token = request.query_params.get('token')
        order_id = request.query_params.get('order_id')

        if not token or not order_id:
            return Response({'error': 'Missing token or order_id'}, status=status.HTTP_400_BAD_REQUEST)

        url = 'https://a.khalti.com/api/v2/payment/verify/'
        headers = {
            'Authorization': f'Bearer {settings.KHALTI_PRIVATE_KEY}'
        }
        payload = {
            'token': token,
            'amount': request.query_params.get('amount')
        }

        response = requests.post(url, headers=headers, json=payload)

        if response.status_code == 200:
            payment_data = response.json()
            payment_status = payment_data.get('payment_status')

            # Update the payment status in your database
            payment = Payment.objects.get(payment_id=order_id)
            payment.payment_status = payment_status
            payment.save()

            # Update the corresponding order status
            try:
                order = Order.objects.get(order_id=order_id)
                if payment_status == 'Completed':
                    order.order_status = 'paid'  # Update to 'paid' or any status indicating success
                else:
                    order.order_status = 'payment_failed'
                order.save()
            except Order.DoesNotExist:
                return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

            return Response(payment_data)
        else:
            return Response({'error': 'Payment verification failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
