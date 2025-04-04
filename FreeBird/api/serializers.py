from rest_framework import serializers

from .models import Product, Category, Order, OrderItem, User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')

class ProductSerizlizer(serializers.ModelSerializer):
    class Meta:
        model =Product
        fields = ('id', 'name', 'price', 'photo',
                  'sub_photos', 'category', 'description', 'available_units',
                  'country', 'link', 'likes')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role')

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('id', 'user_id', 'date', 'products')

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model= OrderItem
        fields = ('id', 'order', 'product', 'quantity', 'price')