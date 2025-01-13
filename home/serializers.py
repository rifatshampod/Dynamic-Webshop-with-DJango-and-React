from rest_framework import serializers
from home.models import User, Product, Cart, Order
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction  # To handle database transactions
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import AccessToken


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
    product = ProductSerializer(read_only=True)  # Use the related Product object

    class Meta:
        model = Cart
        fields = ['id', 'product_id', 'user_id', 'quantity', 'product']


class CartCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)  # Accept user_id in the request
    user = serializers.StringRelatedField(read_only=True)  # Return user info in the response

    product_id = serializers.IntegerField(write_only=True)  # Accept product_id in the request
    product = serializers.StringRelatedField(read_only=True)  # Return product info in the response

    class Meta:
        model = Cart
        fields = ['quantity', 'product_id', 'user_id', 'user', 'product']

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

        # Check if the product is already in the cart for the user
        existing_cart_item = Cart.objects.filter(user_id=user_id, product_id=product_id).first()
        if existing_cart_item:
            raise serializers.ValidationError(
                {"detail": "This product is already in the cart for this user."}
            )

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
        quantity = validated_data.get('quantity')

        try:
            # Retrieve the buyer
            validated_data['buyer'] = User.objects.get(id=buyer_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"buyer_id": "User with this ID does not exist."})

        try:
            # Retrieve the product
            product = Product.objects.get(id=product_id)
            validated_data['product'] = product
        except Product.DoesNotExist:
            raise serializers.ValidationError({"product_id": "Product with this ID does not exist."})

        # Check if the requested quantity is available in stock
        if product.quantity < quantity:
            raise serializers.ValidationError(
                {"quantity": f"Only {product.quantity} items available in stock."}
            )

        # Use a database transaction to ensure atomicity
        with transaction.atomic():
            # Deduct the quantity from the product stock
            product.quantity -= quantity
            product.save()

            # Create the order
            order = super().create(validated_data)

            # Delete all cart items for the user
            Cart.objects.filter(user_id=buyer_id).delete()

        return order
    
    
# User API serializers --------------------------------

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Create a user instance with hashed password
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.password = make_password(validated_data['password'])  # Hash the password
        user.save()
        return user

# class UserLoginSerializer(serializers.Serializer):
#     username = serializers.CharField()
#     password = serializers.CharField(write_only=True)

#     def validate(self, data):
#         try:
#             user = User.objects.get(username=data['username'])
#             if not check_password(data['password'], user.password):
#                 raise serializers.ValidationError("Incorrect password.")
#         except User.DoesNotExist:
#             raise serializers.ValidationError("User does not exist.")

#         return {"username": user.username, "user_id": user.id, "access_token": user.access_token}

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = User.objects.get(username=data['username'])
            if not check_password(data['password'], user.password):
                raise serializers.ValidationError("Incorrect password.")
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        # Generate only the access token
        access_token = AccessToken.for_user(user)

        return {
            "username": user.username,
            "user_id": user.id,
            "access_token": str(access_token),
        }
    
class ChangePasswordSerializer(serializers.Serializer):
    username = serializers.CharField()
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = User.objects.get(username=data['username'])
            if not check_password(data['old_password'], user.password):
                raise serializers.ValidationError("Incorrect old password.")
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        return data

    def save(self):
        user = User.objects.get(username=self.validated_data['username'])
        user.password = make_password(self.validated_data['new_password'])  # Hash the new password
        user.save()
