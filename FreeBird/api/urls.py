from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from .views import (
    # Category
    CategoryListCreateAPIView,
    CategoryRetrieveUpdateDestroyAPIView,
    # Product
    ProductListCreateAPIView,
    ProductRetrieveUpdateDestroyAPIView,
    # User/Auth
    PublicUserCreateAPIView,
    UserListCreateAPIView,
    UserRetrieveUpdateDestroyAPIView,
    CurrentUserAPIView,
    ValidateTokenView,
    # Order
    OrderListCreateAPIView,
    OrderRetrieveUpdateDestroyAPIView,
    UserOrderListView,
    OrderItemListCreateAPIView,
    OrderItemRetrieveUpdateDestroyAPIView,
    # Cart
    CartDetailView,
    CartItemListCreateView,
    CartItemDetailView,
    # Favorite
    FavoriteListCreateView,
    FavoriteDestroyByProductView,
)
from . import views
urlpatterns = [
    # --- Authentication ---
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Используем свое имя 'login'
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('validate_token/', ValidateTokenView.as_view(), name='validate-token'),
    path('sign-up/', PublicUserCreateAPIView.as_view(), name='sign-up'), # Используем свое имя 'sign-up'
    path('me/', CurrentUserAPIView.as_view(), name='current-user'),

    # --- User Management (Admin?) ---
    path('users/', UserListCreateAPIView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserRetrieveUpdateDestroyAPIView.as_view(), name='user-detail'),

    # --- Categories ---
    path('categories/', CategoryListCreateAPIView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category-detail'),

    # --- Products ---
    path('products/', ProductListCreateAPIView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductRetrieveUpdateDestroyAPIView.as_view(), name='product-detail'),

    # --- Cart ---
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/items/', CartItemListCreateView.as_view(), name='cartitem-list-create'),
    path('cart/items/<int:item_id>/', CartItemDetailView.as_view(), name='cartitem-detail'),

    # --- Orders ---
    path('orders/', OrderListCreateAPIView.as_view(), name='order-list-create'),
    path('my-orders/', UserOrderListView.as_view(), name='user-order-list'),
    path('orders/<int:pk>/', OrderRetrieveUpdateDestroyAPIView.as_view(), name='order-detail'),

    # --- Order Items
    path('orders/<int:order_id>/items/', OrderItemListCreateAPIView.as_view(), name='orderitem-list-create'),
    path('orders/<int:order_id>/items/<int:item_id>/', OrderItemRetrieveUpdateDestroyAPIView.as_view(), name='orderitem-detail'),

    # --- Favorites
    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    path('favorites/product/<int:product_id>/', FavoriteDestroyByProductView.as_view(), name='favorite-destroy-by-product'),

    # --- FBV based API 
    path('status/', views.api_status, name='api-status'),
    path('cart/count/', views.cart_item_count, name='cart-item-count'),
]