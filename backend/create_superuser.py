#!/usr/bin/env python3
"""Script pour créer un superutilisateur"""

import os
import django
from django.contrib.auth.models import User

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agde_moto.settings')
django.setup()

# Créer un superutilisateur
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@agdemoto.fr',
        password='admin123'
    )
    print("[OK] Superutilisateur cree: admin / admin123")
else:
    print("[INFO] Superutilisateur deja existant")
