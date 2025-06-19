"""
Motorcycle repositories for data access
"""
from django.db.models import QuerySet
from .models import Motorcycle, MotorcycleImage


class MotorcycleRepository:
    """
    Repository for motorcycle data access
    """
    
    def get_all(self) -> QuerySet[Motorcycle]:
        """Get all motorcycles"""
        return Motorcycle.objects.filter(is_deleted=False)
    
    def get_available(self) -> QuerySet[Motorcycle]:
        """Get available motorcycles (not sold)"""
        return self.get_all().filter(is_sold=False)
    
    def get_featured(self) -> QuerySet[Motorcycle]:
        """Get featured motorcycles"""
        return self.get_available().filter(is_featured=True)
    
    def get_by_slug(self, slug: str) -> Motorcycle:
        """Get motorcycle by slug"""
        return self.get_all().get(slug=slug)
    
    def get_by_brand(self, brand: str) -> QuerySet[Motorcycle]:
        """Get motorcycles by brand"""
        return self.get_available().filter(brand__iexact=brand)
    
    def search(self, query: str) -> QuerySet[Motorcycle]:
        """Search motorcycles"""
        return self.get_available().filter(
            models.Q(brand__icontains=query) |
            models.Q(model__icontains=query) |
            models.Q(description__icontains=query)
        )
    
    def filter_by_price_range(self, min_price: float, max_price: float) -> QuerySet[Motorcycle]:
        """Filter motorcycles by price range"""
        return self.get_available().filter(price__gte=min_price, price__lte=max_price)
    
    def create(self, motorcycle_data: dict) -> Motorcycle:
        """Create a new motorcycle"""
        return Motorcycle.objects.create(**motorcycle_data)
    
    def update(self, motorcycle: Motorcycle, update_data: dict) -> Motorcycle:
        """Update a motorcycle"""
        for field, value in update_data.items():
            setattr(motorcycle, field, value)
        motorcycle.save()
        return motorcycle
    
    def soft_delete(self, motorcycle: Motorcycle) -> None:
        """Soft delete a motorcycle"""
        motorcycle.soft_delete()


class MotorcycleImageRepository:
    """
    Repository for motorcycle image data access
    """
    
    def get_by_motorcycle(self, motorcycle: Motorcycle) -> QuerySet[MotorcycleImage]:
        """Get images for a motorcycle"""
        return MotorcycleImage.objects.filter(motorcycle=motorcycle, is_deleted=False)
    
    def get_primary_image(self, motorcycle: Motorcycle) -> MotorcycleImage:
        """Get primary image for a motorcycle"""
        return self.get_by_motorcycle(motorcycle).filter(is_primary=True).first()
    
    def create(self, image_data: dict) -> MotorcycleImage:
        """Create a new motorcycle image"""
        return MotorcycleImage.objects.create(**image_data)