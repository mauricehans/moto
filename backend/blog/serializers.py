from rest_framework import serializers
from .models import Category, Post

class CategorySerializer(serializers.ModelSerializer):
    """Serializer pour les catégories de blog"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class PostSerializer(serializers.ModelSerializer):
    """Serializer pour les articles de blog"""
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), write_only=True, source='category', required=False)
    title = serializers.CharField(required=True, allow_blank=False)
    content = serializers.CharField(required=True, allow_blank=False)
    slug = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'category', 'category_id',
            'content', 'image', 'is_published', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['image', 'created_at', 'updated_at']
