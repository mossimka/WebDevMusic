from django.contrib import admin

from .models import Product, User, Order, Category, Cart, Favorite, OrderItem


# Register your models here.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "category", "available_units")
    search_fields = ("id", "name", "category")

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "date")
    search_fields = ("id", "user", "date")

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user")
    search_fields = ("id", "user")

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'added_on')
    list_filter = ('added_on', 'user')
    search_fields = ('user__username', 'product__name')


@admin.register(OrderItem)
class OrderItem(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
