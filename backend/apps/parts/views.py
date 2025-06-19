"""
Parts views
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from core.permissions import IsAdminOrReadOnly
from .models import Category, Part, PartImage
from .serializers import CategorySerializer, PartSerializer, PartListSerializer, PartImageSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Parts category viewset (read-only)
    """
    queryset = Category.objects.filter(is_deleted=False)
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering = ['name']

    @action(detail=True, methods=['get'])
    def parts(self, request, slug=None):
        """Get parts for a specific category"""
        category = self.get_object()
        parts = Part.objects.filter(
            category=category, 
            is_deleted=False, 
            is_available=True
        )
        
        page = self.paginate_queryset(parts)
        if page is not None:
            serializer = PartListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PartListSerializer(parts, many=True)
        return Response(serializer.data)


class PartViewSet(viewsets.ModelViewSet):
    """
    Part viewset
    """
    queryset = Part.objects.filter(is_deleted=False)
    serializer_class = PartSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'condition', 'is_available', 'is_featured']
    search_fields = ['name', 'brand', 'compatible_models', 'description', 'part_number']
    ordering_fields = ['price', 'stock', 'created_at']
    ordering = ['-created_at']
    lookup_field = 'slug'
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return PartListSerializer
        return PartSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Only show available parts for non-staff users
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_available=True)
        
        return queryset

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get available parts (in stock)"""
        queryset = self.get_queryset().filter(is_available=True, stock__gt=0)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = PartListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PartListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured parts"""
        queryset = self.get_queryset().filter(is_featured=True, is_available=True)
        serializer = PartListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_brand(self, request):
        """Get parts grouped by brand"""
        brands = self.get_queryset().values_list('brand', flat=True).distinct().order_by('brand')
        result = {}
        
        for brand in brands:
            parts = self.get_queryset().filter(brand=brand, is_available=True)[:5]
            result[brand] = PartListSerializer(parts, many=True).data
        
        return Response(result)

    @action(detail=True, methods=['post'])
    def update_stock(self, request, slug=None):
        """Update part stock"""
        part = self.get_object()
        new_stock = request.data.get('stock')
        
        if new_stock is not None and isinstance(new_stock, int) and new_stock >= 0:
            part.stock = new_stock
            part.save()
            serializer = self.get_serializer(part)
            return Response(serializer.data)
        
        return Response(
            {'error': 'Stock invalide'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class PartImageViewSet(viewsets.ModelViewSet):
    """
    Part image viewset
    """
    queryset = PartImage.objects.filter(is_deleted=False)
    serializer_class = PartImageSerializer
    permission_classes = [IsAdminOrReadOnly]

    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None):
        """Set an image as primary"""
        image = self.get_object()
        
        # Remove primary status from other images
        PartImage.objects.filter(
            part=image.part,
            is_primary=True
        ).exclude(pk=image.pk).update(is_primary=False)
        
        # Set this image as primary
        image.is_primary = True
        image.save()
        
        serializer = self.get_serializer(image)
        return Response(serializer.data)