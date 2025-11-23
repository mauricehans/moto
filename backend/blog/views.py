from rest_framework import viewsets, filters, status
from rest_framework.exceptions import NotFound
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Post
from .serializers import CategorySerializer, PostSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les catégories de blog"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]  # Lecture publique pour les catégories

class PostViewSet(viewsets.ModelViewSet):
    """ViewSet pour les articles de blog"""
    queryset = Post.objects.filter(is_published=True)  # Seuls les articles publiés en lecture publique
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    lookup_field = 'slug'
    
    def get_permissions(self):
        """Permissions personnalisées selon l'action"""
        if self.action in ['list', 'retrieve']:
            # Lecture publique autorisée
            permission_classes = [AllowAny]
        else:
            # Écriture nécessite une authentification
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Queryset personnalisé selon l'action"""
        if self.action in ['list', 'retrieve'] and not self.request.user.is_authenticated:
            # Utilisateurs non authentifiés : seulement les articles publiés
            return Post.objects.filter(is_published=True)
        else:
            # Utilisateurs authentifiés : tous les articles
            return Post.objects.all()

    def get_object(self):
        lookup = self.kwargs.get(self.lookup_field)
        qs = self.get_queryset()
        obj = None
        if lookup is not None:
            if str(lookup).isdigit():
                obj = qs.filter(pk=int(lookup)).first()
            else:
                obj = qs.filter(slug=lookup).first()
        if not obj:
            raise NotFound()
        self.check_object_permissions(self.request, obj)
        return obj
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, slug=None):
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
            image_url = f"http://localhost:8000/media/{file_path}"
        else:
            # En production, utiliser l'URL du domaine
            image_url = f"{settings.MEDIA_URL}{file_path}"
        
        post.image = image_url
        post.save()
        
        return Response({'image': image_url}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['delete'])
    def delete_image(self, request, slug=None):
        """Supprimer l'image d'un article de blog"""
        post = self.get_object()
        
        if not post.image:
            return Response({'error': 'Aucune image à supprimer'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Supprimer l'image
        post.image = ''
        post.save()
        
        return Response({'success': True}, status=status.HTTP_200_OK)
