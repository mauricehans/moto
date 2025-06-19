"""
Blog serializers
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Post

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    """
    Category serializer
    """
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'posts_count']
        read_only_fields = ['slug']

    def get_posts_count(self, obj):
        return obj.posts.filter(is_published=True, is_deleted=False).count()


class AuthorSerializer(serializers.ModelSerializer):
    """
    Author serializer for blog posts
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class PostListSerializer(serializers.ModelSerializer):
    """
    Post list serializer (lighter version)
    """
    category = CategorySerializer(read_only=True)
    author = AuthorSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'category', 'author', 'excerpt',
            'image', 'is_published', 'published_at', 'views_count',
            'tags', 'created_at'
        ]


class PostSerializer(serializers.ModelSerializer):
    """
    Post detail serializer
    """
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    author = AuthorSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'category', 'category_id', 'author',
            'content', 'excerpt', 'image', 'is_published', 'published_at',
            'views_count', 'tags', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'author', 'views_count', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)