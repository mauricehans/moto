from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import GarageSettings
from .serializers import GarageSettingsSerializer


@api_view(['GET', 'PUT'])
def garage_settings_view(request):
    """
    Récupère ou met à jour les paramètres du garage
    """
    try:
        settings = GarageSettings.get_settings()
        
        if request.method == 'GET':
            # Accès libre en lecture
            serializer = GarageSettingsSerializer(settings)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            # Vérification de l'authentification pour les modifications
            if not request.user.is_authenticated:
                return Response(
                    {'error': 'Authentification requise pour modifier les paramètres'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            serializer = GarageSettingsSerializer(settings, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(
                    {'error': 'Données invalides', 'details': serializer.errors}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
    except Exception as e:
        return Response(
            {'error': f'Erreur lors du traitement des paramètres: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )