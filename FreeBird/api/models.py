from django.db import models

class Product(models.Model):
    TYPE_CHOICES = [    #заглушка, надо переделать
        ('brass', 'Brass'),
        ('guitars', 'Guitars'),
    ]
    
    name = models.CharField(max_length=255)
    price = models.PositiveIntegerField()
    photo = models.ImageField(upload_to='products/photos/')
    sub_photos = models.JSONField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField()
    available_units = models.PositiveIntegerField()
    country = models.CharField(max_length=100)
    link = models.URLField()
    rating = models.FloatField()
    likes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
    
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
