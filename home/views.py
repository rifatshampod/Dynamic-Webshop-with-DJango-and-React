from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from home.models import Product
from home.serializers import ProductSerializer

class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
