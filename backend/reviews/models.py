from django.db import models
from users.models import User
from clothing.models import ClothingItem

class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    reviewer_user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='reviewer_user_id')
    reviewer_user_name = models.CharField(max_length=45)
    product_item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, db_column='product_item_id')
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, db_column='order_id', null=True)

    class Meta:
        db_table = 'reviews'

    def __str__(self):
        return f"Review {self.review_id} for {self.product_item.title}"