from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Motorcycle, MotorcycleImage
from .serializers import MotorcycleSerializer, MotorcycleImageSerializer
from django.conf import settings
import os
from urllib.parse import quote

class MotorcycleViewSet(viewsets.ModelViewSet):
    """ViewSet pour les motos avec CRUD complet"""
    queryset = Motorcycle.objects.all()
    serializer_class = MotorcycleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['brand', 'year', 'license', 'is_sold']
    search_fields = ['brand', 'model', 'description']
    ordering_fields = ['price', 'year', 'mileage', 'created_at']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """Permissions personnalisées selon l'action"""
        if self.action in ['list', 'retrieve', 'featured', 'list_images']:
            # Lecture publique autorisée
            permission_classes = [AllowAny]
        else:
            # Écriture nécessite une authentification
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Motos à la une"""
        featured_motos = self.queryset.filter(is_sold=False)[:6]
        serializer = self.get_serializer(featured_motos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_images(self, request, pk=None):
        """Upload d'images pour une moto"""
        import os
        import uuid
        from django.conf import settings
        from django.core.files.storage import default_storage
        
        motorcycle = self.get_object()
        files = request.FILES.getlist('images')
        
        if not files:
            return Response({'error': 'Aucun fichier fourni'}, status=status.HTTP_400_BAD_REQUEST)
        
        created_images = []
        for file in files:
            # Générer un nom de fichier unique
            file_extension = os.path.splitext(file.name)[1]
            unique_filename = f"motorcycles/{motorcycle.id}/{uuid.uuid4()}{file_extension}"
            
            # Sauvegarder le fichier
            file_path = default_storage.save(unique_filename, file)
            
            # Créer l'URL complète
            # Utiliser une URL relative pour être servie via Nginx/HTTPS
            image_url = f"{settings.MEDIA_URL}{file_path}"
            
            image = MotorcycleImage.objects.create(
                motorcycle=motorcycle,
                image=image_url
            )
            created_images.append(MotorcycleImageSerializer(image).data)
        
        return Response(created_images, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def list_images(self, request, pk=None):
        """Lister toutes les images présentes dans le dossier media de la moto, qu'elles soient en DB ou non"""
        moto = self.get_object()
        folder = os.path.join(settings.MEDIA_ROOT, 'motorcycles', str(moto.id))
        results = []
        if os.path.isdir(folder):
            for name in sorted(os.listdir(folder)):
                # Ignorer fichiers cachés et non images basiques
                if name.startswith('.'):
                    continue
                rel = f"motorcycles/{moto.id}/{name}"
                url = f"{settings.MEDIA_URL}{quote(rel)}"
                results.append({'filename': name, 'url': url})
        # Inclure aussi les enregistrements DB existants
        db_images = MotorcycleImage.objects.filter(motorcycle=moto).order_by('-created_at')
        db_payload = MotorcycleImageSerializer(db_images, many=True).data
        return Response({'filesystem': results, 'database': db_payload})
    
    @action(detail=True, methods=['post'])
    def set_primary_image(self, request, pk=None):
        """Définir l'image principale d'une moto"""
        motorcycle = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            return Response({'error': 'image_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Retirer le statut principal de toutes les images
            MotorcycleImage.objects.filter(motorcycle=motorcycle).update(is_primary=False)
            
            # Définir la nouvelle image principale
            image = MotorcycleImage.objects.get(id=image_id, motorcycle=motorcycle)
            image.is_primary = True
            image.save()
            
            return Response({'success': True}, status=status.HTTP_200_OK)
        except MotorcycleImage.DoesNotExist:
            return Response({'error': 'Image non trouvée'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        """Supprimer une image d'une moto"""
        motorcycle = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            return Response({'error': 'image_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            image = MotorcycleImage.objects.get(id=image_id, motorcycle=motorcycle)
            image.delete()
            return Response({'success': True}, status=status.HTTP_200_OK)
        except MotorcycleImage.DoesNotExist:
            return Response({'error': 'Image non trouvée'}, status=status.HTTP_404_NOT_FOUND)

class MotorcycleImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour les images de motos"""
    queryset = MotorcycleImage.objects.all()
    serializer_class = MotorcycleImageSerializer
    
    def get_permissions(self):
        """Permissions personnalisées selon l'action"""
        if self.action in ['list', 'retrieve']:
            # Lecture publique autorisée
            permission_classes = [AllowAny]
        else:
            # Écriture nécessite une authentification
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
