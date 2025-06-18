"""Système d'authentification JWT pour Agde Moto"""
import jwt
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from datetime import datetime, timedelta
import logging

logger = logging.getLogger('agde_moto')

class JWTAuthentication(BaseAuthentication):
    """Authentification JWT personnalisée"""
    
    def authenticate(self, request):
        """Authentifie l'utilisateur via JWT token"""
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header:
            return None
        
        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(
                token, 
                settings.JWT_SECRET_KEY, 
                algorithms=[settings.JWT_ALGORITHM]
            )
            
            user_id = payload.get('user_id')
            if not user_id:
                raise AuthenticationFailed('Token invalide')
            
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                raise AuthenticationFailed('Utilisateur non trouvé')
            
            return (user, None)
            
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expiré')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Token invalide')
        except IndexError:
            raise AuthenticationFailed('Format de token invalide')

def generate_jwt_token(user):
    """Génère un token JWT pour un utilisateur"""
    payload = {
        'user_id': user.id,
        'email': user.email,
        'username': user.username,
        'exp': datetime.utcnow() + timedelta(seconds=settings.JWT_EXPIRATION_DELTA),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(
        payload, 
        settings.JWT_SECRET_KEY, 
        algorithm=settings.JWT_ALGORITHM
    )
    
    logger.info(f"Token JWT généré pour l'utilisateur: {user.email}")
    return token

def verify_jwt_token(token):
    """Vérifie et décode un token JWT"""
    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET_KEY, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token expiré')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed('Token invalide')
