"""
Motorcycle views
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from core.permissions import IsOwnerOrReadOnly
from .models import Motorcycle, MotorcycleImage
from .serializers import MotorcycleSerializer, MotorcycleListSerializer, MotorcycleImageSerializer
from .services import MotorcycleService, MotorcycleImageService


class MotorcycleViewSet(viewsets.ModelViewSet):
    """
    Motorcycle viewset
    """
    queryset = Motorcycle.objects.filter(is_deleted=False)
    serializer_class = MotorcycleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['brand', 'year', 'license', 'is_sold', 'is_featured']
    search_fields = ['brand', 'model', 'description']
    ordering_fields = ['price', 'year', 'mileage', 'created_at']
    ordering = ['-created_at']
    lookup_field = 'slug'
    permission_classes = [IsOwnerOrReadOnly]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.motorcycle_service = MotorcycleService()

    def get_serializer_class(self):
        if self.action == 'list':
            return MotorcycleListSerializer
        return MotorcycleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Apply service-level filtering
        filters = {}
        for key, value in self.request.query_params.items():
            if key in ['search', 'brand', 'min_price', 'max_price', 'min_year', 'max_year', 'license']:
                filters[key] = value
        
        if filters:
            queryset = self.motorcycle_service.search_motorcycles(filters)
        
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured motorcycles"""
        limit = int(request.query_params.get('limit', 6))
        motorcycles = self.motorcycle_service.get_featured_motorcycles(limit)
        serializer = MotorcycleListSerializer(motorcycles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get available motorcycles (not sold)"""
        motorcycles = self.motorcycle_service.get_available_motorcycles()
        page = self.paginate_queryset(motorcycles)
        if page is not None:
            serializer = MotorcycleListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = MotorcycleListSerializer(motorcycles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_sold(self, request, slug=None):
        """Mark a motorcycle as sold"""
        motorcycle = self.get_object()
        updated_motorcycle = self.motorcycle_service.mark_as_sold(motorcycle)
        serializer = self.get_serializer(updated_motorcycle)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get motorcycle statistics"""
        stats = self.motorcycle_service.get_motorcycle_statistics()
        return Response(stats)


class MotorcycleImageViewSet(viewsets.ModelViewSet):
    """
    Motorcycle image viewset
    """
    queryset = MotorcycleImage.objects.filter(is_deleted=False)
    serializer_class = MotorcycleImageSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.image_service = MotorcycleImageService()

    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None):
        """Set an image as primary"""
        image = self.get_object()
        updated_image = self.image_service.set_primary_image(image)
        serializer = self.get_serializer(updated_image)
        return Response(serializer.data)