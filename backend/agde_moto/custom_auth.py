"""Vue d'authentification personnalisée pour permettre la connexion avec email"""
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger('agde_moto')

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login(request):
    """
    Vue de connexion personnalisée qui accepte email ou nom d'utilisateur
    """
    username_or_email = request.data.get('username')
    password = request.data.get('password')
    
    if not username_or_email or not password:
        return Response({
            'error': 'Nom d\'utilisateur/email et mot de passe requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
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
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        logger.info(f"Connexion réussie pour: {user.email}")
        
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
    
    logger.warning(f"Tentative de connexion échouée pour: {username_or_email}")
    
    return Response({
        'error': 'Identifiants invalides'
    }, status=status.HTTP_401_UNAUTHORIZED)