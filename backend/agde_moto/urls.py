from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .custom_auth import custom_login
from .password_reset import (
    request_password_reset,
    confirm_password_reset,
    request_admin_otp,
    confirm_admin_otp,
    verify_admin_otp,
    password_reset_metrics,
)
from .email_diagnostic import email_diagnostic_view
from .admin_diagnostic_view import admin_diagnostic_page
from .superadmin_views import list_admins, create_admin, delete_admin

def api_health(request):
    """Endpoint de santé de l'API"""
    return JsonResponse({
        'status': 'healthy',
        'message': 'Agde Moto API is running',
        'version': '1.0.0'
    })

# Importez les vues natives
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', api_health, name='api_health'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/', custom_login, name='custom_login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Password reset endpoints
    path('api/admin/password-reset/', request_password_reset, name='request_password_reset'),
    path('api/admin/password-reset/<str:uidb64>/<str:token>/', confirm_password_reset, name='confirm_password_reset'),
    path('api/admin/password-reset/metrics/', password_reset_metrics, name='password_reset_metrics'),
    # Admin OTP endpoints
    path('api/admin/otp/request/', request_admin_otp, name='request_admin_otp'),
    path('api/admin/otp/confirm/', confirm_admin_otp, name='confirm_admin_otp'),
    path('api/admin/otp/verify/', verify_admin_otp, name='verify_admin_otp'),
    # Email diagnostic endpoint
    path('admin/email-diagnostic/', email_diagnostic_view, name='email_diagnostic'),
    path('admin/diagnostic/', admin_diagnostic_page, name='admin_diagnostic_page'),
    # Ajout des URLs natives pour la réinitialisation de mot de passe
    path('api/password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('api/password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('api/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('api/motorcycles/', include('motorcycles.urls')),
    path('api/parts/', include('parts.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/garage/', include('garage.urls')),
    # Super admin endpoints
    path('api/superadmin/admins/', list_admins),
    path('api/superadmin/admins/create/', create_admin),
    path('api/superadmin/admins/<int:user_id>/', delete_admin),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
