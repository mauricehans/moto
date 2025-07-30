from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Part, PartImage
from .serializers import CategorySerializer, PartSerializer, PartImageSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les catégories de pièces"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]  # Lecture publique pour les catégories

class PartViewSet(viewsets.ModelViewSet):
    """ViewSet pour les pièces détachées"""
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand']
    search_fields = ['name', 'brand', 'compatible_models', 'description']
    ordering_fields = ['price', 'stock', 'created_at']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """Permissions personnalisées selon l'action"""
        if self.action in ['list', 'retrieve']:
            # Lecture publique autorisée
            permission_classes = [AllowAny]
        else:
            # Écriture nécessite une authentification
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_images(self, request, pk=None):
        """Upload d'images pour une pièce"""
        import os
        import uuid
        from django.conf import settings
        from django.core.files.storage import default_storage
        
        part = self.get_object()
        files = request.FILES.getlist('images')
        
        if not files:
            return Response({'error': 'Aucun fichier fourni'}, status=status.HTTP_400_BAD_REQUEST)
        
        created_images = []
        for file in files:
            # Générer un nom de fichier unique
            file_extension = os.path.splitext(file.name)[1]
            unique_filename = f"parts/{part.id}/{uuid.uuid4()}{file_extension}"
            
            # Sauvegarder le fichier
            file_path = default_storage.save(unique_filename, file)
            
            # Créer l'URL complète
            if settings.DEBUG:
                # En développement, utiliser l'URL locale
                image_url = f"http://localhost:8000/media/{file_path}"
            else:
                # En production, utiliser l'URL du domaine
                image_url = f"{settings.MEDIA_URL}{file_path}"
            
            image = PartImage.objects.create(
                part=part,
                image=image_url
            )
            created_images.append(PartImageSerializer(image).data)
        
        return Response(created_images, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def set_primary_image(self, request, pk=None):
        """Définir l'image principale d'une pièce"""
        part = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            return Response({'error': 'image_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Retirer le statut principal de toutes les images
            PartImage.objects.filter(part=part).update(is_primary=False)
            
            # Définir la nouvelle image principale
            image = PartImage.objects.get(id=image_id, part=part)
            image.is_primary = True
            image.save()
            
            return Response({'success': True}, status=status.HTTP_200_OK)
        except PartImage.DoesNotExist:
            return Response({'error': 'Image non trouvée'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        """Supprimer une image d'une pièce"""
        part = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            return Response({'error': 'image_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            image = PartImage.objects.get(id=image_id, part=part)
            image.delete()
            return Response({'success': True}, status=status.HTTP_200_OK)
        except PartImage.DoesNotExist:
            return Response({'error': 'Image non trouvée'}, status=status.HTTP_404_NOT_FOUND)

class PartImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour les images de pièces"""
    queryset = PartImage.objects.all()
    serializer_class = PartImageSerializer
    
    def get_permissions(self):
        """Permissions personnalisées selon l'action"""
        if self.action in ['list', 'retrieve']:
            # Lecture publique autorisée
            permission_classes = [AllowAny]
        else:
            # Écriture nécessite une authentification
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
