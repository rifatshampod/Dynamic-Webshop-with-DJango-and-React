from rest_framework import serializers
from home.models import User, Product, Cart
from django.core.exceptions import ObjectDoesNotExist


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
        fields = ['product', 'user', 'quantity']

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

    
