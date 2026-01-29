from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import Post
from utils.file_cleanup import delete_file_from_url, delete_directory

@receiver(post_delete, sender=Post)
def delete_post_directory(sender, instance, **kwargs):
    """
    Deletes the directory containing images when a Post instance is deleted.
    Assumes structure: media/blog/<id>/
    """
    directory = f"blog/{instance.id}"
    delete_directory(directory)
    
    # Also try to delete the file if it's not in that directory for some reason
    if instance.image:
        delete_file_from_url(instance.image)

@receiver(pre_save, sender=Post)
def delete_old_post_image(sender, instance, **kwargs):
    """
    Deletes the old image file when the image field is updated.
    """
    if not instance.pk:
        return

    try:
        old_instance = Post.objects.get(pk=instance.pk)
    except Post.DoesNotExist:
        return

    if old_instance.image and old_instance.image != instance.image:
        delete_file_from_url(old_instance.image)
