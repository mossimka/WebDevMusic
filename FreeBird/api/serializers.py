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
                  'country', 'link', 'is_favorite')
        read_only_fields = ['photo_url', 'is_favorite']

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and hasattr(obj.photo, 'url') and request:
            return self.context['request'].build_absolute_uri(obj.photo.url)
        else:
            return None

    def get_is_favorite(self, obj):
        user = self.context.get('request', None).user if self.context.get('request') else None
        if user and user.is_authenticated:
            return Favorite.objects.filter(user=user, product=obj).exists()
        return False

class FavoriteSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'product', 'product_id', 'added_on']
        read_only_fields = ['id', 'user', 'product', 'added_on']

    def get_product(self, obj):
        serializer = ProductSerializer(obj.product, context=self.context)
        return serializer.data

    def validate(self, attrs):
        user = self.context['request'].user
        product = attrs['product']
        if Favorite.objects.filter(user=user, product=product).exists():
             raise serializers.ValidationError({"product_id": "This item is already in favorites."})
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

class OrderItemCreateSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    quantity = serializers.IntegerField(min_value=1)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    items_data = OrderItemCreateSerializer(many=True, write_only=True, required=True)#input
    user = UserSerializer(read_only=True)
    total_order_price = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'user', 'date', 'items', 'items_data', 'total_order_price')
        read_only_fields = ('id', 'date', 'user', 'total_order_price', 'items')

    def create(self, validated_data):
        items_data = validated_data.pop('items_data')
        user = self.context['request'].user
        order = Order.objects.create(user=user, total_order_price=0)

        calculated_total = 0
        try:
            for item_data in items_data:
                product = item_data['product']
                quantity = item_data['quantity']
                price_at_order_time = product.price

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=price_at_order_time
                )

                calculated_total += (quantity * price_at_order_time)

        except Exception as e:
            print(f"Error creating order items: {e}")
            raise e
        order.total_order_price = calculated_total
        order.save()
        return order


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    item_total_price = serializers.IntegerField(source='total_item_price', read_only=True)
    product_price = serializers.IntegerField(source='product.price', read_only=True)
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
    user = UserSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'user', 'items', 'created_at', 'updated_at', 'total_cart_price')
        read_only_fields = ('id', 'user', 'items', 'created_at', 'updated_at')
