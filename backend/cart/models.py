# backend/cart/models.py
from django.db import models
from users.models import User
from clothing.models import ClothingItem

class CartItem(models.Model):
    cart_item_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)  # Change 1 to an actual user ID
    item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, default=1)  # Change 1 to a valid default
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'cart_item'  # Map to your existing table
      

    def __str__(self):
        return f"Cart {self.cart_item_id} - {self.item.title}"