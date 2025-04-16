from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from .views import PublicUserCreateAPIView, CurrentUserAPIView, ValidateTokenView

urlpatterns = [
    path('categories', views.CategoryListCreateAPIView.as_view(), name='category-list-create'),
    path('categories/<int:pk>', views.CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category-detail'),

    path('products', views.ProductListCreateAPIView.as_view(), name='product-list-create'),
    path('products/<int:pk>', views.ProductRetrieveUpdateDestroyAPIView.as_view(), name='product-detail'),

    path('users', views.UserListCreateAPIView.as_view(), name='user-list-create'),
    path('users/<int:pk>', views.UserRetrieveUpdateDestroyAPIView.as_view(), name='user-detail'),

    path('orders', views.OrderListCreateAPIView.as_view(), name='order-list-create'),
    path('orders/<int:pk>', views.OrderRetrieveUpdateDestroyAPIView.as_view(), name='order-detail'),

    path('orders/<int:pk>/items', views.OrderItemListCreateAPIView.as_view(), name='orderitem-list-create'),
    path('orders/<int:pk>/items/<int:pk>', views.OrderItemRetrieveUpdateDestroyAPIView.as_view(), name='orderitem-detail'),

    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path("validate_token/", ValidateTokenView.as_view(), name="validate-token"),

    path('sign-up/', PublicUserCreateAPIView.as_view()),

    path('me/', CurrentUserAPIView.as_view(), name='current-user'),

    path('cart/', views.CartDetailView.as_view(), name='cart-detail'),
    path('cart/items/', views.CartItemListCreateView.as_view(), name='cartitem-list-create'),
    path('cart/items/<int:item_id>/', views.CartItemDetailView.as_view(), name='cartitem-detail'),
]