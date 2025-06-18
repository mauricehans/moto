"""agde_moto URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from . import views

# Router pour l'API REST
router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include(router.urls)),
    path('api/auth/', include('django.contrib.auth.urls')),
    path('api/motorcycles/', include('motorcycles.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/parts/', include('parts.urls')),
    
    # Pages principales
    path('', views.home, name='home'),
    path('health/', views.health_check, name='health_check'),
]

# Servir les fichiers média en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
