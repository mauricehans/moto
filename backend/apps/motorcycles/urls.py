"""
Motorcycle URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'motorcycles', views.MotorcycleViewSet)
router.register(r'images', views.MotorcycleImageViewSet)

app_name = 'motorcycles'

urlpatterns = [
    path('', include(router.urls)),
]