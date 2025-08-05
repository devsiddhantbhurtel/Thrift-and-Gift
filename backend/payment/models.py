from django.db import models
from users.models import User
from clothing.models import ClothingItem

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    amount = models.IntegerField()
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=45)
    sender = models.ForeignKey(User, related_name='sent_payments', on_delete=models.CASCADE, db_column='payment_sender_id')
    item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, db_column='payment_item_id')

    class Meta:
        db_table = 'payment'

    def __str__(self):
        return f"Payment {self.payment_id} - {self.sender.name}" 