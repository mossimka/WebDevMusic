# views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Product, User, Category, Order, OrderItem
from .serializers import (
    ProductSerializer, UserSerializer, CategorySerializer,
    OrderSerializer, OrderItemSerializer
)

class CategoryListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: /api/categories/
    POST: /api/categories/
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissons(self):
        if self.request.method == 'POST':
            return (IsAdminUser(),)
        return (AllowAny(),)

class CategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: /api/categories/{id}/
    PUT/PATCH: /api/categories/{id}/
    DELETE: /api/categories/{id}/
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: /api/products/
    POST: /api/products/
    """
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer

class ProductRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: /api/products/{id}/
    PUT/PATCH: /api/products/{id}/
    DELETE: /api/products/{id}/
    """
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    # permission_classes = [IsAdminUser] # Пример

class PublicUserCreateAPIView(generics.CreateAPIView):
    """
    POST: /api/sign-up/
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: /api/users/
    POST: /api/users/
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: /api/users/{id}/
    PUT/PATCH: /api/users/{id}/
    DELETE: /api/users/{id}/
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class OrderListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: /api/orders/
    POST: /api/orders/
    """
    serializer_class = OrderSerializer
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.prefetch_related('items', 'items__product').all()
        return Order.objects.filter(user=user).prefetch_related('items', 'items__product')


class OrderRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: /api/orders/{id}/
    PUT/PATCH: /api/orders/{id}/
    DELETE: /api/orders/{id}/
    """
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
             return Order.objects.prefetch_related('items', 'items__product').all()
        return Order.objects.filter(user=user).prefetch_related('items', 'items__product')


class OrderItemListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: /api/order-items/
         Лучше GET: /api/orders/{order_id}/items/
    POST: /api/order-items/
    """
    queryset = OrderItem.objects.select_related('order', 'product').all()
    serializer_class = OrderItemSerializer

class OrderItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: /api/order-items/{id}/ 
    PUT/PATCH: /api/order-items/{id}/
    DELETE: /api/order-items/{id}/
    """
    queryset = OrderItem.objects.select_related('order', 'product').all()
    serializer_class = OrderItemSerializer

class ValidateTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"detail": "Token is valid"})