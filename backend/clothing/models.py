from django.db import models
from users.models import User

class ClothingItem(models.Model):
    item_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=45)  # MySQL: varchar(45)
    description = models.CharField(max_length=255)  # Increased length for better descriptions
    size = models.CharField(max_length=45)  # MySQL: varchar(45)
    price = models.IntegerField()  # MySQL: int
    condition = models.CharField(max_length=45)  # MySQL: varchar(45)
    tags = models.CharField(max_length=255)  # Increased length for multiple tags
    location = models.CharField(max_length=255, null=True, blank=True)  # MySQL: varchar(255), nullable
    clothing_user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='clothing_user_id')  # Maps to MySQL column
    image = models.ImageField(upload_to='clothing_images/', null=True, blank=True)  # Use ImageField for file uploads
    removed = models.BooleanField(default=False)  # Add this field
    removal_reason = models.CharField(max_length=255, null=True, blank=True)  # Add this field
    removed_at = models.DateTimeField(null=True, blank=True)  # Add this field

    class Meta:
        db_table = 'clothing_item'  # Matches MySQL table name exactly
        managed = False  # Prevents Django from modifying the table schema

    def __str__(self):
        return self.title
