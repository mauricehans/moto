from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import *

class PartsModelTest(TestCase):
    """Tests des modèles parts"""
    
    def setUp(self):
        """Configuration des tests"""
        pass
    
    def test_model_creation(self):
        """Test de création des modèles"""
        pass

class PartsAPITest(APITestCase):
    """Tests de l'API parts"""
    
    def setUp(self):
        """Configuration des tests API"""
        pass
    
    def test_api_endpoints(self):
        """Test des endpoints API"""
        pass
