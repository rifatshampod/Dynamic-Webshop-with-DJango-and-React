from rest_framework import serializers
from home.models import User, Product, Cart, Order
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction  # To handle database transactions


# Product API Serializers --------------------------------

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'quantity', 'user_id', 'created_at']

class ProductCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)  # Accept user_id in the request
    user = serializers.StringRelatedField(read_only=True)  # Return user info in the response

    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'quantity', 'user_id', 'user']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        try:
            validated_data['user'] = User.objects.get(id=user_id)
        except ObjectDoesNotExist:
            raise serializers.ValidationError({"user_id": "User with this ID does not exist."})
        return super().create(validated_data)
    
class ProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'quantity']


# User API serializers --------------------------------------------

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'password']

# Cart API serializers ---------------------------------------------

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['id','product_id', 'user_id', 'quantity']

class CartCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)  # Accept user_id in the request
    user = serializers.StringRelatedField(read_only=True)  # Return user info in the response

    product_id = serializers.IntegerField(write_only=True)  # Accept user_id in the request
    product = serializers.StringRelatedField(read_only=True)  # Return user info in the response

    class Meta:
        model = Cart
        fields = ['quantity','product_id', 'user_id', 'user', 'product']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        product_id = validated_data.pop('product_id')

        try:
            validated_data['user'] = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"user_id": "User with this ID does not exist."})

        try:
            validated_data['product'] = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError({"product_id": "Product with this ID does not exist."})

        return super().create(validated_data)
    
class CartEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['quantity']

# Order API serializers ---------------------------------------------

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id','product_id', 'buyer_id', 'quantity', 'total_price', 'purchase_date']

class OrderCreateSerializer(serializers.ModelSerializer):
    buyer_id = serializers.IntegerField(write_only=True)  # Accept buyer_id in the request
    product_id = serializers.IntegerField(write_only=True)  # Accept product_id in the request
    buyer = serializers.StringRelatedField(read_only=True)  # Return buyer info in the response
    product = serializers.StringRelatedField(read_only=True)  # Return product info in the response

    class Meta:
        model = Order
        fields = ['quantity', 'product_id', 'buyer_id', 'buyer', 'product', 'total_price', 'purchase_date']

    def create(self, validated_data):
        buyer_id = validated_data.pop('buyer_id')
        product_id = validated_data.pop('product_id')

        try:
            validated_data['buyer'] = User.objects.get(id=buyer_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"buyer_id": "User with this ID does not exist."})

        try:
            validated_data['product'] = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError({"product_id": "Product with this ID does not exist."})

        # Use a database transaction to ensure atomicity
        with transaction.atomic():
            # Create the order
            order = super().create(validated_data)

            # Delete all cart items for the user
            Cart.objects.filter(user_id=buyer_id).delete()

        return order
    
