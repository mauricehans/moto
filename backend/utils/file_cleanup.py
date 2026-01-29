import os
import shutil
from django.conf import settings
from urllib.parse import unquote

def delete_file_from_url(url):
    """
    Deletes a file from the filesystem based on its media URL.
    """
    if not url:
        return

    # Remove MEDIA_URL prefix to get relative path
    # MEDIA_URL is usually '/media/'
    media_url = settings.MEDIA_URL
    if url.startswith(media_url):
        relative_path = url[len(media_url):]
    elif '/media/' in url:
        # Handle cases where full URL is stored (e.g. http://localhost:8000/media/...)
        relative_path = url.split('/media/')[-1]
    else:
        # Fallback: assume it's already a relative path or something we can't handle easily
        # But based on the code, it seems we store '/media/...'
        relative_path = url

    # Decode URL (e.g. spaces -> %20)
    relative_path = unquote(relative_path)
    
    # Construct full path
    file_path = os.path.join(settings.MEDIA_ROOT, relative_path)
    
    if os.path.isfile(file_path):
        try:
            os.remove(file_path)
            print(f"Deleted file: {file_path}")
        except OSError as e:
            print(f"Error deleting file {file_path}: {e}")
    else:
        print(f"File not found for deletion: {file_path}")

def delete_directory(directory_path):
    """
    Deletes a directory and all its contents.
    """
    full_path = os.path.join(settings.MEDIA_ROOT, directory_path)
    if os.path.isdir(full_path):
        try:
            shutil.rmtree(full_path)
            print(f"Deleted directory: {full_path}")
        except OSError as e:
            print(f"Error deleting directory {full_path}: {e}")
