from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from home.models import Product, User, Cart, Order
from django.shortcuts import get_object_or_404
from home.serializers import ProductSerializer, ProductCreateSerializer, ProductUpdateSerializer
from home.serializers import UserSerializer
from home.serializers import CartSerializer, CartCreateSerializer, CartEditSerializer
from home.serializers import OrderSerializer, OrderCreateSerializer

class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    def put(self, request, user_id, product_id):
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
    

# Cart API Views -------------------------------

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
    def put(self, request, cart_id):
        try:
            cart_item = Cart.objects.get(id=cart_id)
        except Cart.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CartEditSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Cart item updated successfully.", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteCartItemAPIView(APIView):
    def delete(self, request, cart_id):
        try:
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

class OrderCreateView(APIView):
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Product added to cart successfully", "cart": serializer.data},
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