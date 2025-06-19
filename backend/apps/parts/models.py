"""
Parts models
"""
from django.db import models
from django.core.validators import MinValueValidator
from apps.common.models import BaseModel
from apps.common.utils import generate_upload_path, generate_unique_slug


class Category(BaseModel):
    """
    Parts category model
    """
    name = models.CharField(max_length=100, unique=True, verbose_name="Nom")
    slug = models.SlugField(unique=True, blank=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="Description")
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='subcategories',
        verbose_name="Catégorie parente"
    )

    class Meta:
        verbose_name = "Catégorie de pièce"
        verbose_name_plural = "Catégories de pièces"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Category, self.name)
        super().save(*args, **kwargs)


class Part(BaseModel):
    """
    Part model
    """
    CONDITION_CHOICES = [
        ('new', 'Neuf'),
        ('used_excellent', 'Occasion - Excellent état'),
        ('used_good', 'Occasion - Bon état'),
        ('used_fair', 'Occasion - État correct'),
        ('refurbished', 'Reconditionné'),
    ]

    name = models.CharField(max_length=200, verbose_name="Nom")
    slug = models.SlugField(unique=True, blank=True, verbose_name="Slug")
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='parts',
        verbose_name="Catégorie"
    )
    brand = models.CharField(max_length=100, verbose_name="Marque")
    part_number = models.CharField(max_length=100, blank=True, verbose_name="Référence")
    compatible_models = models.TextField(verbose_name="Modèles compatibles")
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        verbose_name="Prix"
    )
    stock = models.PositiveIntegerField(default=0, verbose_name="Stock")
    condition = models.CharField(
        max_length=20, 
        choices=CONDITION_CHOICES, 
        default='used_good',
        verbose_name="État"
    )
    description = models.TextField(verbose_name="Description")
    specifications = models.JSONField(default=dict, verbose_name="Spécifications")
    weight = models.DecimalField(
        max_digits=8, 
        decimal_places=2, 
        null=True, 
        blank=True,
        verbose_name="Poids (kg)"
    )
    dimensions = models.CharField(max_length=100, blank=True, verbose_name="Dimensions")
    is_available = models.BooleanField(default=True, verbose_name="Disponible")
    is_featured = models.BooleanField(default=False, verbose_name="À la une")

    class Meta:
        verbose_name = "Pièce détachée"
        verbose_name_plural = "Pièces détachées"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.brand} - {self.name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Part, f"{self.brand} {self.name}")
        
        # Auto-update availability based on stock
        self.is_available = self.stock > 0
        
        super().save(*args, **kwargs)

    @property
    def is_in_stock(self):
        return self.stock > 0


class PartImage(BaseModel):
    """
    Part image model
    """
    part = models.ForeignKey(
        Part, 
        on_delete=models.CASCADE, 
        related_name='images',
        verbose_name="Pièce"
    )
    image = models.ImageField(upload_to=generate_upload_path, verbose_name="Image")
    is_primary = models.BooleanField(default=False, verbose_name="Image principale")
    alt_text = models.CharField(max_length=255, blank=True, verbose_name="Texte alternatif")

    class Meta:
        verbose_name = "Image de pièce"
        verbose_name_plural = "Images de pièces"
        ordering = ['-is_primary', 'created_at']

    def __str__(self):
        return f"Image de {self.part}"

    def save(self, *args, **kwargs):
        # Ensure only one primary image per part
        if self.is_primary:
            PartImage.objects.filter(
                part=self.part, 
                is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)