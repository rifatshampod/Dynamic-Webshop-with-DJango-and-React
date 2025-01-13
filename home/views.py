from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from home.models import Product, User, Cart, Order
from django.shortcuts import get_object_or_404
from home.serializers import ProductSerializer, ProductCreateSerializer, ProductUpdateSerializer
from home.serializers import UserSerializer, UserRegistrationSerializer, UserLoginSerializer, ChangePasswordSerializer
from home.serializers import CartSerializer, CartCreateSerializer, CartEditSerializer
from home.serializers import OrderSerializer, OrderCreateSerializer

class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ProductSearchView(APIView):
    def get(self, request):
        # Get the 'title' query parameter
        title = request.query_params.get('title', '')

        if not title:
            return Response(
                {"error": "Title query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Search for products where the title matches or contains the search term
        products = Product.objects.filter(Q(name__icontains=title))

        if not products.exists():
            return Response(
                {"message": "No products found matching the search term."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serialize the products
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SingleProductView(APIView):
    def get(self, request, product_id):
        # Fetch the product based on the provided product_id
        product = get_object_or_404(Product, id=product_id)
        
        # Serialize the product
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserProductAPIView(APIView):
    def get(self, request):
        # Get user_id from query parameters
        user_id = request.query_params.get('user_id', None)

        if not user_id:
            return Response({"error": "user_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch order data for the given user
            product_items = Product.objects.filter(user_id=user_id)
            if not product_items.exists():
                return Response({"message": "No product found for this user."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ProductSerializer(product_items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProductsView(APIView):
    def get(self, request, user_id):
        products = Product.objects.filter(user_id=user_id)
        if not products.exists():
            return Response({"message": "No products found for this user."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ProductCreateView(APIView):
    def post(self, request):
        serializer = ProductCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Product created successfully", "product": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProductEditView(APIView):
    def put(self, request):
        # Fetch product_id and user_id from query parameters
        product_id = request.query_params.get('product_id', None)
        user_id = request.query_params.get('user_id', None)

        # Validate the presence of both query parameters
        if not product_id or not user_id:
            return Response(
                {"error": "Both product_id and user_id query parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the product exists and belongs to the specified user
        product = get_object_or_404(Product, id=product_id, user_id=user_id)

        # Serialize the data
        serializer = ProductUpdateSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Product updated successfully", "product": serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# User API views -------------------------------

class UserListView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserRegistrationAPIView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserLoginAPIView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChangePasswordAPIView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    

# Cart API Views -------------------------------

class UserCartAPIView(APIView):
    def get(self, request):
        # Get user_id from query parameters
        user_id = request.query_params.get('user_id', None)

        if not user_id:
            return Response({"error": "user_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch cart data for the given user
            cart_items = Cart.objects.filter(user_id=user_id)
            if not cart_items.exists():
                return Response({"message": "No cart items found for this user."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = CartSerializer(cart_items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CartListView(APIView):
    def get(self, request):
        carts = Cart.objects.all()
        serializer = CartSerializer(carts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CartCreateView(APIView):
    def post(self, request):
        serializer = CartCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Product added to cart successfully", "cart": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserCartView(APIView):
    def get(self, request, user_id):
        carts = Cart.objects.filter(user_id=user_id)
        if not carts.exists():
            return Response({"message": "No products found in cart for this user."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CartSerializer(carts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EditCartItemAPIView(APIView):
    def put(self, request):
        # Fetch cart_id from query parameters
        cart_id = request.query_params.get('cart_id', None)

        # Validate presence of cart_id
        if not cart_id:
            return Response({"error": "cart_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch cart item
            cart_item = Cart.objects.get(id=cart_id)
        except Cart.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the data
        serializer = CartEditSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Cart item updated successfully.", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteCartItemAPIView(APIView):
    def delete(self, request):
        # Fetch cart_id from query parameters
        cart_id = request.query_params.get('cart_id', None)

        # Validate presence of cart_id
        if not cart_id:
            return Response({"error": "cart_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch cart item
            cart_item = Cart.objects.get(id=cart_id)
            cart_item.delete()
            return Response({"message": "Cart item deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)


# Order API views ------------------------------------------------------------------

class OrderListView(APIView):
    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserOrderAPIView(APIView):
    def get(self, request):
        # Get user_id from query parameters
        user_id = request.query_params.get('user_id', None)

        if not user_id:
            return Response({"error": "user_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch order data for the given user
            order_items = Order.objects.filter(buyer_id=user_id)
            if not order_items.exists():
                return Response({"message": "No order found for this user."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = OrderSerializer(order_items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrderCreateView(APIView):
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Product purchased successfully", "cart": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserOrderView(APIView):
    def get(self, request, user_id):
        orders = Order.objects.filter(buyer_id=user_id)
        if not orders.exists():
            return Response({"message": "No order found in purchase history for this user."}, status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)