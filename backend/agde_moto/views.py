"""Vues principales du projet Agde Moto"""
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import logging

logger = logging.getLogger('agde_moto')

def home(request):
    """Page d'accueil du site"""
    return JsonResponse({
        'message': 'Bienvenue sur Agde Moto Gattuso',
        'status': 'active',
        'version': '1.0.0'
    })

@api_view(['GET'])
def health_check(request):
    """Endpoint de vérification de santé du serveur"""
    return Response({
        'status': 'healthy',
        'message': 'Agde Moto API is running'
    })

@csrf_exempt
@api_view(['GET'])
def api_status(request):
    """Statut de l'API"""
    return Response({
        'api_status': 'active',
        'endpoints': {
            'motorcycles': '/api/motorcycles/',
            'blog': '/api/blog/',
            'parts': '/api/parts/',
            'admin': '/admin/'
        }
    })
