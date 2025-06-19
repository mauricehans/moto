"""
User URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'profiles', views.UserProfileViewSet)

app_name = 'users'

urlpatterns = [
    path('', include(router.urls)),
    path('token/', obtain_auth_token, name='api_token_auth'),
    path('', include('django.contrib.auth.urls')),
]