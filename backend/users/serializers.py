# backend/users/serializers.py

from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    Used to serialize and deserialize User instances.
    """
    class Meta:
        model = User
        fields = [
            'user_id', 'name', 'email', 'role', 
            'is_active', 'is_staff', 'is_superuser', 
            'date_joined', 'last_login'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles the creation of new users.
    """
    password = serializers.CharField(write_only=True)  # Password is write-only (not returned in responses)

    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'role']  # Fields required for registration

    def create(self, validated_data):
        """
        Creates a new user with the provided validated data.
        """
        # Create a new user instance
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=validated_data.get('role', 'buyer')  # Default role is 'buyer' if not provided
        )
        # Hash the password before saving
        user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Handles authentication of users.
    """
    email = serializers.EmailField()  # Email field for login
    password = serializers.CharField(write_only=True)  # Password is write-only

    def validate(self, data):
        """
        Validates the user's credentials.
        """
        email = data.get('email')
        password = data.get('password')

        # Authenticate the user
        user = authenticate(email=email, password=password)

        if user:
            # Return the user if authentication is successful
            return user
        else:
            # Raise an error if authentication fails
            raise serializers.ValidationError("Invalid credentials")