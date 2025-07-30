from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'', views.PartViewSet)  # Pas de préfixe supplémentaire
router.register(r'images', views.PartImageViewSet)

app_name = 'parts'

urlpatterns = [
    path('', include(router.urls)),
]
