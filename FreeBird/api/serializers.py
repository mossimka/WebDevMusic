from rest_framework import serializers

from .models import Product, Category, Order, OrderItem, User, CartItem, Cart, Favorite


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')

class ProductSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField(read_only=True)
    is_favorite = serializers.SerializerMethodField(read_only=True)
    category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())
    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'photo', 'photo_url', 'sub_photos',
                  'category', 'description', 'available_units',
                  'country', 'link', 'likes', 'is_favorite')
        read_only_fields = ['photo_url', 'is_favorite']

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and hasattr(obj.photo, 'url') and request:
            return self.context['request'].build_absolute_uri(obj.photo.url)
        else:
            return None

     # Новый метод для определения, в избранном ли товар
    def get_is_favorite(self, obj):
        user = self.context.get('request', None).user if self.context.get('request') else None # Safely get user
        if user and user.is_authenticated:
            # Check if a Favorite entry exists for this user and product
            return Favorite.objects.filter(user=user, product=obj).exists()
        return False # For anonymous users, always false

# --- НОВЫЙ СЕРИАЛИЗАТОР для Избранного ---
class FavoriteSerializer(serializers.ModelSerializer):
    # Для чтения используем вложенный ProductSerializer
    # Важно! Передаем контекст, чтобы is_favorite внутри ProductSerializer работал
    product = serializers.SerializerMethodField()

    # Поле для получения ID продукта при создании (POST)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    # Автоматически подставляем пользователя из запроса
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'product', 'product_id', 'added_on']
        read_only_fields = ['id', 'user', 'product', 'added_on']

    def get_product(self, obj):
        # При чтении (GET) передаем контекст в ProductSerializer
        serializer = ProductSerializer(obj.product, context=self.context)
        return serializer.data

    def validate(self, attrs):
        # Проверка на дубликаты перед созданием
        user = self.context['request'].user
        product = attrs['product'] # source='product' для product_id
        if Favorite.objects.filter(user=user, product=product).exists():
             raise serializers.ValidationError({"product_id": "Этот товар уже в избранном."})
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model= OrderItem
        fields = ('id', 'product', 'quantity', 'price', 'total_item_price')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ('id', 'user', 'date', 'items', 'total_order_price')


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    item_total_price = serializers.DecimalField(source='total_item_price', read_only=True, max_digits=10, decimal_places=2)
    product_price = serializers.DecimalField(source='product.price', read_only=True, max_digits=10, decimal_places=2)
    product_photo_url = serializers.SerializerMethodField(read_only=True)
    quantity = serializers.IntegerField(min_value=1)

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_name', 'product_price', 'product_photo_url', 'quantity', 'item_total_price')
        read_only_fields = ('id', 'item_total_price', 'product_name', 'product_price', 'product_photo_url')

    def get_product_photo_url(self, obj):
        if obj.product and obj.product.photo:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.product.photo.url)
        return None

    def validate_quantity(self, value):
        if value <= 0:
             raise serializers.ValidationError("Quantity must be a positive number.")
        return value


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_cart_price = serializers.DecimalField(source='total_price', read_only=True, max_digits=10, decimal_places=2)
    user = UserSerializer(read_only=True)
    class Meta:
        model = Cart
        fields = ('id', 'user', 'items', 'total_cart_price', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'items', 'total_cart_price', 'created_at', 'updated_at')