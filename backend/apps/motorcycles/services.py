"""
Motorcycle services for business logic
"""
from typing import List, Optional, Dict, Any
from django.db import transaction
from django.core.cache import cache
from django.db.models import QuerySet
from .models import Motorcycle, MotorcycleImage
from .repositories import MotorcycleRepository, MotorcycleImageRepository


class MotorcycleService:
    """
    Service for motorcycle business logic
    """
    
    def __init__(self):
        self.motorcycle_repo = MotorcycleRepository()
        self.image_repo = MotorcycleImageRepository()
    
    def get_featured_motorcycles(self, limit: int = 6) -> List[Motorcycle]:
        """Get featured motorcycles with caching"""
        cache_key = f"motorcycles:featured:{limit}"
        motorcycles = cache.get(cache_key)
        
        if not motorcycles:
            motorcycles = list(self.motorcycle_repo.get_featured()[:limit])
            cache.set(cache_key, motorcycles, 300)  # Cache for 5 minutes
        
        return motorcycles
    
    def get_available_motorcycles(self) -> QuerySet[Motorcycle]:
        """Get all available motorcycles"""
        return self.motorcycle_repo.get_available()
    
    def get_motorcycle_by_slug(self, slug: str) -> Optional[Motorcycle]:
        """Get motorcycle by slug with caching"""
        cache_key = f"motorcycle:slug:{slug}"
        motorcycle = cache.get(cache_key)
        
        if not motorcycle:
            try:
                motorcycle = self.motorcycle_repo.get_by_slug(slug)
                cache.set(cache_key, motorcycle, 600)  # Cache for 10 minutes
            except Motorcycle.DoesNotExist:
                return None
        
        return motorcycle
    
    def search_motorcycles(self, filters: Dict[str, Any]) -> QuerySet[Motorcycle]:
        """Search motorcycles with filters"""
        queryset = self.motorcycle_repo.get_available()
        
        # Apply search query
        if search_query := filters.get('search'):
            queryset = queryset.filter(
                models.Q(brand__icontains=search_query) |
                models.Q(model__icontains=search_query) |
                models.Q(description__icontains=search_query)
            )
        
        # Apply brand filter
        if brand := filters.get('brand'):
            queryset = queryset.filter(brand__iexact=brand)
        
        # Apply price range filter
        if min_price := filters.get('min_price'):
            queryset = queryset.filter(price__gte=min_price)
        if max_price := filters.get('max_price'):
            queryset = queryset.filter(price__lte=max_price)
        
        # Apply year range filter
        if min_year := filters.get('min_year'):
            queryset = queryset.filter(year__gte=min_year)
        if max_year := filters.get('max_year'):
            queryset = queryset.filter(year__lte=max_year)
        
        # Apply license filter
        if license_type := filters.get('license'):
            queryset = queryset.filter(license=license_type)
        
        return queryset
    
    @transaction.atomic
    def create_motorcycle(self, motorcycle_data: Dict[str, Any], images_data: List[Dict] = None) -> Motorcycle:
        """Create a new motorcycle with images"""
        motorcycle = self.motorcycle_repo.create(motorcycle_data)
        
        if images_data:
            for i, image_data in enumerate(images_data):
                image_data['motorcycle'] = motorcycle
                image_data['is_primary'] = i == 0  # First image is primary
                self.image_repo.create(image_data)
        
        # Clear cache
        self._clear_motorcycle_cache()
        
        return motorcycle
    
    @transaction.atomic
    def update_motorcycle(self, motorcycle: Motorcycle, update_data: Dict[str, Any]) -> Motorcycle:
        """Update a motorcycle"""
        updated_motorcycle = self.motorcycle_repo.update(motorcycle, update_data)
        
        # Clear cache
        self._clear_motorcycle_cache()
        cache.delete(f"motorcycle:slug:{motorcycle.slug}")
        
        return updated_motorcycle
    
    @transaction.atomic
    def mark_as_sold(self, motorcycle: Motorcycle) -> Motorcycle:
        """Mark a motorcycle as sold"""
        return self.update_motorcycle(motorcycle, {'is_sold': True})
    
    def get_motorcycle_statistics(self) -> Dict[str, Any]:
        """Get motorcycle statistics"""
        cache_key = "motorcycles:statistics"
        stats = cache.get(cache_key)
        
        if not stats:
            all_motorcycles = self.motorcycle_repo.get_all()
            available_motorcycles = self.motorcycle_repo.get_available()
            
            stats = {
                'total_motorcycles': all_motorcycles.count(),
                'available_motorcycles': available_motorcycles.count(),
                'sold_motorcycles': all_motorcycles.filter(is_sold=True).count(),
                'featured_motorcycles': self.motorcycle_repo.get_featured().count(),
                'brands_count': all_motorcycles.values('brand').distinct().count(),
            }
            cache.set(cache_key, stats, 1800)  # Cache for 30 minutes
        
        return stats
    
    def _clear_motorcycle_cache(self):
        """Clear motorcycle-related cache"""
        cache.delete_pattern("motorcycles:*")
        cache.delete("motorcycles:statistics")


class MotorcycleImageService:
    """
    Service for motorcycle image business logic
    """
    
    def __init__(self):
        self.image_repo = MotorcycleImageRepository()
    
    def get_motorcycle_images(self, motorcycle: Motorcycle) -> QuerySet[MotorcycleImage]:
        """Get all images for a motorcycle"""
        return self.image_repo.get_by_motorcycle(motorcycle)
    
    def get_primary_image(self, motorcycle: Motorcycle) -> Optional[MotorcycleImage]:
        """Get primary image for a motorcycle"""
        return self.image_repo.get_primary_image(motorcycle)
    
    @transaction.atomic
    def add_image(self, motorcycle: Motorcycle, image_data: Dict[str, Any]) -> MotorcycleImage:
        """Add an image to a motorcycle"""
        image_data['motorcycle'] = motorcycle
        return self.image_repo.create(image_data)
    
    @transaction.atomic
    def set_primary_image(self, image: MotorcycleImage) -> MotorcycleImage:
        """Set an image as primary"""
        # Remove primary status from other images
        MotorcycleImage.objects.filter(
            motorcycle=image.motorcycle,
            is_primary=True
        ).exclude(pk=image.pk).update(is_primary=False)
        
        # Set this image as primary
        image.is_primary = True
        image.save()
        
        return image