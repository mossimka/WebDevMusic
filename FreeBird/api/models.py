from django.db import models

class Category:
    name = models.CharField()

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.PositiveIntegerField()
    photo = models.ImageField(upload_to='products/photos/')
    sub_photos = models.JSONField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE())
    description = models.TextField()
    available_units = models.PositiveIntegerField()
    country = models.CharField(max_length=100)
    link = models.URLField()
    likes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name} - {self.price} - {self.type}"

class User(models.Model):
    email = models.EmailField()
    password = models.CharField(255)
    role = models.CharField(100)

class Order(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField()
    products = models.ManyToManyField(Product, through='OrderItem')

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.FloatField()

    class Meta:
        unique_together = ('order', 'product') # уникальная пара заказ-продукт