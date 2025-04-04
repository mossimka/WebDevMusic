from django.db import models

class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=100)

    def __str__(self):
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
        if not self.pk: # Если это новый объект
             self.price = self.product.price
        super().save(*args, **kwargs)

    @property
    def total_item_price(self):
        return self.quantity * self.price

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    class Meta:
        unique_together = ('order', 'product')