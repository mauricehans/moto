from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Part(models.Model):
    CONDITION_CHOICES = [
        ('new', 'Neuf'),
        ('used_excellent', 'Occasion - Excellent'),
        ('used_good', 'Occasion - Bon état'),
        ('used_fair', 'Occasion - État correct'),
        ('refurbished', 'Reconditionné'),
    ]
    
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='parts')
    brand = models.CharField(max_length=100)
    compatible_models = models.TextField(help_text="Modèles compatibles séparés par des virgules")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='new')
    description = models.TextField()
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.brand}"

class PartImage(models.Model):
    part = models.ForeignKey(Part, on_delete=models.CASCADE, related_name='images')
    image = models.URLField(max_length=500)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.part.name}"
