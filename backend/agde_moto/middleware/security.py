"""Middleware de sécurité personnalisé pour ajouter des en-têtes de sécurité"""
import logging
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponseForbidden
from django.core.cache import cache
import time

logger = logging.getLogger('agde_moto')

class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Middleware pour ajouter des en-têtes de sécurité aux réponses
    """
    
    def process_response(self, request, response):
        # En-têtes de sécurité
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        # Content Security Policy
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self'; "
            "connect-src 'self'; "
            "frame-ancestors 'none';"
        )
        response['Content-Security-Policy'] = csp
        
        return response

class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware pour enregistrer les requêtes suspectes
    """
    
    def process_request(self, request):
        # Enregistrer les requêtes avec des User-Agents suspects
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        suspicious_agents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'nessus']
        
        if any(agent in user_agent.lower() for agent in suspicious_agents):
            logger.warning(f"Requête suspecte détectée - User-Agent: {user_agent} - IP: {request.META.get('REMOTE_ADDR')} - URL: {request.path}")
        
        # Détecter les tentatives d'injection SQL dans les paramètres
        sql_patterns = ['union', 'select', 'drop', 'insert', 'delete', 'update', '--', ';']
        
        for param_name, param_value in request.GET.items():
            if isinstance(param_value, str) and any(pattern in param_value.lower() for pattern in sql_patterns):
                logger.warning(f"Tentative d'injection SQL détectée - Paramètre: {param_name} - Valeur: {param_value} - IP: {request.META.get('REMOTE_ADDR')}")
        
        return None

class DDoSProtectionMiddleware(MiddlewareMixin):
    """
    Middleware simple de protection contre les attaques DDoS
    """
    
    def process_request(self, request):
        ip = request.META.get('REMOTE_ADDR')
        if not ip:
            return None
        
        # Clé pour le cache basée sur l'IP
        cache_key = f"ddos_protection_{ip}"
        
        # Récupérer le nombre de requêtes pour cette IP
        requests_count = cache.get(cache_key, 0)
        
        # Limite: 100 requêtes par minute
        if requests_count >= 100:
            logger.warning(f"Limite de requêtes dépassée pour l'IP: {ip} ({requests_count} requêtes)")
            return HttpResponseForbidden("Trop de requêtes. Veuillez réessayer plus tard.")
        
        # Incrémenter le compteur
        cache.set(cache_key, requests_count + 1, 60)  # 60 secondes
        
        return None