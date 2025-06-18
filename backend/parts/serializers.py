from rest_framework import serializers
from .models import Category, Part, PartImage

class CategorySerializer(serializers.ModelSerializer):
    """Serializer pour les catégories de pièces"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class PartImageSerializer(serializers.ModelSerializer):
    """Serializer pour les images de pièces"""
    
    class Meta:
        model = PartImage
        fields = ['id', 'image', 'is_primary', 'created_at']

class PartSerializer(serializers.ModelSerializer):
    """Serializer pour les pièces détachées"""
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    images = PartImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Part
        fields = [
            'id', 'name', 'category', 'category_id', 'brand',
            'compatible_models', 'price', 'stock', 'description',
            'created_at', 'updated_at', 'images'
        ]
        read_only_fields = ['created_at', 'updated_at']
