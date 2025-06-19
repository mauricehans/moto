"""
URL configuration for agde_moto project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from . import views

# API v1 patterns
api_v1_patterns = [
    path('auth/', include('apps.users.urls')),
    path('motorcycles/', include('apps.motorcycles.urls')),
    path('parts/', include('apps.parts.urls')),
    path('blog/', include('apps.blog.urls')),
]

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include(api_v1_patterns)),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Health check and status
    path('health/', views.health_check, name='health_check'),
    path('api/status/', views.api_status, name='api_status'),
    
    # Root
    path('', views.home, name='home'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)