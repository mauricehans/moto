"""
Custom middleware
"""
import time
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('apps')


class LoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log request/response information
    """
    
    def process_request(self, request):
        request.start_time = time.time()
        
        # Log request info
        logger.info(f"Request: {request.method} {request.path}")
        if request.user.is_authenticated:
            logger.info(f"User: {request.user.username}")
        
        return None
    
    def process_response(self, request, response):
        # Calculate request duration
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            logger.info(f"Response: {response.status_code} - Duration: {duration:.2f}s")
        
        return response


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Middleware to add security headers
    """
    
    def process_response(self, request, response):
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        return response


class CorsMiddleware(MiddlewareMixin):
    """
    Custom CORS middleware for additional control
    """
    
    def process_response(self, request, response):
        # Add custom CORS headers if needed
        if request.path.startswith('/api/'):
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Max-Age'] = '86400'
        
        return response