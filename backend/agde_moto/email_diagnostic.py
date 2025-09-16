from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.mail import get_connection, send_mail
from smtplib import SMTPException, SMTPAuthenticationError, SMTPConnectError, SMTPRecipientsRefused
import json
import traceback
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["GET", "POST"])
@staff_member_required
def email_diagnostic_view(request):
    """Vue de diagnostic email pour les administrateurs"""
    
    if request.method == "GET":
        return get_email_configuration()
    elif request.method == "POST":
        return test_email_functionality(request)

def get_email_configuration():
    """Retourne la configuration email actuelle"""
    try:
        config = {
            'timestamp': datetime.now().isoformat(),
            'configuration': {
                'EMAIL_BACKEND': getattr(settings, 'EMAIL_BACKEND', 'Non défini'),
                'EMAIL_HOST': getattr(settings, 'EMAIL_HOST', 'Non défini'),
                'EMAIL_PORT': getattr(settings, 'EMAIL_PORT', 'Non défini'),
                'EMAIL_USE_TLS': getattr(settings, 'EMAIL_USE_TLS', 'Non défini'),
                'EMAIL_HOST_USER': '***masqué***' if getattr(settings, 'EMAIL_HOST_USER', None) else 'Non défini',
                'EMAIL_HOST_PASSWORD': '***masqué***' if getattr(settings, 'EMAIL_HOST_PASSWORD', None) else 'Non défini',
                'DEFAULT_FROM_EMAIL': getattr(settings, 'DEFAULT_FROM_EMAIL', 'Non défini'),
            },
            'status': 'success'
        }
        
        # Vérifications de configuration
        warnings = []
        
        if getattr(settings, 'EMAIL_BACKEND', '') == 'django.core.mail.backends.console.EmailBackend':
            warnings.append('Backend console activé - les emails ne seront pas envoyés')
        
        if not getattr(settings, 'EMAIL_HOST_USER', None):
            warnings.append('EMAIL_HOST_USER non défini')
            
        if not getattr(settings, 'EMAIL_HOST_PASSWORD', None):
            warnings.append('EMAIL_HOST_PASSWORD non défini')
            
        if getattr(settings, 'EMAIL_HOST', '') == 'smtp.gmail.com':
            if getattr(settings, 'EMAIL_PORT', 0) != 587:
                warnings.append(f'Port {getattr(settings, "EMAIL_PORT", "inconnu")} pour Gmail - recommandé: 587')
            if not getattr(settings, 'EMAIL_USE_TLS', False):
                warnings.append('TLS désactivé pour Gmail - recommandé: True')
        
        config['warnings'] = warnings
        
        return JsonResponse(config)
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Erreur lors de la récupération de la configuration: {str(e)}',
            'traceback': traceback.format_exc()
        }, status=500)

def test_email_functionality(request):
    """Teste la fonctionnalité email"""
    try:
        data = json.loads(request.body)
        test_type = data.get('test_type', 'connection')
        test_email = data.get('email', getattr(settings, 'EMAIL_HOST_USER', 'test@example.com'))
        
        results = {
            'timestamp': datetime.now().isoformat(),
            'test_type': test_type,
            'results': []
        }
        
        # Test 1: Configuration
        config_result = test_configuration()
        results['results'].append(config_result)
        
        # Test 2: Connexion SMTP
        if test_type in ['connection', 'full']:
            connection_result = test_smtp_connection()
            results['results'].append(connection_result)
            
            # Test 3: Envoi d'email (seulement si la connexion fonctionne)
            if test_type == 'full' and connection_result['status'] == 'success':
                email_result = test_email_sending(test_email)
                results['results'].append(email_result)
        
        # Déterminer le statut global
        all_success = all(result['status'] == 'success' for result in results['results'])
        results['overall_status'] = 'success' if all_success else 'partial' if any(result['status'] == 'success' for result in results['results']) else 'failure'
        
        return JsonResponse(results)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Données JSON invalides'
        }, status=400)
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Erreur lors du test: {str(e)}',
            'traceback': traceback.format_exc()
        }, status=500)

def test_configuration():
    """Teste la configuration email"""
    result = {
        'test_name': 'Configuration Email',
        'status': 'success',
        'details': [],
        'errors': []
    }
    
    try:
        # Vérifier les paramètres essentiels
        backend = getattr(settings, 'EMAIL_BACKEND', None)
        if not backend:
            result['errors'].append('EMAIL_BACKEND non défini')
        else:
            result['details'].append(f'Backend: {backend}')
        
        if backend != 'django.core.mail.backends.console.EmailBackend':
            host = getattr(settings, 'EMAIL_HOST', None)
            port = getattr(settings, 'EMAIL_PORT', None)
            user = getattr(settings, 'EMAIL_HOST_USER', None)
            password = getattr(settings, 'EMAIL_HOST_PASSWORD', None)
            
            if not host:
                result['errors'].append('EMAIL_HOST non défini')
            else:
                result['details'].append(f'Host: {host}')
                
            if not port:
                result['errors'].append('EMAIL_PORT non défini')
            else:
                result['details'].append(f'Port: {port}')
                
            if not user:
                result['errors'].append('EMAIL_HOST_USER non défini')
            else:
                result['details'].append('User: ***masqué***')
                
            if not password:
                result['errors'].append('EMAIL_HOST_PASSWORD non défini')
            else:
                result['details'].append('Password: ***masqué***')
        
        if result['errors']:
            result['status'] = 'failure'
            
    except Exception as e:
        result['status'] = 'error'
        result['errors'].append(f'Erreur de configuration: {str(e)}')
    
    return result

def test_smtp_connection():
    """Teste la connexion SMTP"""
    result = {
        'test_name': 'Connexion SMTP',
        'status': 'success',
        'details': [],
        'errors': []
    }
    
    try:
        backend = getattr(settings, 'EMAIL_BACKEND', '')
        
        if backend == 'django.core.mail.backends.console.EmailBackend':
            result['details'].append('Backend console - pas de connexion SMTP nécessaire')
            return result
        
        result['details'].append('Tentative de connexion SMTP...')
        connection = get_connection()
        connection.open()
        result['details'].append('✓ Connexion SMTP établie')
        connection.close()
        result['details'].append('✓ Connexion fermée proprement')
        
    except SMTPAuthenticationError as e:
        result['status'] = 'failure'
        result['errors'].append(f'Erreur d\'authentification SMTP: {str(e)}')
        result['errors'].append('Vérifiez EMAIL_HOST_USER et EMAIL_HOST_PASSWORD')
        
    except SMTPConnectError as e:
        result['status'] = 'failure'
        result['errors'].append(f'Erreur de connexion SMTP: {str(e)}')
        result['errors'].append('Vérifiez EMAIL_HOST et EMAIL_PORT')
        
    except SMTPException as e:
        result['status'] = 'failure'
        result['errors'].append(f'Erreur SMTP: {str(e)}')
        
    except Exception as e:
        result['status'] = 'error'
        result['errors'].append(f'Erreur inattendue: {str(e)}')
    
    return result

def test_email_sending(test_email):
    """Teste l'envoi d'un email"""
    result = {
        'test_name': 'Envoi d\'Email',
        'status': 'success',
        'details': [],
        'errors': []
    }
    
    try:
        result['details'].append(f'Envoi d\'un email de test à: {test_email}')
        
        send_mail(
            subject='Test de diagnostic email - Agde Moto',
            message=f'Email de test envoyé le {datetime.now().strftime("%d/%m/%Y à %H:%M:%S")}\n\nCet email confirme que la configuration fonctionne correctement.',
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', test_email),
            recipient_list=[test_email],
            fail_silently=False,
        )
        
        result['details'].append('✓ Email envoyé avec succès')
        result['details'].append(f'Vérifiez votre boîte de réception: {test_email}')
        
    except SMTPAuthenticationError as e:
        result['status'] = 'failure'
        result['errors'].append(f'Erreur d\'authentification: {str(e)}')
        
    except SMTPConnectError as e:
        result['status'] = 'failure'
        result['errors'].append(f'Erreur de connexion: {str(e)}')
        
    except SMTPRecipientsRefused as e:
        result['status'] = 'failure'
        result['errors'].append(f'Destinataire refusé: {str(e)}')
        
    except SMTPException as e:
        result['status'] = 'failure'
        result['errors'].append(f'Erreur SMTP: {str(e)}')
        
    except Exception as e:
        result['status'] = 'error'
        result['errors'].append(f'Erreur inattendue: {str(e)}')
    
    return result