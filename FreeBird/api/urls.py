from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

# --- ЯВНО ИМПОРТИРУЕМ ВСЕ НУЖНЫЕ VIEWS ---
from .views import (
    # Category
    CategoryListCreateAPIView,
    CategoryRetrieveUpdateDestroyAPIView,
    # Product
    ProductListCreateAPIView,
    ProductRetrieveUpdateDestroyAPIView,
    # User/Auth
    PublicUserCreateAPIView,
    UserListCreateAPIView, # Вероятно, для админки?
    UserRetrieveUpdateDestroyAPIView, # Вероятно, для админки?
    CurrentUserAPIView,
    ValidateTokenView,
    # Order (Используем существующие и добавляем UserOrderListView)
    OrderListCreateAPIView, # Используем имя из твоего views.py
    OrderRetrieveUpdateDestroyAPIView, # Используем имя из твоего views.py
    UserOrderListView, # Новый View для истории заказов пользователя
    OrderItemListCreateAPIView, # Если используется
    OrderItemRetrieveUpdateDestroyAPIView, # Если используется
    # Cart
    CartDetailView,
    CartItemListCreateView,
    CartItemDetailView,
    # Favorite (Новые Views)
    FavoriteListCreateView,
    FavoriteDestroyByProductView,
)

urlpatterns = [
    # --- Authentication ---
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Используем свое имя 'login'
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('validate_token/', ValidateTokenView.as_view(), name='validate-token'),
    path('sign-up/', PublicUserCreateAPIView.as_view(), name='sign-up'), # Используем свое имя 'sign-up'
    path('me/', CurrentUserAPIView.as_view(), name='current-user'),

    # --- User Management (Admin?) ---
    # Если эти пути нужны, оставляем. Иначе можно удалить.
    path('users/', UserListCreateAPIView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserRetrieveUpdateDestroyAPIView.as_view(), name='user-detail'),

    # --- Categories ---
    # Используем полные имена View, импортированные выше
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
    # Этот путь из твоего файла. Он позволяет админам смотреть список, а пользователям создавать заказ.
    path('orders/', OrderListCreateAPIView.as_view(), name='order-list-create'),
    # НОВЫЙ путь для получения пользователем СВОЕЙ истории заказов
    path('my-orders/', UserOrderListView.as_view(), name='user-order-list'),
    # Путь для получения деталей ОДНОГО заказа (используем View из твоего файла)
    path('orders/<int:pk>/', OrderRetrieveUpdateDestroyAPIView.as_view(), name='order-detail'),

    # --- Order Items (Если эти пути действительно нужны) ---
    path('orders/<int:order_id>/items/', OrderItemListCreateAPIView.as_view(), name='orderitem-list-create'),
    path('orders/<int:order_id>/items/<int:item_id>/', OrderItemRetrieveUpdateDestroyAPIView.as_view(), name='orderitem-detail'),

    # --- Favorites (НОВЫЕ ПУТИ) ---
    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    path('favorites/product/<int:product_id>/', FavoriteDestroyByProductView.as_view(), name='favorite-destroy-by-product'),
]