"""Vue d'authentification personnalisée pour permettre la connexion avec email"""
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.cache import cache
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_ratelimit.decorators import ratelimit
import logging
import hashlib

logger = logging.getLogger('agde_moto')

@ratelimit(key='ip', rate='5/m', method='POST', block=True)
@ratelimit(key='post:username', rate='3/m', method='POST', block=True)
@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login(request):
    """
    Vue de connexion personnalisée qui accepte email ou nom d'utilisateur
    """
    username_or_email = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    
    # Validation des entrées
    if not username_or_email or not password:
        logger.warning(f"Tentative de connexion avec des champs vides depuis {request.META.get('REMOTE_ADDR')}")
        return Response({
            'error': 'Nom d\'utilisateur/email et mot de passe requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Vérification de la longueur pour éviter les attaques
    if len(username_or_email) > 150 or len(password) > 128:
        logger.warning(f"Tentative de connexion avec des champs trop longs depuis {request.META.get('REMOTE_ADDR')}")
        return Response({
            'error': 'Identifiants invalides'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Vérification du blocage temporaire pour cet utilisateur
    user_key = f"login_attempts_{hashlib.md5(username_or_email.encode()).hexdigest()}"
    attempts = cache.get(user_key, 0)
    
    if attempts >= 5:
        logger.warning(f"Compte temporairement bloqué: {username_or_email} depuis {request.META.get('REMOTE_ADDR')}")
        return Response({
            'error': 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
    
    # Essayer d'abord avec le nom d'utilisateur
    user = authenticate(username=username_or_email, password=password)
    
    # Si échec, essayer avec l'email
    if not user:
        try:
            # Rechercher l'utilisateur par email
            user_obj = User.objects.get(email=username_or_email)
            # Authentifier avec le nom d'utilisateur trouvé
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None
    
    if user and user.is_active:
        # Réinitialiser le compteur de tentatives en cas de succès
        cache.delete(user_key)
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Enregistrer la connexion réussie
        logger.info(f"Connexion réussie pour: {user.email} depuis {request.META.get('REMOTE_ADDR')} à {timezone.now()}")
        
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }
        }, status=status.HTTP_200_OK)
    
    # Incrémenter le compteur de tentatives échouées
    cache.set(user_key, attempts + 1, 900)  # 15 minutes
    
    logger.warning(f"Tentative de connexion échouée pour: {username_or_email} depuis {request.META.get('REMOTE_ADDR')} à {timezone.now()} (tentative {attempts + 1})")
    
    return Response({
        'error': 'Identifiants invalides'
    }, status=status.HTTP_401_UNAUTHORIZED)