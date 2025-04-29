from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import Chat
from .serializers import ChatSerializer
from users.models import User
from users.serializers import UserSerializer
from datetime import datetime

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('sent_at')

    def create(self, request):
        """Create a new chat message"""
        receiver_id = request.data.get('receiver_id')
        message = request.data.get('message')

        if not receiver_id or not message:
            return Response(
                {"error": "receiver_id and message are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            receiver = User.objects.get(user_id=receiver_id)
            chat = Chat.objects.create(
                sender=request.user,
                receiver=receiver,
                message=message,
                sent_at=datetime.now()
            )
            serializer = self.get_serializer(chat)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response(
                {"error": "Receiver not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def users(self, request):
        """Get list of users the current user has chatted with"""
        user = request.user
        chat_users = User.objects.filter(
            Q(sent_messages__receiver=user) | 
            Q(received_messages__sender=user)
        ).distinct()
        serializer = UserSerializer(chat_users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def messages(self, request):
        """Get messages between current user and specified user"""
        other_user_id = request.query_params.get('other_user_id')
        if not other_user_id:
            return Response(
                {"error": "other_user_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            other_user = User.objects.get(user_id=other_user_id)
            messages = Chat.objects.filter(
                (Q(sender=request.user) & Q(receiver=other_user)) |
                (Q(sender=other_user) & Q(receiver=request.user))
            ).order_by('sent_at')
            serializer = self.get_serializer(messages, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )