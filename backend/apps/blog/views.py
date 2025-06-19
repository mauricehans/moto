"""
Blog views
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from core.permissions import IsAdminOrReadOnly
from .models import Category, Post
from .serializers import CategorySerializer, PostSerializer, PostListSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Category viewset (read-only)
    """
    queryset = Category.objects.filter(is_deleted=False)
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering = ['name']


class PostViewSet(viewsets.ModelViewSet):
    """
    Post viewset
    """
    queryset = Post.objects.filter(is_deleted=False)
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'author', 'is_published']
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['published_at', 'created_at', 'views_count']
    ordering = ['-published_at', '-created_at']
    lookup_field = 'slug'
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Only show published posts for non-staff users
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)
        
        return queryset

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment view count"""
        instance = self.get_object()
        
        # Increment view count
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def published(self, request):
        """Get only published posts"""
        queryset = self.get_queryset().filter(is_published=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = PostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PostListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular posts (most viewed)"""
        queryset = self.get_queryset().filter(is_published=True).order_by('-views_count')[:10]
        serializer = PostListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def publish(self, request, slug=None):
        """Publish a post"""
        post = self.get_object()
        post.is_published = True
        post.published_at = timezone.now()
        post.save()
        
        serializer = self.get_serializer(post)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def unpublish(self, request, slug=None):
        """Unpublish a post"""
        post = self.get_object()
        post.is_published = False
        post.save()
        
        serializer = self.get_serializer(post)
        return Response(serializer.data)