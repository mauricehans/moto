from django.db import models

class Motorcycle(models.Model):
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    mileage = models.IntegerField()
    engine = models.CharField(max_length=50)
    power = models.IntegerField()
    license = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_sold = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"

class MotorcycleImage(models.Model):
    motorcycle = models.ForeignKey(Motorcycle, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='motorcycles/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.motorcycle}"