from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    photo = models.TextField()


class User(models.Model):
    email = models.EmailField()
    password = models.CharField(255)

class Order(models.Model):
    userId = models.ForeignKey(User, on_delete=models.CASCADE())
    date = models.DateTimeField()
    products = models.ManyToManyField(Product, through='OrderItem')

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.FloatField()

    class Meta:
        unique_together = ('order', 'product') # уникальная пара заказ-продукт
