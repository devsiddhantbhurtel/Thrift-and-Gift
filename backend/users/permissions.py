# backend/users/permissions.py

from rest_framework.permissions import BasePermission

class IsSeller(BasePermission):
    """
    Custom permission to allow only sellers to access a view.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the role 'seller'
        return request.user.is_authenticated and request.user.role == 'seller'

class IsBuyer(BasePermission):
    """
    Custom permission to allow only buyers to access a view.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the role 'buyer'
        return request.user.is_authenticated and request.user.role == 'buyer'