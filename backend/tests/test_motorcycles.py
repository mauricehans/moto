"""
Tests for motorcycle functionality
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.motorcycles.models import Motorcycle, MotorcycleImage
from apps.motorcycles.services import MotorcycleService

User = get_user_model()


class MotorcycleModelTest(TestCase):
    """
    Test motorcycle model
    """
    
    def setUp(self):
        self.motorcycle_data = {
            'brand': 'Yamaha',
            'model': 'MT-07',
            'year': 2022,
            'price': 6999.00,
            'mileage': 3500,
            'engine': '689cc',
            'power': 73,
            'license': 'A2',
            'color': 'Noir',
            'description': 'Excellente moto',
            'features': ['ABS', 'LED']
        }
    
    def test_motorcycle_creation(self):
        """Test motorcycle creation"""
        motorcycle = Motorcycle.objects.create(**self.motorcycle_data)
        self.assertEqual(motorcycle.brand, 'Yamaha')
        self.assertEqual(motorcycle.model, 'MT-07')
        self.assertFalse(motorcycle.is_sold)
        self.assertFalse(motorcycle.is_deleted)
        self.assertTrue(motorcycle.slug)
    
    def test_motorcycle_str(self):
        """Test motorcycle string representation"""
        motorcycle = Motorcycle.objects.create(**self.motorcycle_data)
        expected_str = f"{motorcycle.brand} {motorcycle.model} ({motorcycle.year})"
        self.assertEqual(str(motorcycle), expected_str)


class MotorcycleServiceTest(TestCase):
    """
    Test motorcycle service
    """
    
    def setUp(self):
        self.service = MotorcycleService()
        self.motorcycle_data = {
            'brand': 'Honda',
            'model': 'CB650R',
            'year': 2021,
            'price': 7499.00,
            'mileage': 8200,
            'engine': '649cc',
            'power': 95,
            'license': 'A',
            'color': 'Rouge',
            'description': 'Très belle moto',
            'features': ['ABS', 'Contrôle de traction']
        }
    
    def test_create_motorcycle(self):
        """Test motorcycle creation through service"""
        motorcycle = self.service.create_motorcycle(self.motorcycle_data)
        self.assertEqual(motorcycle.brand, 'Honda')
        self.assertEqual(motorcycle.model, 'CB650R')
    
    def test_get_featured_motorcycles(self):
        """Test getting featured motorcycles"""
        # Create a featured motorcycle
        motorcycle_data = self.motorcycle_data.copy()
        motorcycle_data['is_featured'] = True
        self.service.create_motorcycle(motorcycle_data)
        
        featured = self.service.get_featured_motorcycles()
        self.assertEqual(len(featured), 1)
        self.assertTrue(featured[0].is_featured)