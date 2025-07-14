#!/usr/bin/env python3
"""Script pour créer un superutilisateur"""

import os
import sys
import django

# Ajouter le dossier backend au path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configuration Django (utiliser les settings de développement)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agde_moto.settings')
django.setup()

from django.contrib.auth import get_user_model

# Utiliser le bon modèle User
User = get_user_model()

# Créer un superutilisateur
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@agdemoto.fr',
        password='admin123'
    )
    print("[OK] Superutilisateur créé: admin / admin123")
else:
    print("[INFO] Superutilisateur déjà existant")
