#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de génération de secrets sécurisés pour AGDE Moto
Utilise des méthodes cryptographiquement sûres pour générer :
- SECRET_KEY Django
- Mots de passe de base de données
- Clés JWT
- Autres secrets nécessaires
"""

import secrets
import string
import hashlib
import os
from datetime import datetime

def generate_django_secret_key(length=50):
    """
    Génère une SECRET_KEY Django sécurisée
    Utilise des caractères alphanumériques et des symboles spéciaux
    """
    chars = string.ascii_letters + string.digits + '!@#$%^&*(-_=+)'
    return ''.join(secrets.choice(chars) for _ in range(length))

def generate_strong_password(length=32, include_symbols=True):
    """
    Génère un mot de passe fort pour la base de données
    """
    chars = string.ascii_letters + string.digits
    if include_symbols:
        chars += '!@#$%^&*-_=+'
    
    # S'assurer qu'on a au moins un caractère de chaque type
    password = [
        secrets.choice(string.ascii_lowercase),
        secrets.choice(string.ascii_uppercase),
        secrets.choice(string.digits)
    ]
    
    if include_symbols:
        password.append(secrets.choice('!@#$%^&*-_=+'))
    
    # Compléter avec des caractères aléatoires
    for _ in range(length - len(password)):
        password.append(secrets.choice(chars))
    
    # Mélanger la liste
    secrets.SystemRandom().shuffle(password)
    return ''.join(password)

def generate_jwt_secret(length=64):
    """
    Génère une clé secrète pour JWT
    """
    return secrets.token_urlsafe(length)

def generate_redis_password(length=32):
    """
    Génère un mot de passe Redis (sans caractères spéciaux problématiques)
    """
    chars = string.ascii_letters + string.digits + '-_'
    return ''.join(secrets.choice(chars) for _ in range(length))

def create_env_template():
    """
    Crée un template .env avec des valeurs générées
    """
    django_secret = generate_django_secret_key()
    db_password = generate_strong_password()
    jwt_secret = generate_jwt_secret()
    redis_password = generate_redis_password()
    
    template = f"""# ========================================
# CONFIGURATION DE SÉCURITÉ - AGDE MOTO
# Généré le {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
# ========================================

# Django Settings - CRITIQUE POUR LA SÉCURITÉ
SECRET_KEY={django_secret}
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Configuration HTTPS - OBLIGATOIRE EN PRODUCTION
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
SECURE_CONTENT_TYPE_NOSNIFF=True
SECURE_BROWSER_XSS_FILTER=True
X_FRAME_OPTIONS=DENY

# Database (PostgreSQL recommandé pour la production)
DB_NAME=agde_moto
DB_USER=agde_moto_user
DB_PASSWORD={db_password}
DB_HOST=localhost
DB_PORT=5432

# Cache (Redis pour la production)
REDIS_URL=redis://:{redis_password}@127.0.0.1:6379/1
REDIS_PASSWORD={redis_password}

# Configuration JWT - SÉCURITÉ RENFORCÉE
JWT_SECRET_KEY={jwt_secret}
JWT_ACCESS_TOKEN_LIFETIME=15
JWT_REFRESH_TOKEN_LIFETIME=1440

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@agdemoto.com
SERVER_EMAIL=admin@agdemoto.com

# CORS - RESTRICTIF EN PRODUCTION
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://yourdomain.com
CORS_ALLOW_ALL_ORIGINS=False

# File uploads
MAX_UPLOAD_SIZE=10485760  # 10MB

# Session Security
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_HTTPONLY=True
SESSION_COOKIE_SAMESITE=Strict
CSRF_COOKIE_SECURE=True
CSRF_COOKIE_HTTPONLY=True
CSRF_COOKIE_SAMESITE=Strict
"""
    return template

def main():
    print("🔐 Générateur de secrets sécurisés pour AGDE Moto")
    print("=" * 50)
    
    while True:
        print("\nOptions disponibles :")
        print("1. Générer une SECRET_KEY Django")
        print("2. Générer un mot de passe de base de données")
        print("3. Générer une clé JWT")
        print("4. Générer un mot de passe Redis")
        print("5. Créer un fichier .env complet")
        print("6. Quitter")
        
        choice = input("\nVotre choix (1-6) : ").strip()
        
        if choice == '1':
            secret_key = generate_django_secret_key()
            print(f"\n🔑 SECRET_KEY Django générée :")
            print(f"SECRET_KEY={secret_key}")
            
        elif choice == '2':
            db_password = generate_strong_password()
            print(f"\n🔒 Mot de passe de base de données généré :")
            print(f"DB_PASSWORD={db_password}")
            
        elif choice == '3':
            jwt_secret = generate_jwt_secret()
            print(f"\n🎫 Clé JWT générée :")
            print(f"JWT_SECRET_KEY={jwt_secret}")
            
        elif choice == '4':
            redis_password = generate_redis_password()
            print(f"\n📦 Mot de passe Redis généré :")
            print(f"REDIS_PASSWORD={redis_password}")
            
        elif choice == '5':
            template = create_env_template()
            filename = f".env.production.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(template)
            
            print(f"\n✅ Fichier .env complet créé : {filename}")
            print("⚠️  IMPORTANT : Copiez ce fichier vers .env et personnalisez les valeurs nécessaires")
            print("⚠️  SÉCURITÉ : Supprimez ce fichier après utilisation")
            
        elif choice == '6':
            print("\n👋 Au revoir !")
            break
            
        else:
            print("\n❌ Choix invalide. Veuillez choisir entre 1 et 6.")
        
        input("\nAppuyez sur Entrée pour continuer...")

if __name__ == "__main__":
    main()