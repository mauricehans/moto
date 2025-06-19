"""
Common utilities
"""
import uuid
from django.utils.text import slugify


def generate_unique_slug(model_class, title, slug_field='slug'):
    """
    Generate a unique slug for a model instance
    """
    base_slug = slugify(title)
    slug = base_slug
    counter = 1
    
    while model_class.objects.filter(**{slug_field: slug}).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    return slug


def generate_upload_path(instance, filename):
    """
    Generate upload path for file fields
    """
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return f"{instance._meta.app_label}/{instance._meta.model_name}/{filename}"