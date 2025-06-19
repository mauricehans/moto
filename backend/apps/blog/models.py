"""
Blog models
"""
from django.db import models
from django.contrib.auth import get_user_model
from apps.common.models import BaseModel
from apps.common.utils import generate_upload_path, generate_unique_slug

User = get_user_model()


class Category(BaseModel):
    """
    Blog category model
    """
    name = models.CharField(max_length=100, unique=True, verbose_name="Nom")
    slug = models.SlugField(unique=True, blank=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="Description")

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Category, self.name)
        super().save(*args, **kwargs)


class Post(BaseModel):
    """
    Blog post model
    """
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(unique=True, blank=True, verbose_name="Slug")
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='posts',
        verbose_name="Catégorie"
    )
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='blog_posts',
        verbose_name="Auteur"
    )
    content = models.TextField(verbose_name="Contenu")
    excerpt = models.TextField(max_length=300, blank=True, verbose_name="Extrait")
    image = models.ImageField(upload_to=generate_upload_path, blank=True, verbose_name="Image")
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Publié le")
    views_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de vues")
    tags = models.JSONField(default=list, verbose_name="Tags")

    class Meta:
        verbose_name = "Article"
        verbose_name_plural = "Articles"
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Post, self.title)
        
        # Auto-generate excerpt if not provided
        if not self.excerpt and self.content:
            self.excerpt = self.content[:297] + "..." if len(self.content) > 300 else self.content
        
        super().save(*args, **kwargs)