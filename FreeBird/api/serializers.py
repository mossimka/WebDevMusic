from rest_framework import serializers

from .models import Product, Category, Order, OrderItem, User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')

from rest_framework import serializers
from django.urls import reverse

class ProductSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'photo', 'photo_url',
                  'category', 'description', 'available_units',
                  'country', 'link', 'likes')

    def get_photo_url(self, obj):
        if obj.photo:
            return self.context['request'].build_absolute_uri(obj.photo.url)
        else:
            return None


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role')

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('id', 'user_id', 'date')

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model= OrderItem
        fields = ('id', 'order', 'product', 'quantity', 'price')
