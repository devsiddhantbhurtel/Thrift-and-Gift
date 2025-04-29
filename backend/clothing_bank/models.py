# backend/clothing_bank/models.py
from django.db import models
from users.models import User

class ClothingBank(models.Model):
    donation_id = models.AutoField(primary_key=True)
    donator_user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='donator_user_id')
    username = models.CharField(max_length=255, blank=True)  # Make it blank=True
    phonenumber = models.CharField(max_length=15)
    category = models.CharField(max_length=100)
    size = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='clothing_images/', blank=True, null=True)
    removed = models.BooleanField(default=False)
    removal_reason = models.CharField(max_length=255, null=True, blank=True)
    removed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'clothing_bank'
        managed = False

    def save(self, *args, **kwargs):
        # Use the 'name' field from the User model
        self.username = self.donator_user.name
        super(ClothingBank, self).save(*args, **kwargs)

    def __str__(self):
        return f"Donation {self.donation_id} - {self.username}"
