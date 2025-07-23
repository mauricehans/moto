from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Post
from .serializers import CategorySerializer, PostSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les catégories de blog"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class PostViewSet(viewsets.ModelViewSet):
    """ViewSet pour les articles de blog"""
    queryset = Post.objects.all()  # Changé pour permettre l'accès admin
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    lookup_field = 'slug'  # Restauré pour utiliser le slug
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, pk=None):
        """Upload d'image pour un article de blog"""
        import os
        import uuid
        from django.conf import settings
        from django.core.files.storage import default_storage
        
        post = self.get_object()
        file = request.FILES.get('image')
        
        if not file:
            return Response({'error': 'Aucun fichier fourni'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Générer un nom de fichier unique
        file_extension = os.path.splitext(file.name)[1]
        unique_filename = f"blog/{post.id}/{uuid.uuid4()}{file_extension}"
        
        # Sauvegarder le fichier
        file_path = default_storage.save(unique_filename, file)
        
        # Créer l'URL complète
        if settings.DEBUG:
            # En développement, utiliser l'URL locale
            image_url = f"http://127.0.0.1:8000/media/{file_path}"
        else:
            # En production, utiliser l'URL du domaine
            image_url = f"{settings.MEDIA_URL}{file_path}"
        
        post.image = image_url
        post.save()
        
        return Response({'image': image_url}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        """Supprimer l'image d'un article de blog"""
        post = self.get_object()
        
        if not post.image:
            return Response({'error': 'Aucune image à supprimer'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Supprimer l'image
        post.image = ''
        post.save()
        
        return Response({'success': True}, status=status.HTTP_200_OK)
