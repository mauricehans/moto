"""
Motorcycle serializers
"""
from rest_framework import serializers
from .models import Motorcycle, MotorcycleImage


class MotorcycleImageSerializer(serializers.ModelSerializer):
    """
    Motorcycle image serializer
    """
    class Meta:
        model = MotorcycleImage
        fields = ['id', 'image', 'is_primary', 'alt_text', 'created_at']
        read_only_fields = ['created_at']


class MotorcycleSerializer(serializers.ModelSerializer):
    """
    Motorcycle serializer
    """
    images = MotorcycleImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Motorcycle
        fields = [
            'id', 'brand', 'model', 'year', 'price', 'mileage',
            'engine', 'power', 'license', 'color', 'description',
            'features', 'is_sold', 'is_featured', 'slug',
            'images', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']


class MotorcycleListSerializer(serializers.ModelSerializer):
    """
    Motorcycle list serializer (lighter version)
    """
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Motorcycle
        fields = [
            'id', 'brand', 'model', 'year', 'price', 'mileage',
            'engine', 'power', 'license', 'color', 'is_sold',
            'is_featured', 'slug', 'primary_image'
        ]

    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return MotorcycleImageSerializer(primary_image).data
        return None