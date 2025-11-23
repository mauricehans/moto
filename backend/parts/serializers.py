from rest_framework import serializers
from django.conf import settings
from .models import Category, Part, PartImage

class CategorySerializer(serializers.ModelSerializer):
    """Serializer pour les catégories de pièces"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class PartImageSerializer(serializers.ModelSerializer):
    """Serializer pour les images de pièces"""
    image = serializers.SerializerMethodField()

    class Meta:
        model = PartImage
        fields = ['id', 'image', 'is_primary', 'created_at']

    def get_image(self, obj):
        val = (obj.image or '').strip()
        if val.startswith('http://') or val.startswith('https://'):
            idx = val.find('/media/')
            if idx != -1:
                return val[idx:]
            return val
        return val if val.startswith('/media/') else f"{settings.MEDIA_URL}{val}"

class PartSerializer(serializers.ModelSerializer):
    """Serializer pour les pièces détachées"""
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    category_name = serializers.CharField(write_only=True, required=False)
    images = PartImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Part
        fields = [
            'id', 'name', 'category', 'category_id', 'category_name', 'brand',
            'compatible_models', 'price', 'stock', 'condition', 'description',
            'is_available', 'is_featured',
            'created_at', 'updated_at', 'images'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        category_name = validated_data.pop('category_name', None)
        category_id = validated_data.pop('category_id', None)
        
        # Si category_id n'est pas fourni mais category_name l'est, créer ou récupérer la catégorie
        if not category_id and category_name:
            from django.utils.text import slugify
            category, created = Category.objects.get_or_create(
                name=category_name,
                defaults={'slug': slugify(category_name)}
            )
            validated_data['category'] = category
        elif category_id:
            validated_data['category_id'] = category_id
        
        return super().create(validated_data)
