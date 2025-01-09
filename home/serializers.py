from rest_framework import serializers
from home.models import User, Product
from django.core.exceptions import ObjectDoesNotExist

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