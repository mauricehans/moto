from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Part, PartImage
from .serializers import CategorySerializer, PartSerializer, PartImageSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les catégories de pièces"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class PartViewSet(viewsets.ModelViewSet):
    """ViewSet pour les pièces détachées"""
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand']
    search_fields = ['name', 'brand', 'compatible_models', 'description']
    ordering_fields = ['price', 'stock', 'created_at']
    ordering = ['-created_at']

class PartImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour les images de pièces"""
    queryset = PartImage.objects.all()
    serializer_class = PartImageSerializer
