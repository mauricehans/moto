#!/usr/bin/env python
"""
Script pour résoudre les problèmes de réinitialisation de mot de passe
"""

import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agde_moto.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.management import call_command

User = get_user_model()

def main():
    print("🔧 Diagnostic et réparation du système de réinitialisation de mot de passe")
    print("=" * 70)
    
    # 1. Vérifier l'utilisateur
    email = "nonhanspc@gmail.com"
    print(f"\n1. Vérification de l'utilisateur: {email}")
    
    try:
        user = User.objects.get(email=email)
        print(f"   ✅ Utilisateur trouvé: {user.username}")
        print(f"   - Superuser: {user.is_superuser}")
        print(f"   - Actif: {user.is_active}")
        print(f"   - Staff: {user.is_staff}")
        
        if not user.is_superuser:
            print("   ⚠️  L'utilisateur n'est pas un superuser. Mise à jour...")
            user.is_superuser = True
            user.is_staff = True
            user.save()
            print("   ✅ Utilisateur mis à jour comme superuser")
            
    except User.DoesNotExist:
        print(f"   ❌ Utilisateur non trouvé. Création...")
        user = User.objects.create_user(
            username='admin_nonhans',
            email=email,
            password='TempPassword123!',
            is_superuser=True,
            is_staff=True,
            is_active=True
        )
        print(f"   ✅ Superuser créé: {user.username}")
        print(f"   📝 Mot de passe temporaire: TempPassword123!")
    
    # 2. Réinitialiser le cache (rate limiting)
    print("\n2. Réinitialisation du cache (rate limiting)")
    try:
        cache.clear()
        print("   ✅ Cache vidé avec succès")
    except Exception as e:
        print(f"   ⚠️  Erreur lors du vidage du cache: {e}")
    
    # 3. Créer la table de cache si nécessaire
    print("\n3. Vérification de la table de cache")
    try:
        call_command('createcachetable', verbosity=0)
        print("   ✅ Table de cache créée/vérifiée")
    except Exception as e:
        print(f"   ⚠️  Erreur avec la table de cache: {e}")
    
    # 4. Vérifier la configuration email
    print("\n4. Vérification de la configuration email")
    from django.conf import settings
    
    if settings.EMAIL_HOST_USER:
        print(f"   ✅ EMAIL_HOST_USER configuré: {settings.EMAIL_HOST_USER}")
    else:
        print("   ⚠️  EMAIL_HOST_USER non configuré")
        print("   📝 Ajoutez EMAIL_HOST_USER et EMAIL_HOST_PASSWORD dans .env")
    
    if settings.EMAIL_HOST_PASSWORD:
        print("   ✅ EMAIL_HOST_PASSWORD configuré")
    else:
        print("   ⚠️  EMAIL_HOST_PASSWORD non configuré")
    
    print("\n" + "=" * 70)
    print("🎉 Diagnostic terminé!")
    print("\n📋 Prochaines étapes:")
    print("   1. Configurez les variables EMAIL_* dans le fichier .env")
    print("   2. Redémarrez le serveur Django")
    print("   3. Testez la réinitialisation de mot de passe")
    print(f"   4. Utilisez l'email: {email}")

if __name__ == '__main__':
    main()