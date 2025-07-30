"""Vue personnalisée pour la réinitialisation de mot de passe des superusers"""
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
# from django_ratelimit.decorators import ratelimit  # Temporairement désactivé
import logging

User = get_user_model()
logger = logging.getLogger('agde_moto')

# @ratelimit(key='ip', rate='3/h', method='POST', block=True)  # Temporairement désactivé
@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """
    Demande de réinitialisation de mot de passe pour les superusers uniquement
    """
    email = request.data.get('email', '').strip().lower()
    
    if not email:
        return Response({
            'error': 'Email requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Vérifier que l'utilisateur existe et est un superuser
        user = User.objects.get(email=email, is_superuser=True, is_active=True)
        
        # Générer le token de réinitialisation
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Créer le lien de réinitialisation
        reset_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/admin/reset-password/{uid}/{token}/"
        
        # Préparer le contenu de l'email
        subject = 'Réinitialisation de mot de passe - Agde Moto Admin'
        
        # Obtenir l'IP de la requête
        request_ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'Inconnue'))
        if request_ip and ',' in request_ip:
            request_ip = request_ip.split(',')[0].strip()
        
        # Contexte pour le template
        context = {
            'user': user,
            'reset_url': reset_url,
            'request_ip': request_ip,
            'current_year': 2024
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
        
        # Envoyer l'email
        try:
            send_mail(
                subject=f'Réinitialisation de mot de passe - Agde Moto',
                message=text_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Email de réinitialisation envoyé à {email}")
            
            return Response({
                'message': 'Un email de réinitialisation a été envoyé à votre adresse.'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erreur lors de l'envoi de l'email à {email}: {str(e)}")
            return Response({
                'error': 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except User.DoesNotExist:
        # Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
        logger.warning(f"Tentative de réinitialisation pour un email non autorisé: {email}")
        return Response({
            'message': 'Si cet email correspond à un compte administrateur, un email de réinitialisation a été envoyé.'
        }, status=status.HTTP_200_OK)


# @ratelimit(key='ip', rate='5/h', method='POST', block=True)  # Temporairement désactivé
@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_password_reset(request, uidb64, token):
    """
    Confirmation de la réinitialisation de mot de passe
    """
    from django.utils.http import urlsafe_base64_decode
    from django.utils.encoding import force_str
    
    new_password = request.data.get('new_password', '')
    confirm_password = request.data.get('confirm_password', '')
    
    if not new_password or not confirm_password:
        return Response({
            'error': 'Nouveau mot de passe et confirmation requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if new_password != confirm_password:
        return Response({
            'error': 'Les mots de passe ne correspondent pas'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 8:
        return Response({
            'error': 'Le mot de passe doit contenir au moins 8 caractères'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Décoder l'UID
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid, is_superuser=True, is_active=True)
        
        # Vérifier le token
        if not default_token_generator.check_token(user, token):
            return Response({
                'error': 'Lien de réinitialisation invalide ou expiré'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Changer le mot de passe
        user.set_password(new_password)
        user.save()
        
        logger.info(f"Mot de passe réinitialisé avec succès pour {user.email}")
        
        return Response({
            'message': 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
        }, status=status.HTTP_200_OK)
        
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        logger.warning(f"Tentative de réinitialisation avec un lien invalide: {uidb64}/{token}")
        return Response({
            'error': 'Lien de réinitialisation invalide'
        }, status=status.HTTP_400_BAD_REQUEST)