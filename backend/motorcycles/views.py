from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Motorcycle, MotorcycleImage
from .serializers import MotorcycleSerializer, MotorcycleImageSerializer

class MotorcycleViewSet(viewsets.ModelViewSet):
    """ViewSet pour les motos avec CRUD complet"""
    queryset = Motorcycle.objects.all()
    serializer_class = MotorcycleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['brand', 'year', 'license', 'is_sold']
    search_fields = ['brand', 'model', 'description']
    ordering_fields = ['price', 'year', 'mileage', 'created_at']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Motos à la une"""
        featured_motos = self.queryset.filter(is_sold=False)[:6]
        serializer = self.get_serializer(featured_motos, many=True)
        return Response(serializer.data)

class MotorcycleImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour les images de motos"""
    queryset = MotorcycleImage.objects.all()
    serializer_class = MotorcycleImageSerializer
