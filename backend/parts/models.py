from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Part(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, related_name='parts', on_delete=models.CASCADE)
    brand = models.CharField(max_length=100)
    compatible_models = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.brand}"

class PartImage(models.Model):
    part = models.ForeignKey(Part, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='parts/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.part}"