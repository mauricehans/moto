from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Part, PartImage
from utils.file_cleanup import delete_file_from_url, delete_directory

@receiver(post_delete, sender=PartImage)
def delete_part_image_file(sender, instance, **kwargs):
    """
    Deletes the physical file when a PartImage instance is deleted.
    """
    if instance.image:
        delete_file_from_url(instance.image)

@receiver(post_delete, sender=Part)
def delete_part_directory(sender, instance, **kwargs):
    """
    Deletes the directory containing images when a Part instance is deleted.
    Assumes structure: media/parts/<id>/
    """
    directory = f"parts/{instance.id}"
    delete_directory(directory)
