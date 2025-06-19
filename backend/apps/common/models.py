"""
Common models for shared functionality
"""
from django.db import models
from django.utils import timezone


class TimeStampedModel(models.Model):
    """
    Abstract base class with created_at and updated_at fields
    """
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")

    class Meta:
        abstract = True


class SoftDeleteModel(models.Model):
    """
    Abstract base class for soft delete functionality
    """
    is_deleted = models.BooleanField(default=False, verbose_name="Supprimé")
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name="Supprimé le")

    class Meta:
        abstract = True

    def soft_delete(self):
        """Soft delete the object"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        """Restore a soft deleted object"""
        self.is_deleted = False
        self.deleted_at = None
        self.save()


class BaseModel(TimeStampedModel, SoftDeleteModel):
    """
    Base model combining timestamp and soft delete functionality
    """
    class Meta:
        abstract = True