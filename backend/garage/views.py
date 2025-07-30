from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
# from django_ratelimit.decorators import ratelimit  # Temporairement désactivé
from django.utils.html import escape
from .models import GarageSettings
from .serializers import GarageSettingsSerializer
import logging

logger = logging.getLogger('agde_moto')


# @ratelimit(key='ip', rate='30/m', method=['GET', 'PUT'], block=True)  # Temporairement désactivé
@api_view(['GET', 'PUT'])
@permission_classes([AllowAny])  # GET public, PUT vérifié manuellement
def garage_settings_view(request):
    """
    Récupère ou met à jour les paramètres du garage
    """
    try:
        settings = GarageSettings.get_settings()
        
        if request.method == 'GET':
            # Accès libre en lecture
            serializer = GarageSettingsSerializer(settings)
            logger.info(f"Consultation des paramètres du garage depuis {request.META.get('REMOTE_ADDR')}")
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            # Vérification de l'authentification et des permissions pour les modifications
            if not request.user.is_authenticated:
                logger.warning(f"Tentative de modification non authentifiée des paramètres depuis {request.META.get('REMOTE_ADDR')}")
                return Response(
                    {'error': 'Authentification requise pour modifier les paramètres'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Vérification des permissions admin
            if not (request.user.is_staff or request.user.is_superuser):
                logger.warning(f"Tentative de modification des paramètres par un utilisateur non autorisé: {request.user.username}")
                return Response(
                    {'error': 'Permissions administrateur requises'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Validation et nettoyage des données d'entrée
            cleaned_data = {}
            for key, value in request.data.items():
                if isinstance(value, str):
                    # Échapper les caractères HTML pour prévenir XSS
                    cleaned_data[key] = escape(value.strip())
                else:
                    cleaned_data[key] = value
            
            serializer = GarageSettingsSerializer(settings, data=cleaned_data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Paramètres du garage modifiés par {request.user.username} depuis {request.META.get('REMOTE_ADDR')}")
                return Response(serializer.data)
            else:
                logger.warning(f"Tentative de modification avec données invalides par {request.user.username}: {serializer.errors}")
                return Response(
                    {'error': 'Données invalides', 'details': serializer.errors}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
    except Exception as e:
        logger.error(f"Erreur lors du traitement des paramètres du garage: {str(e)} - Utilisateur: {getattr(request.user, 'username', 'Anonyme')} - IP: {request.META.get('REMOTE_ADDR')}")
        return Response(
            {'error': 'Erreur interne du serveur'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )