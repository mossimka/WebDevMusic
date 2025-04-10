from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    email = models.EmailField( #making email field as a main login
        unique=True,
        blank=False, # Email обязателен
        null=False   # и не может быть NULL
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] # username все еще нужен для createsuperuser

    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="custom_user_groups",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="custom_user_permissions",
        related_query_name="user",
    )
    def __str__(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.email


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.PositiveIntegerField()
    photo = models.ImageField(upload_to='products/photos/', blank=True, null=True)
    sub_photos = models.JSONField(default=list, blank=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    available_units = models.PositiveIntegerField(default=0)
    country = models.CharField(max_length=100, blank=True)
    link = models.URLField(blank=True)
    likes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name} - {self.price}"



class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Заказ #{self.id} от {self.user.email}"

    @property
    def total_price(self):
        return sum(item.total_item_price for item in self.items.all())

    class Meta:
        ordering = ['-date']


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        if not self.pk: # if it's a new object
             self.price = self.product.price
        super().save(*args, **kwargs)

    @property
    def total_item_price(self):
        return self.quantity * self.price

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    class Meta:
        unique_together = ('order', 'product')