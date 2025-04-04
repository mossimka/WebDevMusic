from django.contrib import admin

from .models import Product, User, Order, Category


# Register your models here.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "category", "available_units")
    search_fields = ("id", "name", "category")

@admin.register(User)
class VacancyAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "role")
    search_fields = ("id", "email", "role")

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user_id", "date", "products")
    search_fields = ("id", "user_id", "date", "products")

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")