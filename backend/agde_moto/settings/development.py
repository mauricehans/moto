"""
Development settings for agde_moto project.
"""

from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'agde_moto_db.sqlite3',
    }
}

# CORS Settings for development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # React dev server alternative
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # Only for development

# Development-specific middleware
MIDDLEWARE += [
    'django_extensions.management.commands.show_urls',
]

# Additional apps for development
INSTALLED_APPS += [
    'django_extensions',
]

# Cache for development (dummy cache)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Logging for development
LOGGING['handlers']['console']['level'] = 'DEBUG'
LOGGING['loggers']['apps']['level'] = 'DEBUG'