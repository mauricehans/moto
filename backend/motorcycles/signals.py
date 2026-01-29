from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Motorcycle, MotorcycleImage
from utils.file_cleanup import delete_file_from_url, delete_directory

@receiver(post_delete, sender=MotorcycleImage)
def delete_motorcycle_image_file(sender, instance, **kwargs):
    """
    Deletes the physical file when a MotorcycleImage instance is deleted.
    """
    if instance.image:
        delete_file_from_url(instance.image)

@receiver(post_delete, sender=Motorcycle)
def delete_motorcycle_directory(sender, instance, **kwargs):
    """
    Deletes the directory containing images when a Motorcycle instance is deleted.
    Assumes structure: media/motorcycles/<id>/
    """
    directory = f"motorcycles/{instance.id}"
    delete_directory(directory)
