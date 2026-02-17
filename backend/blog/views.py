from rest_framework import viewsets, filters, status
from rest_framework.exceptions import NotFound
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Post
from .serializers import CategorySerializer, PostSerializer
from django.utils.text import slugify

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les catégories de blog"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]  # Lecture publique pour les catégories

class PostViewSet(viewsets.ModelViewSet):
    """ViewSet pour les articles de blog"""
    queryset = Post.objects.filter(is_published=True)
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
            return Post.objects.filter(is_published=True)
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

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='admin')
    def admin_list(self, request):
        qs = Post.objects.all().order_by('-created_at')
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        from django.utils.text import slugify
        if (('slug' not in data) or (str(data.get('slug', '')).strip() == '')) and ('title' in data and str(data['title']).strip()):
            data['slug'] = slugify(str(data['title']).strip())
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        data = request.data.copy()
        if 'category' in data and 'category_id' not in data:
            cat = data.get('category')
            try:
                # Accept number or dict
                if isinstance(cat, str) and cat.isdigit():
                    data['category_id'] = int(cat)
                elif isinstance(cat, (int, float)):
                    data['category_id'] = int(cat)
                elif isinstance(cat, dict) and 'id' in cat:
                    data['category_id'] = int(cat.get('id'))
            except Exception:
                pass
            data.pop('category', None)
        # Ignore empty category_id to preserve existing category
        if 'category_id' in data and (data['category_id'] in [None, '', 'null']):
            data.pop('category_id')
        # Auto-generate slug if missing or blank and title provided
        if (('slug' not in data) or (str(data.get('slug', '')).strip() == '')) and ('title' in data and str(data['title']).strip()):
            data['slug'] = slugify(str(data['title']).strip())
        partial = True
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        import logging
        if not serializer.is_valid():
            logging.getLogger('blog.update').error({
                'method': request.method,
                'data': data,
                'errors': serializer.errors
            })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_update(serializer)
        return Response(serializer.data)
    
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
            image_url = f"http://178.16.130.95:8000/media/{file_path}"
        else:
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
