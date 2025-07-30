#!/usr/bin/env python
"""Script de test pour isoler le problème Django"""
import os
import sys
import django
from django.conf import settings

# Ajouter le répertoire backend au path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Configuration minimale de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agde_moto.settings')

try:
    print("Tentative d'initialisation de Django...")
    django.setup()
    print("✓ Django initialisé avec succès!")
    
    # Test d'import des applications
    print("\nTest des imports d'applications:")
    
    try:
        from agde_moto import settings as app_settings
        print("✓ Settings importés")
    except Exception as e:
        print(f"✗ Erreur settings: {e}")
    
    try:
        from blog import models as blog_models
        print("✓ Blog models importés")
    except Exception as e:
        print(f"✗ Erreur blog models: {e}")
    
    try:
        from garage import models as garage_models
        print("✓ Garage models importés")
    except Exception as e:
        print(f"✗ Erreur garage models: {e}")
    
    try:
        from motorcycles import models as moto_models
        print("✓ Motorcycles models importés")
    except Exception as e:
        print(f"✗ Erreur motorcycles models: {e}")
    
    print("\n✓ Tous les tests passés!")
    
except Exception as e:
    print(f"✗ Erreur lors de l'initialisation de Django: {e}")
    import traceback
    traceback.print_exc()