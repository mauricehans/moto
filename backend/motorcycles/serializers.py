from rest_framework import serializers
from .models import Motorcycle, MotorcycleImage

class MotorcycleImageSerializer(serializers.ModelSerializer):
    """Serializer pour les images de motos"""
    
    class Meta:
        model = MotorcycleImage
        fields = ['id', 'image', 'is_primary', 'created_at']

class MotorcycleSerializer(serializers.ModelSerializer):
    """Serializer pour les motos"""
    images = MotorcycleImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Motorcycle
        fields = [
            'id', 'brand', 'model', 'year', 'price', 'mileage',
            'engine', 'power', 'license', 'color', 'description',
            'is_sold', 'is_new', 'is_featured', 'created_at', 'updated_at', 'images'
        ]
        read_only_fields = ['created_at', 'updated_at']
