"""
Parts serializers
"""
from rest_framework import serializers
from .models import Category, Part, PartImage


class CategorySerializer(serializers.ModelSerializer):
    """
    Category serializer
    """
    subcategories = serializers.SerializerMethodField()
    parts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent', 'subcategories', 'parts_count']
        read_only_fields = ['slug']

    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return CategorySerializer(obj.subcategories.filter(is_deleted=False), many=True).data
        return []

    def get_parts_count(self, obj):
        return obj.parts.filter(is_deleted=False, is_available=True).count()


class PartImageSerializer(serializers.ModelSerializer):
    """
    Part image serializer
    """
    class Meta:
        model = PartImage
        fields = ['id', 'image', 'is_primary', 'alt_text', 'created_at']
        read_only_fields = ['created_at']


class PartListSerializer(serializers.ModelSerializer):
    """
    Part list serializer (lighter version)
    """
    category = CategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Part
        fields = [
            'id', 'name', 'slug', 'category', 'brand', 'price',
            'stock', 'condition', 'is_available', 'is_featured',
            'primary_image'
        ]

    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return PartImageSerializer(primary_image).data
        return None


class PartSerializer(serializers.ModelSerializer):
    """
    Part detail serializer
    """
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    images = PartImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Part
        fields = [
            'id', 'name', 'slug', 'category', 'category_id', 'brand',
            'part_number', 'compatible_models', 'price', 'stock',
            'condition', 'description', 'specifications', 'weight',
            'dimensions', 'is_available', 'is_featured', 'images',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'is_available', 'created_at', 'updated_at']