from rest_framework import serializers
from .models import GarageSettings
import json
import html as html_module


class GarageSettingsSerializer(serializers.ModelSerializer):
    social_media = serializers.SerializerMethodField()
    business_hours = serializers.SerializerMethodField()
    seo_settings = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    
    class Meta:
        model = GarageSettings
        fields = [
            'id', 'name', 'address', 'phone', 'email', 'website', 'description',
            'social_media', 'business_hours', 'seo_settings',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_social_media(self, obj):
        return obj.social_media
    
    def get_business_hours(self, obj):
        return obj.business_hours
    
    def get_seo_settings(self, obj):
        return obj.seo_settings

    def get_description(self, obj):
        # Décode les entités HTML stockées par précaution côté entrée
        try:
            return html_module.unescape(obj.description or '')
        except Exception:
            return obj.description or ''
    
    def update(self, instance, validated_data):
        # Gérer les champs JSON séparément
        social_media = self.initial_data.get('social_media')
        business_hours = self.initial_data.get('business_hours')
        seo_settings = self.initial_data.get('seo_settings')
        
        if social_media:
            instance.social_media = social_media
        
        if business_hours:
            instance.business_hours = business_hours
        
        if seo_settings:
            instance.seo_settings = seo_settings
        
        # Mettre à jour les autres champs
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
