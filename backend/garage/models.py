from django.db import models
import json


class GarageSettings(models.Model):
    name = models.CharField(max_length=200, default='Agde Moto Gattuso')
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    
    # Réseaux sociaux stockés en JSON
    social_media_json = models.TextField(default='{"facebook": "", "instagram": "", "youtube": "", "twitter": "", "linkedin": ""}')
    
    # Horaires d'ouverture stockés en JSON avec support des intervalles multiples
    business_hours_json = models.TextField(default='{"monday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "18:00"}]}, "tuesday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "18:00"}]}, "wednesday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "18:00"}]}, "thursday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "18:00"}]}, "friday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "18:00"}]}, "saturday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "17:00"}]}, "sunday": {"is_closed": true, "intervals": []}}')
    
    # Paramètres SEO stockés en JSON
    seo_settings_json = models.TextField(default='{"meta_title": "", "meta_description": "", "meta_keywords": "", "og_title": "", "og_description": "", "og_image": ""}')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Paramètres du garage'
        verbose_name_plural = 'Paramètres du garage'
    
    def __str__(self):
        return self.name
    
    @property
    def social_media(self):
        try:
            return json.loads(self.social_media_json)
        except json.JSONDecodeError:
            return {"facebook": "", "instagram": "", "youtube": "", "twitter": "", "linkedin": ""}
    
    @social_media.setter
    def social_media(self, value):
        self.social_media_json = json.dumps(value)
    
    @property
    def business_hours(self):
        try:
            return json.loads(self.business_hours_json)
        except json.JSONDecodeError:
            return {
                "monday": {"is_closed": False, "intervals": [{"open": "09:00", "close": "18:00"}]},
                "tuesday": {"is_closed": False, "intervals": [{"open": "09:00", "close": "18:00"}]},
                "wednesday": {"is_closed": False, "intervals": [{"open": "09:00", "close": "18:00"}]},
                "thursday": {"is_closed": False, "intervals": [{"open": "09:00", "close": "18:00"}]},
                "friday": {"is_closed": False, "intervals": [{"open": "09:00", "close": "18:00"}]},
                "saturday": {"is_closed": False, "intervals": [{"open": "09:00", "close": "17:00"}]},
                "sunday": {"is_closed": True, "intervals": []}
            }
    
    @business_hours.setter
    def business_hours(self, value):
        self.business_hours_json = json.dumps(value)
    
    @property
    def seo_settings(self):
        try:
            return json.loads(self.seo_settings_json)
        except json.JSONDecodeError:
            return {"meta_title": "", "meta_description": "", "meta_keywords": "", "og_title": "", "og_description": "", "og_image": ""}
    
    @seo_settings.setter
    def seo_settings(self, value):
        self.seo_settings_json = json.dumps(value)
    
    @classmethod
    def get_settings(cls):
        """Récupère les paramètres du garage (crée une instance par défaut si aucune n'existe)"""
        settings, created = cls.objects.get_or_create(
            pk=1,
            defaults={
                'name': 'Agde Moto Gattuso',
                'address': '',
                'phone': '',
                'email': '',
                'website': '',
                'description': ''
            }
        )
        return settings