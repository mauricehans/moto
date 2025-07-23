from django.contrib import admin
from .models import GarageSettings


@admin.register(GarageSettings)
class GarageSettingsAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    
    def has_add_permission(self, request):
        # Empêcher la création de plusieurs instances
        return not GarageSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Empêcher la suppression des paramètres
        return False