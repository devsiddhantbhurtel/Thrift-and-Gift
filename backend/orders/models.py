# backend/order/models.py
from django.db import models
from users.models import User
from payment.models import Payment
from clothing.models import ClothingItem

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column="order_user_id")  
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.IntegerField()  
    order_status = models.CharField(max_length=45, default='pending')  
    shipping_address = models.TextField()  # Added for shipping address
    payment_type = models.CharField(max_length=50)  # Added for payment type
    
    # New fields
    order_item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, db_column="order_item_id")  
    order_name = models.CharField(max_length=255)  # Name from clothing_item
    order_image = models.ImageField(upload_to='clothing_images/', null=True, blank=True)

    class Meta:
        db_table = "orders"  # Ensures correct table mapping

    def __str__(self):
        return f"Order {self.order_id} - {self.order_name} ({self.user.name})"
