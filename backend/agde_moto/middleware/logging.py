"""Middleware de logging pour Agde Moto"""
import logging
import time
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse

logger = logging.getLogger('agde_moto')

class LoggingMiddleware(MiddlewareMixin):
    """Middleware pour logger les requêtes et réponses"""
    
    def __init__(self, get_response):
        self.get_response = get_response
        super().__init__(get_response)
    
    def __call__(self, request):
        # Marquer le début de la requête
        start_time = time.time()
        
        # Logger la requête entrante
        logger.info(
            f"Requête entrante: {request.method} {request.path} "
            f"de {self._get_client_ip(request)}"
        )
        
        # Traiter la requête
        response = self.get_response(request)
        
        # Calculer le temps de traitement
        processing_time = time.time() - start_time
        
        # Logger la réponse
        logger.info(
            f"Réponse: {request.method} {request.path} "
            f"-> {response.status_code} ({processing_time:.3f}s)"
        )
        
        return response
    
    def process_exception(self, request, exception):
        """Logger les exceptions"""
        logger.error(
            f"Exception dans {request.method} {request.path}: "
            f"{type(exception).__name__}: {str(exception)}"
        )
        
        if hasattr(request, 'user_email'):
            logger.error(f"Utilisateur: {request.user_email}")
        
        return None  # Laisser Django gérer l'exception
    
    def _get_client_ip(self, request):
        """Récupère l'IP du client"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
