from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, role='buyer'):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(email=self.normalize_email(email), name=name, role=role)
        user.set_password(password)  # Hashes password before saving
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password):
        user = self.create_user(email, name, password, role='admin')
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45)
    email = models.EmailField(unique=True, max_length=45)

    # Updated Role Field (Buyer/Seller)
    role = models.CharField(
        max_length=45, 
        choices=[
            ('buyer', 'Buyer'), 
            ('seller', 'Seller')
        ], 
        default='buyer'
    )

    is_active = models.BooleanField(default=True)  # Can log in
    is_staff = models.BooleanField(default=False)  # Admin panel access
    is_superuser = models.BooleanField(default=False)  # Full admin access
    date_joined = models.DateTimeField(default=timezone.now)  # Stores sign-up date
    last_login = models.DateTimeField(auto_now=True)  # Tracks last login time

    objects = CustomUserManager()  # Use custom manager

    USERNAME_FIELD = 'email'  # Set email as the unique identifier
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'user'  # Map to MySQL table

    def __str__(self):
        return self.email