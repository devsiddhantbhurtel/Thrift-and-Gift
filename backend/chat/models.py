# backend/chat/models.py
from django.db import models
from users.models import User

class Chat(models.Model):
    chat_id = models.AutoField(primary_key=True)  # Changed to AutoField
    sender = models.ForeignKey(
        User, 
        related_name='sent_messages', 
        on_delete=models.CASCADE, 
        db_column="sender_id"
    )
    receiver = models.ForeignKey(
        User, 
        related_name='received_messages', 
        on_delete=models.CASCADE, 
        db_column="receiver_id"
    )
    message = models.CharField(max_length=255)  # ✅ Matches DB type (VARCHAR(45))
    sent_at = models.DateTimeField(auto_now_add=True)  # Automatically set the timestamp when the message is created

    class Meta:
        db_table = "chat"  # ✅ Ensures correct table mapping
        managed = True  # Changed to True to allow Django to manage the table

    def __str__(self):
        return f"Chat {self.chat_id} - {self.sender.name} to {self.receiver.name}"
