from django.db import models

class Motorcycle(models.Model):
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    mileage = models.PositiveIntegerField()
    engine = models.CharField(max_length=50)
    power = models.PositiveIntegerField()
    license = models.CharField(max_length=10)
    color = models.CharField(max_length=50)
    description = models.TextField()
    is_sold = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"

class MotorcycleImage(models.Model):
    motorcycle = models.ForeignKey(Motorcycle, on_delete=models.CASCADE, related_name='images')
    image = models.URLField(max_length=500)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.motorcycle.brand} {self.motorcycle.model}"

