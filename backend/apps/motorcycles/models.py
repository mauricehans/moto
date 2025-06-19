"""
Motorcycle models
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.common.models import BaseModel
from apps.common.utils import generate_upload_path, generate_unique_slug


class Motorcycle(BaseModel):
    """
    Motorcycle model
    """
    LICENSE_CHOICES = [
        ('A1', 'A1 (125cc)'),
        ('A2', 'A2 (35kW)'),
        ('A', 'A (Sans restriction)'),
    ]

    brand = models.CharField(max_length=100, verbose_name="Marque")
    model = models.CharField(max_length=100, verbose_name="Modèle")
    year = models.PositiveIntegerField(
        validators=[MinValueValidator(1900), MaxValueValidator(2030)],
        verbose_name="Année"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix")
    mileage = models.PositiveIntegerField(verbose_name="Kilométrage")
    engine = models.CharField(max_length=50, verbose_name="Cylindrée")
    power = models.PositiveIntegerField(verbose_name="Puissance (ch)")
    license = models.CharField(max_length=2, choices=LICENSE_CHOICES, verbose_name="Permis requis")
    color = models.CharField(max_length=50, verbose_name="Couleur")
    description = models.TextField(verbose_name="Description")
    features = models.JSONField(default=list, verbose_name="Équipements")
    is_sold = models.BooleanField(default=False, verbose_name="Vendue")
    is_featured = models.BooleanField(default=False, verbose_name="À la une")
    slug = models.SlugField(unique=True, blank=True, verbose_name="Slug")

    class Meta:
        verbose_name = "Moto"
        verbose_name_plural = "Motos"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(
                Motorcycle, 
                f"{self.brand} {self.model} {self.year}"
            )
        super().save(*args, **kwargs)


class MotorcycleImage(BaseModel):
    """
    Motorcycle image model
    """
    motorcycle = models.ForeignKey(
        Motorcycle, 
        on_delete=models.CASCADE, 
        related_name='images',
        verbose_name="Moto"
    )
    image = models.ImageField(upload_to=generate_upload_path, verbose_name="Image")
    is_primary = models.BooleanField(default=False, verbose_name="Image principale")
    alt_text = models.CharField(max_length=255, blank=True, verbose_name="Texte alternatif")

    class Meta:
        verbose_name = "Image de moto"
        verbose_name_plural = "Images de motos"
        ordering = ['-is_primary', 'created_at']

    def __str__(self):
        return f"Image de {self.motorcycle}"

    def save(self, *args, **kwargs):
        # Ensure only one primary image per motorcycle
        if self.is_primary:
            MotorcycleImage.objects.filter(
                motorcycle=self.motorcycle, 
                is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)