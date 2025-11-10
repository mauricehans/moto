"""Vue personnalisée pour la réinitialisation de mot de passe des superusers"""
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from django.core.cache import cache
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_ratelimit.decorators import ratelimit
import logging
import traceback
from django.core.mail import get_connection
from smtplib import SMTPException, SMTPAuthenticationError, SMTPConnectError, SMTPRecipientsRefused
import random

User = get_user_model()
logger = logging.getLogger('agde_moto')

# Logger spécifique pour le débogage email
email_logger = logging.getLogger('agde_moto.email_debug')

# --- Helpers métriques simples ---
METRICS_KEYS = {
    'pr_requests': 'metrics:password_reset:requests',
    'pr_success': 'metrics:password_reset:success',
    'pr_failures': 'metrics:password_reset:failures',
    'emails_sent': 'metrics:password_reset:emails_sent',
    'otp_requests': 'metrics:otp:requests',
    'otp_verifications': 'metrics:otp:verifications',
    'otp_failures': 'metrics:otp:failures',
}

def _metrics_inc(key: str, step: int = 1):
    try:
        k = METRICS_KEYS[key]
        current = cache.get(k, 0)
        cache.set(k, int(current) + step, 24 * 3600)  # expire après 24h
    except Exception:
        pass

# --- Rate limited endpoints ---
@ratelimit(key='ip', rate='5/h', method='POST', block=True)
@ratelimit(key='post:email', rate='3/h', method='POST', block=True)
@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """
    Demande de réinitialisation de mot de passe pour les superusers uniquement
    """
    _metrics_inc('pr_requests')

    # Log de début de processus
    request_ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'Inconnue'))
    if request_ip and ',' in request_ip:
        request_ip = request_ip.split(',')[0].strip()
    
    logger.info(f"[PASSWORD_RESET] Début de demande de réinitialisation depuis IP: {request_ip}")
    
    email = request.data.get('email', '').strip().lower()
    
    if not email:
        logger.warning(f"[PASSWORD_RESET] Email manquant dans la requête depuis IP: {request_ip}")
        _metrics_inc('pr_failures')
        return Response({
            'error': 'Email requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    logger.info(f"[PASSWORD_RESET] Tentative de réinitialisation pour email: {email[:3]}***@{email.split('@')[1] if '@' in email else 'invalid'}")
    
    try:
        # Vérifier que l'utilisateur existe et est un superuser
        logger.info(f"[PASSWORD_RESET] Recherche de l'utilisateur dans la base de données")
        user = User.objects.get(email=email, is_superuser=True, is_active=True)
        logger.info(f"[PASSWORD_RESET] Utilisateur trouvé: {user.username} (ID: {user.pk})")
        
        # Générer le token de réinitialisation
        logger.info(f"[PASSWORD_RESET] Génération du token de sécurité")
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        logger.info(f"[PASSWORD_RESET] Token généré avec succès (UID: {uid[:8]}..., Token: {token[:8]}...)")
        
        # Créer le lien de réinitialisation
        logger.info(f"[PASSWORD_RESET] Construction du lien de réinitialisation")
        try:
            base_url = settings.CORS_ALLOWED_ORIGINS[0]
            reset_url = f"{base_url}/admin/password-reset/confirm/{uid}/{token}/"
            logger.info(f"[PASSWORD_RESET] Lien créé: {base_url}/admin/password-reset/confirm/[UID]/[TOKEN]/")
        except (IndexError, AttributeError) as e:
            logger.error(f"[PASSWORD_RESET] Erreur lors de la construction de l'URL: {e}")
            logger.error(f"[PASSWORD_RESET] CORS_ALLOWED_ORIGINS: {getattr(settings, 'CORS_ALLOWED_ORIGINS', 'Non défini')}")
            _metrics_inc('pr_failures')
            raise Exception(f"Configuration CORS_ALLOWED_ORIGINS manquante: {e}")
        
        # Préparer le contenu de l'email
        logger.info(f"[PASSWORD_RESET] Préparation du contenu de l'email")
        subject = 'Réinitialisation de mot de passe - Agde Moto Admin'
        
        # Contexte pour le template
        context = {
            'user': user,
            'reset_url': reset_url,
            'request_ip': request_ip,
            'current_year': 2024,
            'token_short': token[:8]
        }
        
        # Message texte simple
        text_message = f'''Bonjour {user.username},

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte administrateur Agde Moto.

Cliquez sur ce lien pour définir un nouveau mot de passe :
{reset_url}

IMPORTANT :
- Ce lien est valide pendant 24 heures seulement
- Il ne peut être utilisé qu'une seule fois
- Si vous n'avez pas demandé cette réinitialisation, ignorez cet email

Pour votre sécurité, choisissez un mot de passe d'au moins 8 caractères avec des lettres, chiffres et caractères spéciaux.

Cordialement,
L'équipe Agde Moto

Token de sécurité : {token[:8]}...'''
        
        # Tentative de rendu HTML (optionnel)
        html_message = None
        try:
            html_message = render_to_string('emails/password_reset_email.html', context)
        except Exception as e:
            logger.warning(f"Template HTML non trouvé, utilisation du texte simple: {e}")
        
        # Envoyer l'email avec logging détaillé
        logger.info(f"[PASSWORD_RESET] Début de l'envoi d'email")
        email_logger.info(f"Configuration email - FROM: {getattr(settings, 'DEFAULT_FROM_EMAIL', 'Non défini')}")
        email_logger.info(f"Configuration email - HOST: {getattr(settings, 'EMAIL_HOST', 'Non défini')}")
        email_logger.info(f"Configuration email - PORT: {getattr(settings, 'EMAIL_PORT', 'Non défini')}")
        email_logger.info(f"Configuration email - USE_TLS: {getattr(settings, 'EMAIL_USE_TLS', 'Non défini')}")
        email_logger.info(f"Configuration email - BACKEND: {getattr(settings, 'EMAIL_BACKEND', 'Non défini')}")
        
        try:
            # Test de connexion SMTP d'abord
            logger.info(f"[PASSWORD_RESET] Test de connexion SMTP")
            connection = get_connection()
            connection.open()
            logger.info(f"[PASSWORD_RESET] Connexion SMTP établie avec succès")
            connection.close()
            
            # Envoi de l'email
            logger.info(f"[PASSWORD_RESET] Envoi de l'email à {email}")
            send_mail(
                subject=f'Réinitialisation de mot de passe - Agde Moto',
                message=text_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            _metrics_inc('emails_sent')
            
            logger.info(f"[PASSWORD_RESET] Email envoyé avec succès à {email}")
            
            return Response({
                'message': 'Un email de réinitialisation a été envoyé à votre adresse.'
            }, status=status.HTTP_200_OK)
            
        except SMTPAuthenticationError as e:
            error_msg = f"Erreur d'authentification SMTP: {str(e)}"
            logger.error(f"[PASSWORD_RESET] {error_msg}")
            email_logger.error(f"SMTP Auth Error - Code: {e.smtp_code}, Message: {e.smtp_error}")
            _metrics_inc('pr_failures')
            return Response({
                'error': 'Erreur de configuration email (authentification). Contactez l\'administrateur.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except SMTPConnectError as e:
            error_msg = f"Erreur de connexion SMTP: {str(e)}"
            logger.error(f"[PASSWORD_RESET] {error_msg}")
            email_logger.error(f"SMTP Connect Error - Code: {e.smtp_code}, Message: {e.smtp_error}")
            _metrics_inc('pr_failures')
            return Response({
                'error': 'Erreur de connexion au serveur email. Contactez l\'administrateur.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except SMTPRecipientsRefused as e:
            error_msg = f"Destinataire refusé: {str(e)}"
            logger.error(f"[PASSWORD_RESET] {error_msg}")
            email_logger.error(f"SMTP Recipients Refused: {e.recipients}")
            _metrics_inc('pr_failures')
            return Response({
                'error': 'Adresse email invalide ou refusée.'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except SMTPException as e:
            error_msg = f"Erreur SMTP générique: {str(e)}"
            logger.error(f"[PASSWORD_RESET] {error_msg}")
            email_logger.error(f"SMTP Generic Error: {str(e)}")
            _metrics_inc('pr_failures')
            return Response({
                'error': 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            error_msg = f"Erreur inattendue lors de l'envoi: {str(e)}"
            logger.error(f"[PASSWORD_RESET] {error_msg}")
            email_logger.error(f"Unexpected Error: {str(e)}")
            email_logger.error(f"Traceback: {traceback.format_exc()}")
            _metrics_inc('pr_failures')
            return Response({
                'error': 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except User.DoesNotExist:
        # Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
        logger.warning(f"Tentative de réinitialisation pour un email non autorisé: {email}")
        return Response({
            'message': 'Si cet email correspond à un compte administrateur, un email de réinitialisation a été envoyé.'
        }, status=status.HTTP_200_OK)


@ratelimit(key='ip', rate='10/h', method='POST', block=True)
@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_password_reset(request, uidb64, token):
    """
    Confirmation de la réinitialisation de mot de passe
    """
    from django.utils.http import urlsafe_base64_decode
    from django.utils.encoding import force_str
    
    logger.info(f"[PASSWORD_CONFIRM] Début de confirmation de réinitialisation")
    
    new_password = request.data.get('new_password', '')
    confirm_password = request.data.get('confirm_password', '')
    
    logger.info(f"[PASSWORD_CONFIRM] Validation des paramètres - Passwords: {'✓' if new_password and confirm_password else '✗'}")
    
    if not new_password or not confirm_password:
        logger.warning(f"[PASSWORD_CONFIRM] Paramètres manquants")
        return Response({
            'error': 'Nouveau mot de passe et confirmation requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if new_password != confirm_password:
        logger.warning(f"[PASSWORD_CONFIRM] Mots de passe ne correspondent pas")
        return Response({
            'error': 'Les mots de passe ne correspondent pas'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 8:
        logger.warning(f"[PASSWORD_CONFIRM] Mot de passe trop court ({len(new_password)} caractères)")
        return Response({
            'error': 'Le mot de passe doit contenir au moins 8 caractères'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Décoder l'UID
        logger.info(f"[PASSWORD_CONFIRM] Décodage de l'UID")
        uid = force_str(urlsafe_base64_decode(uidb64))
        logger.info(f"[PASSWORD_CONFIRM] UID décodé - User ID: {uid}")
        
        user = User.objects.get(pk=uid, is_superuser=True, is_active=True)
        logger.info(f"[PASSWORD_CONFIRM] Utilisateur trouvé: {user.email} (Superuser: {user.is_superuser})")
        
        # Vérifier le token
        logger.info(f"[PASSWORD_CONFIRM] Vérification du token")
        if not default_token_generator.check_token(user, token):
            logger.warning(f"[PASSWORD_CONFIRM] Token invalide pour l'utilisateur {user.email}")
            return Response({
                'error': 'Lien de réinitialisation invalide ou expiré'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        logger.info(f"[PASSWORD_CONFIRM] Token valide - Mise à jour du mot de passe")
        
        # Changer le mot de passe
        user.set_password(new_password)
        user.save()
        _metrics_inc('pr_success')
        
        logger.info(f"[PASSWORD_CONFIRM] Mot de passe réinitialisé avec succès pour {user.email}")
        
        return Response({
            'message': 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
        }, status=status.HTTP_200_OK)
        
    except (TypeError, ValueError, OverflowError) as e:
        logger.error(f"[PASSWORD_CONFIRM] Erreur de décodage UID: {str(e)}")
        return Response({
            'error': 'Lien de réinitialisation invalide'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except User.DoesNotExist:
        logger.warning(f"[PASSWORD_CONFIRM] Utilisateur non trouvé pour UID: {uidb64}")
        return Response({
            'error': 'Lien de réinitialisation invalide'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"[PASSWORD_CONFIRM] Erreur inattendue: {str(e)}")
        logger.error(f"[PASSWORD_CONFIRM] Traceback: {traceback.format_exc()}")
        return Response({
            'error': 'Erreur lors de la réinitialisation.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- OTP Admin endpoints (voie alternative) ---
@ratelimit(key='ip', rate='10/h', method='POST', block=True)
@ratelimit(key='post:email', rate='5/h', method='POST', block=True)
@api_view(['POST'])
@permission_classes([AllowAny])
def request_admin_otp(request):
    """Demande un OTP à usage unique envoyé par email pour un superuser actif."""
    email = (request.data.get('email') or '').strip().lower()
    _metrics_inc('otp_requests')

    # Réponse uniforme pour la confidentialité
    def ok_response():
        return Response({'message': 'Si un compte administrateur existe pour cet email, un code a été envoyé.'}, status=status.HTTP_200_OK)

    if not email:
        return Response({'error': 'Email requis'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email, is_superuser=True, is_active=True)
    except User.DoesNotExist:
        # Ne pas révéler l'existence
        return ok_response()

    # Générer un OTP 6 chiffres
    code = "123456"  # Code fixe pour le développement
    cache_key = f"admin_otp:{email}"
    cache.set(cache_key, code, timeout=600)  # 10 minutes
    
    # Log le code OTP pour le développement
    print(f"[OTP] Code généré pour {email}: {code}")
    logger.info(f"[OTP] Code généré pour {email}: {code}")
    
    # Afficher le code dans la console (pour le développement)
    print("="*50)
    print(f"CODE OTP POUR {email}: {code}")
    print("="*50)

    # Envoyer email
    subject = 'Votre code de vérification (OTP) - Agde Moto Admin'
    message = f"Bonjour {user.username},\n\nVotre code de vérification est: {code}\nIl est valide 10 minutes.\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n\n— Agde Moto"
    try:
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
        _metrics_inc('emails_sent')
    except Exception as e:
        logger.error(f"[OTP] Erreur lors de l'envoi de l'OTP: {e}")
        # On reste silencieux pour ne pas divulguer d'info

    return ok_response()


@ratelimit(key='ip', rate='20/h', method='POST', block=True)
@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_admin_otp(request):
    """Vérifie un OTP et réinitialise le mot de passe."""
    email = (request.data.get('email') or '').strip().lower()
    code = (request.data.get('code') or '').strip()
    new_password = request.data.get('new_password', '').strip()

    if not email or not code or not new_password:
        _metrics_inc('otp_failures')
        return Response({'error': 'Email, code et nouveau mot de passe requis'}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 8:
        _metrics_inc('otp_failures')
        return Response({'error': 'Le mot de passe doit contenir au moins 8 caractères'}, status=status.HTTP_400_BAD_REQUEST)

    cache_key = f"admin_otp:{email}"
    stored_code = cache.get(cache_key)

    if not stored_code or stored_code != code:
        _metrics_inc('otp_failures')
        return Response({'error': 'Code invalide ou expiré'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email, is_superuser=True, is_active=True)
    except User.DoesNotExist:
        _metrics_inc('otp_failures')
        return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    # Mettre à jour le mot de passe
    user.set_password(new_password)
    user.save()

    # Nettoyer le cache et mettre à jour les métriques
    cache.delete(cache_key)
    _metrics_inc('otp_verifications')
    _metrics_inc('pr_success') 

    # Connecter l'utilisateur et retourner un token
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'Mot de passe réinitialisé avec succès.',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }, status=status.HTTP_200_OK)


# --- Metrics endpoint ---
@api_view(['GET'])
@permission_classes([IsAdminUser])
def password_reset_metrics(request):
    data = {name: cache.get(key, 0) for name, key in METRICS_KEYS.items()}
    return Response(data, status=status.HTTP_200_OK)
