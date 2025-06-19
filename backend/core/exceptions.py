"""
Custom exception handlers
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger('apps')


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides more detailed error responses
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Log the exception
        logger.error(f"API Exception: {exc}", exc_info=True)
        
        custom_response_data = {
            'error': {
                'status_code': response.status_code,
                'message': 'Une erreur est survenue',
                'details': response.data
            }
        }
        
        # Customize error messages based on status code
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            custom_response_data['error']['message'] = 'Données invalides'
        elif response.status_code == status.HTTP_401_UNAUTHORIZED:
            custom_response_data['error']['message'] = 'Authentification requise'
        elif response.status_code == status.HTTP_403_FORBIDDEN:
            custom_response_data['error']['message'] = 'Accès interdit'
        elif response.status_code == status.HTTP_404_NOT_FOUND:
            custom_response_data['error']['message'] = 'Ressource non trouvée'
        elif response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
            custom_response_data['error']['message'] = 'Méthode non autorisée'
        elif response.status_code >= 500:
            custom_response_data['error']['message'] = 'Erreur interne du serveur'
            # Don't expose internal details in production
            if not settings.DEBUG:
                custom_response_data['error']['details'] = 'Une erreur interne est survenue'

        response.data = custom_response_data

    return response


class BusinessLogicError(Exception):
    """
    Custom exception for business logic errors
    """
    def __init__(self, message, code=None):
        self.message = message
        self.code = code
        super().__init__(self.message)


class ValidationError(Exception):
    """
    Custom validation exception
    """
    def __init__(self, message, field=None):
        self.message = message
        self.field = field
        super().__init__(self.message)