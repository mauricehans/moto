#!/usr/bin/env python
"""
Script de test pour la réinitialisation de mot de passe
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

# Skip this diagnostic script when running under pytest
import os as _os
if _os.environ.get('PYTEST_CURRENT_TEST'):
    import pytest as _pytest
    _pytest.skip("Skipping diagnostic password reset script during pytest collection", allow_module_level=True)

# Configure Django only when not under pytest
if not _os.environ.get('PYTEST_CURRENT_TEST'):
    _os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agde_moto.settings')
    import django as _django
    _django.setup()

from django.core.cache import cache
from django.contrib.auth import get_user_model
from django.test import Client
import json

User = get_user_model()

def clear_rate_limit_cache():
    """Vider le cache de rate limiting"""
    print("🧹 Nettoyage du cache de rate limiting...")
    cache.clear()
    print("✅ Cache vidé avec succès")

def check_superuser(email):
    """Vérifier si l'utilisateur existe et est superuser"""
    try:
        user = User.objects.get(email=email)
        print(f"👤 Utilisateur trouvé: {user.username} ({user.email})")
        print(f"🔑 Superuser: {'✅ Oui' if user.is_superuser else '❌ Non'}")
        print(f"🟢 Actif: {'✅ Oui' if user.is_active else '❌ Non'}")
        return user
    except User.DoesNotExist:
        print(f"❌ Aucun utilisateur trouvé avec l'email: {email}")
        return None

def test_password_reset_api(email):
    """Tester l'API de réinitialisation de mot de passe"""
    client = Client()
    
    print(f"\n🧪 Test de l'API de réinitialisation pour: {email}")
    
    # Test de la demande de réinitialisation
    response = client.post('/api/admin/password-reset/', 
                          json.dumps({'email': email}),
                          content_type='application/json',
                          HTTP_HOST='127.0.0.1:8000')
    
    print(f"📡 Statut de la réponse: {response.status_code}")
    
    if response.status_code == 200:
        try:
            data = response.json()
            print(f"✅ Succès: {data.get('message', 'Pas de message')}")
            print("📧 Vérifiez la console du serveur Django pour voir l'email simulé")
        except:
            print(f"✅ Succès: {response.content.decode()}")
    elif response.status_code == 400:
        try:
            data = response.json()
            print(f"⚠️ Erreur de validation: {data.get('error', 'Erreur inconnue')}")
        except:
            print(f"⚠️ Erreur 400: {response.content.decode()}")
    elif response.status_code == 403:
        print("🚫 Rate limiting actif - Attendez ou videz le cache")
    elif response.status_code == 500:
        try:
            data = response.json()
            print(f"💥 Erreur serveur: {data.get('error', 'Erreur inconnue')}")
        except:
            print(f"💥 Erreur 500: {response.content.decode()}")
    else:
        print(f"❓ Réponse inattendue ({response.status_code}): {response.content.decode()[:200]}...")

def main():
    print("🔧 Test de la réinitialisation de mot de passe - Agde Moto")
    print("=" * 60)
    
    email = "nonhanspc@gmail.com"
    
    # 1. Vider le cache
    clear_rate_limit_cache()
    
    # 2. Vérifier l'utilisateur
    print(f"\n👤 Vérification de l'utilisateur: {email}")
    user = check_superuser(email)
    
    if not user:
        print("\n❌ Impossible de continuer sans utilisateur valide")
        return
    
    # 3. Tester l'API
    test_password_reset_api(email)
    
    print("\n📋 Instructions:")
    print("1. Si le test réussit, l'email sera affiché dans la console du serveur Django")
    print("2. Copiez le lien de réinitialisation depuis la console")
    print("3. Testez le lien dans votre navigateur")
    print("4. Pour production, configurez un vrai service SMTP dans .env")
    
if __name__ == '__main__':
    main()