from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from home.models import Product, User
from django.shortcuts import get_object_or_404
from home.serializers import ProductSerializer
from home.serializers import ProductCreateSerializer
from home.serializers import ProductUpdateSerializer
from home.serializers import UserSerializer

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
    
class UserListView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)