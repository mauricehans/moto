#!/usr/bin/env python
"""
Script de test pour diagnostiquer la configuration email
Utilisation: python test_email_config.py
"""

import os
import sys
import django
from django.conf import settings
from django.core.mail import get_connection, send_mail
from smtplib import SMTPException, SMTPAuthenticationError, SMTPConnectError
import traceback
from datetime import datetime

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agde_moto.settings')
django.setup()

def print_separator(title):
    """Affiche un séparateur avec titre"""
    print("\n" + "="*60)
    print(f" {title} ")
    print("="*60)

def test_environment_variables():
    """Teste la présence des variables d'environnement email"""
    print_separator("TEST DES VARIABLES D'ENVIRONNEMENT")
    
    env_vars = [
        'EMAIL_BACKEND',
        'EMAIL_HOST',
        'EMAIL_PORT', 
        'EMAIL_USE_TLS',
        'EMAIL_HOST_USER',
        'EMAIL_HOST_PASSWORD',
        'DEFAULT_FROM_EMAIL'
    ]
    
    for var in env_vars:
        value = os.getenv(var, 'NON DÉFINIE')
        if var == 'EMAIL_HOST_PASSWORD' and value != 'NON DÉFINIE':
            # Masquer le mot de passe
            masked_value = value[:4] + '*' * (len(value) - 4) if len(value) > 4 else '****'
            print(f"✓ {var}: {masked_value}")
        else:
            status = "✓" if value != 'NON DÉFINIE' else "✗"
            print(f"{status} {var}: {value}")

def test_django_settings():
    """Teste les paramètres Django email"""
    print_separator("TEST DES PARAMÈTRES DJANGO")
    
    django_settings = [
        'EMAIL_BACKEND',
        'EMAIL_HOST',
        'EMAIL_PORT',
        'EMAIL_USE_TLS',
        'EMAIL_HOST_USER',
        'EMAIL_HOST_PASSWORD',
        'DEFAULT_FROM_EMAIL'
    ]
    
    for setting_name in django_settings:
        try:
            value = getattr(settings, setting_name, 'NON DÉFINI')
            if setting_name == 'EMAIL_HOST_PASSWORD' and value != 'NON DÉFINI':
                masked_value = value[:4] + '*' * (len(value) - 4) if len(value) > 4 else '****'
                print(f"✓ {setting_name}: {masked_value}")
            else:
                status = "✓" if value != 'NON DÉFINI' else "✗"
                print(f"{status} {setting_name}: {value}")
        except Exception as e:
            print(f"✗ {setting_name}: ERREUR - {str(e)}")

def test_smtp_connection():
    """Teste la connexion SMTP"""
    print_separator("TEST DE CONNEXION SMTP")
    
    try:
        print("Tentative de connexion SMTP...")
        connection = get_connection()
        connection.open()
        print("✓ Connexion SMTP établie avec succès")
        connection.close()
        print("✓ Connexion SMTP fermée proprement")
        return True
        
    except SMTPAuthenticationError as e:
        print(f"✗ Erreur d'authentification SMTP:")
        print(f"   Code: {getattr(e, 'smtp_code', 'N/A')}")
        print(f"   Message: {getattr(e, 'smtp_error', str(e))}")
        print("   → Vérifiez EMAIL_HOST_USER et EMAIL_HOST_PASSWORD")
        return False
        
    except SMTPConnectError as e:
        print(f"✗ Erreur de connexion SMTP:")
        print(f"   Code: {getattr(e, 'smtp_code', 'N/A')}")
        print(f"   Message: {getattr(e, 'smtp_error', str(e))}")
        print("   → Vérifiez EMAIL_HOST et EMAIL_PORT")
        return False
        
    except SMTPException as e:
        print(f"✗ Erreur SMTP générique: {str(e)}")
        return False
        
    except Exception as e:
        print(f"✗ Erreur inattendue: {str(e)}")
        print(f"   Traceback: {traceback.format_exc()}")
        return False

def test_email_sending():
    """Teste l'envoi d'un email de test"""
    print_separator("TEST D'ENVOI D'EMAIL")
    
    # Email de test
    test_email = getattr(settings, 'EMAIL_HOST_USER', 'test@example.com')
    
    try:
        print(f"Envoi d'un email de test à: {test_email}")
        
        send_mail(
            subject='Test de configuration email - Agde Moto',
            message=f'Email de test envoyé le {datetime.now().strftime("%d/%m/%Y à %H:%M:%S")}\n\nSi vous recevez cet email, la configuration fonctionne correctement.',
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', test_email),
            recipient_list=[test_email],
            fail_silently=False,
        )
        
        print("✓ Email de test envoyé avec succès")
        print(f"   Vérifiez votre boîte de réception: {test_email}")
        return True
        
    except Exception as e:
        print(f"✗ Erreur lors de l'envoi: {str(e)}")
        print(f"   Traceback: {traceback.format_exc()}")
        return False

def generate_diagnostic_report():
    """Génère un rapport de diagnostic complet"""
    print_separator("RAPPORT DE DIAGNOSTIC")
    
    # Collecte des informations
    backend = getattr(settings, 'EMAIL_BACKEND', 'Non défini')
    host = getattr(settings, 'EMAIL_HOST', 'Non défini')
    port = getattr(settings, 'EMAIL_PORT', 'Non défini')
    use_tls = getattr(settings, 'EMAIL_USE_TLS', 'Non défini')
    
    print(f"Configuration actuelle:")
    print(f"  - Backend: {backend}")
    print(f"  - Host: {host}")
    print(f"  - Port: {port}")
    print(f"  - TLS: {use_tls}")
    
    # Recommandations
    print("\nRecommandations:")
    
    if backend == 'django.core.mail.backends.console.EmailBackend':
        print("  ⚠️  Backend console détecté - les emails s'affichent dans la console")
        print("     → Pour tester l'envoi réel, changez EMAIL_BACKEND vers smtp.EmailBackend")
    
    if host == 'smtp.gmail.com' and port != 587:
        print("  ⚠️  Configuration Gmail détectée avec un port incorrect")
        print("     → Gmail nécessite le port 587 avec TLS")
    
    if use_tls != True and host == 'smtp.gmail.com':
        print("  ⚠️  TLS désactivé pour Gmail")
        print("     → Gmail nécessite EMAIL_USE_TLS=True")

def main():
    """Fonction principale"""
    print("🔍 DIAGNOSTIC DE CONFIGURATION EMAIL - AGDE MOTO")
    print(f"Démarré le {datetime.now().strftime('%d/%m/%Y à %H:%M:%S')}")
    
    # Tests séquentiels
    test_environment_variables()
    test_django_settings()
    
    # Test de connexion
    connection_ok = test_smtp_connection()
    
    # Test d'envoi seulement si la connexion fonctionne
    if connection_ok:
        test_email_sending()
    else:
        print("\n⚠️  Test d'envoi ignoré car la connexion SMTP a échoué")
    
    # Rapport final
    generate_diagnostic_report()
    
    print_separator("FIN DU DIAGNOSTIC")
    print("Pour plus d'informations, consultez les logs Django dans docker-compose logs backend")

if __name__ == '__main__':
    main()