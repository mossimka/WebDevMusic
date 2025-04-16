# views.py
from django.core.exceptions import PermissionDenied, ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Product, User, Category, Order, OrderItem, Cart, CartItem
from .serializers import (
    ProductSerializer, UserSerializer, CategorySerializer,
    OrderSerializer, OrderItemSerializer, CartItemSerializer, CartSerializer
)

class CategoryListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: /api/categories/
    POST: /api/categories/
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.prefetch_related('items', 'items__product')
        if not user.is_staff:
            queryset = queryset.filter(user=user)
        return queryset


class OrderItemListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        order_id = self.kwargs.get('order_id')
        order = get_object_or_404(Order, pk=order_id)
        if not user.is_staff and order.user != user:
            return OrderItem.objects.none()
        return OrderItem.objects.filter(order=order).select_related('product')

    def perform_create(self, serializer):
        order_id = self.kwargs.get('order_id')
        order = get_object_or_404(Order, pk=order_id)
        if not self.request.user.is_staff and order.user != self.request.user:
             raise PermissionDenied("You do not have permission to modify this order.")
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        serializer.save(order=order, price=product.price)


class OrderItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated] # Or custom permission
    lookup_url_kwarg = 'item_id' # Specify the URL keyword argument for the item's PK

    def get_queryset(self):
        # Filter items based on the order_id and item_id in the URL and user ownership
        user = self.request.user
        order_id = self.kwargs.get('order_id')
        item_id = self.kwargs.get('item_id')

        # Ensure the order exists and belongs to the user (or user is staff)
        order = get_object_or_404(Order, pk=order_id)
        if not user.is_staff and order.user != user:
            return OrderItem.objects.none() # Return empty queryset if no permission

        # Filter for the specific item within the specific order
        return OrderItem.objects.filter(order=order, pk=item_id).select_related('product')

class ValidateTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"detail": "Token is valid"})


class CartDetailView(generics.RetrieveDestroyAPIView):
    """
    GET: /api/cart/ - Retrieve the current user's cart.
    DELETE: /api/cart/ - Clear all items from the current user's cart.
    """
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get the cart for the current user, or create one if it doesn't exist.
        # This ensures every authenticated user can access a cart object.
        cart, created = Cart.objects.prefetch_related(
            'items', 'items__product'
        ).get_or_create(user=self.request.user)
        return cart

    def perform_destroy(self, instance):
        CartItem.objects.filter(cart=instance).delete()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_OK)


class CartItemListCreateView(generics.ListCreateAPIView):
    """
    GET: /api/cart/items/ - List all items in the current user's cart.
    POST: /api/cart/items/ - Add a product to the cart or update quantity if it exists.
    """
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        cart, created = Cart.objects.get_or_create(user=user)
        return CartItem.objects.filter(cart=cart).select_related('product')

    def create(self, request, *args, **kwargs):
        # Use get_or_create to ensure a cart exists
        cart, cart_created = Cart.objects.get_or_create(user=request.user) # <-- FIX HERE

        product = get_object_or_404(Product, pk=request.data.get('product'))
        quantity = int(request.data.get('quantity', 1))

        if quantity <= 0:
            return Response(
                {"quantity": ["Quantity must be a positive number."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        if product.available_units < quantity:
             return Response(
                 {"detail": f"Not enough stock for {product.name}. Available: {product.available_units}"},
                 status=status.HTTP_400_BAD_REQUEST
             )

        cart_item, item_created = CartItem.objects.get_or_create( # renamed 'created' variable
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not item_created: # Use the renamed variable
            new_quantity = cart_item.quantity + quantity
            if product.available_units < new_quantity:
                 return Response(
                     {"detail": f"Not enough stock for {product.name} to add {quantity}. Current in cart: {cart_item.quantity}. Available: {product.available_units}"},
                     status=status.HTTP_400_BAD_REQUEST
                 )
            cart_item.quantity = new_quantity
            cart_item.save()

        serializer = self.get_serializer(cart_item)
        headers = self.get_success_headers(serializer.data)
        # Use item_created here
        return Response(serializer.data, status=status.HTTP_201_CREATED if item_created else status.HTTP_200_OK, headers=headers)


class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: /api/cart/items/{item_id}/ - Retrieve a specific cart item.
    PUT/PATCH: /api/cart/items/{item_id}/ - Update quantity of a specific cart item.
    DELETE: /api/cart/items/{item_id}/ - Remove a specific item from the cart.
    """
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'item_id'

    def get_queryset(self):
        user = self.request.user
        cart, created = Cart.objects.get_or_create(user=user)
        return CartItem.objects.filter(cart=cart).select_related('product')

    def perform_update(self, serializer):
        instance = serializer.instance #
        new_quantity = serializer.validated_data.get('quantity', instance.quantity)

        if instance.product.available_units < new_quantity:
            raise ValidationError(f"Not enough stock for {instance.product.name}. Available: {instance.product.available_units}")
        serializer.save()

