from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MotorcycleViewSet, MotorcycleImageViewSet

router = DefaultRouter()
router.register(r'', MotorcycleViewSet)  # Pas de préfixe supplémentaire
router.register(r'images', MotorcycleImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
