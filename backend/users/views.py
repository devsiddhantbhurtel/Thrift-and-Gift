# backend/users/views.py

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the User model.
    Provides CRUD operations for User instances.
    """
    queryset = User.objects.all()  # All User instances
    serializer_class = UserSerializer  # Serializer for User model

    def retrieve(self, request, pk=None):
        try:
            user = User.objects.get(user_id=pk)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class RegisterView(APIView):
    """
    View for user registration.
    Allows anyone to register without authentication.
    """
    permission_classes = [AllowAny]  # No authentication required
    http_method_names = ['post']  # Only allow POST requests

    def post(self, request):
        """
        Handles user registration.
        """
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            # Create a new user
            user = serializer.save()

            # Generate JWT tokens for the new user
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Return success response with user data and tokens
            return Response({
                'message': 'User registered successfully!',
                'user': UserSerializer(user).data,  # Serialized user data
                'refresh': str(refresh),  # Refresh token
                'access': access_token,  # Access token
            }, status=status.HTTP_201_CREATED)

        # Return error response if registration fails
        return Response({
            'message': 'Registration failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """
    View for user login.
    Authenticates users and returns JWT tokens.
    """
    def post(self, request):
        """
        Handles user login.
        """
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            # Authenticate the user
            user = serializer.validated_data

            # Generate JWT tokens for the authenticated user
            refresh = RefreshToken.for_user(user)

            # Return success response with user data and tokens
            return Response({
                'user': UserSerializer(user).data,  # Serialized user data
                'refresh': str(refresh),  # Refresh token
                'access': str(refresh.access_token),  # Access token
            }, status=status.HTTP_200_OK)

        # Return error response if login fails
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RefreshTokenView(APIView):
    """
    View for refreshing JWT access tokens.
    """
    def post(self, request):
        """
        Handles token refresh requests.
        """
        refresh_token = request.data.get('refresh')

        if refresh_token:
            try:
                # Generate a new access token using the refresh token
                token = RefreshToken(refresh_token)
                access_token = str(token.access_token)

                # Return the new access token
                return Response({'access': access_token}, status=status.HTTP_200_OK)
            except Exception as e:
                # Handle invalid or expired refresh tokens
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Return error if no refresh token is provided
        return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)