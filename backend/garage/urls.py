from django.urls import path
from . import views

urlpatterns = [
    path('settings/', views.garage_settings_view, name='garage_settings'),
]