# -*- coding: utf-8 -*-
"""
Configuration Django sécurisée pour la production - AGDE Moto

Ce fichier contient des exemples de configuration sécurisée pour la production.
Utilisez ce fichier comme référence pour sécuriser votre settings.py principal.

IMPORTANT :
- Remplacez settings.py par ce fichier en production
- Ou copiez les configurations sécurisées dans votre settings.py existant
- Assurez-vous que toutes les variables d'environnement sont définies
"""

from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import timedelta
import logging.config

# Load environment variables
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ========================================
# CONFIGURATION DE SÉCURITÉ CRITIQUE
# ========================================

# Secret Key - DOIT être unique et complexe en production
SECRET_KEY = os.environ.get('SECRET_KEY')
if not SECRET_KEY:
    raise ValueError(
        "SECRET_KEY manquante ! Générez-en une avec : python scripts/generate_secrets.py"
    )

# Debug - DOIT être False en production
DEBUG = False

# Hosts autorisés - Limitez aux domaines réels uniquement
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
if not ALLOWED_HOSTS or ALLOWED_HOSTS == ['']:
    raise ValueError(
        "ALLOWED_HOSTS manquant ! Définissez vos domaines dans .env"
    )

# ========================================
# CONFIGURATION HTTPS OBLIGATOIRE
# ========================================

# Redirection HTTPS forcée
SECURE_SSL_REDIRECT = True

# HSTS (HTTP Strict Transport Security)
SECURE_HSTS_SECONDS = 31536000  # 1 an
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Headers de sécurité
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Proxy SSL (si derrière un reverse proxy)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_TZ = True

# ========================================
# CONFIGURATION DES COOKIES SÉCURISÉE
# ========================================

# Cookies de session sécurisés
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_AGE = int(os.getenv('SESSION_COOKIE_AGE', '3600'))  # 1 heure par défaut
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_SAVE_EVERY_REQUEST = True

# Cookies CSRF sécurisés
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'
CSRF_TRUSTED_ORIGINS = [f"https://{host}" for host in ALLOWED_HOSTS if host]

# ========================================
# APPLICATIONS ET MIDDLEWARE
# ========================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_ratelimit',
    # Applications métier
    'blog',
    'motorcycles',
    'parts',
    'garage',
]

# Middleware avec sécurité renforcée
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Middleware personnalisé pour la sécurité (optionnel)
    # 'agde_moto.middleware.SecurityHeadersMiddleware',
]

ROOT_URLCONF = 'agde_moto.urls'

# ========================================
# CONFIGURATION BASE DE DONNÉES SÉCURISÉE
# ========================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'require',  # SSL obligatoire
        },
        'CONN_MAX_AGE': 60,  # Réutilisation des connexions
        'CONN_HEALTH_CHECKS': True,  # Vérification santé des connexions
    }
}

# Validation des variables de base de données
required_db_vars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD']
for var in required_db_vars:
    if not os.environ.get(var):
        raise ValueError(f"Variable d'environnement {var} manquante !")

# ========================================
# CONFIGURATION CACHE REDIS SÉCURISÉE
# ========================================

REDIS_URL = os.environ.get('REDIS_URL')
if not REDIS_URL:
    raise ValueError("REDIS_URL manquante ! Configurez Redis avec un mot de passe.")

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': REDIS_URL,
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'CONNECTION_POOL_KWARGS': {
                'ssl_cert_reqs': None,  # Ajustez selon votre configuration SSL
            },
        },
        'KEY_PREFIX': 'agde_moto',
        'TIMEOUT': 300,  # 5 minutes par défaut
    }
}

# Utiliser Redis pour les sessions (recommandé)
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'

# Activer django-ratelimit sur le cache par défaut
RATELIMIT_USE_CACHE = 'default'

# ========================================
# CONFIGURATION CORS RESTRICTIVE
# ========================================

# CORS - Limitez aux domaines autorisés uniquement
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
if not CORS_ALLOWED_ORIGINS or CORS_ALLOWED_ORIGINS == ['']:
    raise ValueError("CORS_ALLOWED_ORIGINS manquant ! Définissez vos domaines frontend.")

CORS_ALLOW_ALL_ORIGINS = False  # JAMAIS True en production
CORS_ALLOW_CREDENTIALS = True

# Headers CORS autorisés (liste restrictive)
CORS_ALLOWED_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Méthodes HTTP autorisées
CORS_ALLOWED_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# ========================================
# CONFIGURATION REST FRAMEWORK SÉCURISÉE
# ========================================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # Authentification requise par défaut
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        # Supprimez BrowsableAPIRenderer en production
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': os.getenv('RATE_LIMIT_PER_MINUTE', '60') + '/min',
        'user': os.getenv('RATE_LIMIT_PER_HOUR', '1000') + '/hour'
    }
}

# ========================================
# CONFIGURATION JWT SÉCURISÉE
# ========================================

JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY manquante ! Générez-en une avec le script.")

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('JWT_ACCESS_TOKEN_LIFETIME', '15'))),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('JWT_REFRESH_TOKEN_LIFETIME', '1440'))),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': JWT_SECRET_KEY,  # Clé dédiée pour JWT
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}

# ========================================
# CONFIGURATION DES MOTS DE PASSE
# ========================================

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 12,  # Longueur minimale renforcée
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ========================================
# CONFIGURATION DES FICHIERS STATIQUES
# ========================================

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

# Configuration pour les fichiers statiques en production
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'

# Configuration des uploads sécurisée
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Limitations des uploads
FILE_UPLOAD_MAX_MEMORY_SIZE = int(os.getenv('FILE_UPLOAD_MAX_MEMORY_SIZE', '2621440'))  # 2.5MB
DATA_UPLOAD_MAX_MEMORY_SIZE = int(os.getenv('DATA_UPLOAD_MAX_MEMORY_SIZE', '2621440'))  # 2.5MB
FILE_UPLOAD_PERMISSIONS = 0o644

# ========================================
# CONFIGURATION DES TEMPLATES
# ========================================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'debug': False,  # Désactivé en production
        },
    },
]

# ========================================
# CONFIGURATION DES LOGS SÉCURISÉE
# ========================================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'maxBytes': 1024*1024*15,  # 15MB
            'backupCount': 10,
            'formatter': 'verbose',
        },
        'security_file': {
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'security.log',
            'maxBytes': 1024*1024*15,  # 15MB
            'backupCount': 10,
            'formatter': 'verbose',
            'filters': ['require_debug_false'],
        },
        'console': {
            'level': 'ERROR',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': os.getenv('LOGGING_LEVEL', 'INFO'),
            'propagate': True,
        },
        'django.security': {
            'handlers': ['security_file'],
            'level': 'WARNING',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

# Créer le dossier logs s'il n'existe pas
os.makedirs(BASE_DIR / 'logs', exist_ok=True)

# ========================================
# CONFIGURATION RÉGIONALE
# ========================================

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Europe/Paris'
USE_I18N = True
USE_TZ = True

# ========================================
# AUTRES CONFIGURATIONS DE SÉCURITÉ
# ========================================

# Champ auto par défaut
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuration email sécurisée
EMAIL_PROVIDER = os.getenv('EMAIL_PROVIDER', 'smtp').lower()
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL')
SERVER_EMAIL = os.environ.get('SERVER_EMAIL', DEFAULT_FROM_EMAIL or 'server@localhost')

if EMAIL_PROVIDER == 'console':
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
elif EMAIL_PROVIDER == 'sendgrid':
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = 'smtp.sendgrid.net'
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = os.environ.get('SENDGRID_USERNAME', 'apikey')
    EMAIL_HOST_PASSWORD = os.environ.get('SENDGRID_API_KEY')
elif EMAIL_PROVIDER == 'mailgun':
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.environ.get('MAILGUN_SMTP_SERVER', 'smtp.mailgun.org')
    EMAIL_PORT = int(os.environ.get('MAILGUN_SMTP_PORT', '587'))
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = os.environ.get('MAILGUN_SMTP_LOGIN')
    EMAIL_HOST_PASSWORD = os.environ.get('MAILGUN_SMTP_PASSWORD')
else:
    # SMTP générique via variables d'environnement
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.environ.get('EMAIL_HOST')
    EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))
    EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True').lower() == 'true'
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL')
SERVER_EMAIL = os.environ.get('SERVER_EMAIL')

# Désactiver les fonctionnalités de debug
INTERNAL_IPS = []  # Vide en production

# Configuration des admins pour les notifications d'erreur
ADMINS = [
    ('Admin AGDE Moto', os.environ.get('ADMIN_EMAIL', 'admin@agdemoto.com')),
]
MANAGERS = ADMINS

# ========================================
# VALIDATION DE LA CONFIGURATION
# ========================================

# Vérifications de sécurité au démarrage
if DEBUG:
    raise ValueError("DEBUG ne doit JAMAIS être True en production !")

if not SECRET_KEY or len(SECRET_KEY) < 50:
    raise ValueError("SECRET_KEY trop courte ou manquante ! Minimum 50 caractères.")

if 'localhost' in ALLOWED_HOSTS or '127.0.0.1' in ALLOWED_HOSTS:
    import warnings
    warnings.warn(
        "ATTENTION : localhost/127.0.0.1 détecté dans ALLOWED_HOSTS en production !",
        UserWarning
    )

print("✅ Configuration de production chargée avec succès")
print(f"✅ Domaines autorisés : {', '.join(ALLOWED_HOSTS)}")
print(f"✅ Base de données : {DATABASES['default']['NAME']}@{DATABASES['default']['HOST']}")
print(f"✅ Cache Redis : Configuré")
print(f"✅ HTTPS : Activé")
print(f"✅ Logs : {BASE_DIR / 'logs'}")