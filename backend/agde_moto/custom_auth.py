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
    Authentifie un utilisateur (email OU nom d'utilisateur) et renvoie des tokens JWT.
    """
    raw_username = (request.data.get('username') or '').strip()
    password = (request.data.get('password') or '')

    if not raw_username or not password:
        return Response({'error': 'Identifiants manquants'}, status=status.HTTP_400_BAD_REQUEST)

    email_like = raw_username.strip().lower()

    client_ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))
    if client_ip and ',' in client_ip:
        client_ip = client_ip.split(',')[0].strip()
    try:
        ip_hash = hashlib.sha256(f"{client_ip}:{email_like}".encode()).hexdigest()[:12]
    except Exception:
        ip_hash = 'unknown'

    logger.info(f"[LOGIN] Tentative de connexion - fingerprint={ip_hash}")

    user_obj = None
    # Essayer de trouver par email, sinon par username
    qs = User.objects.filter(email=email_like, is_active=True)
    if qs.exists():
        # Prioriser superuser/staff si doublons
        qs = qs.order_by('-is_superuser', '-is_staff', 'id')
        user_obj = qs.first()
    else:
        try:
            user_obj = User.objects.get(username=raw_username, is_active=True)
        except User.DoesNotExist:
            user_obj = None
    
    if user_obj:
        user = authenticate(request, username=user_obj.username, password=password)
        if user is not None and user.is_active:
            refresh = RefreshToken.for_user(user)
            logger.info(f"[LOGIN] Succès - user_id={user.id}")
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)

    logger.warning(f"[LOGIN] Échec d'authentification - fingerprint={ip_hash}")
    return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)