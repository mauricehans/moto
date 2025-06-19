"""
Parts URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'parts', views.PartViewSet)
router.register(r'images', views.PartImageViewSet)

app_name = 'parts'

urlpatterns = [
    path('', include(router.urls)),
]