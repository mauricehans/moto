from django.contrib import admin
from .models import Motorcycle, MotorcycleImage

@admin.register(Motorcycle)
class MotorcycleAdmin(admin.ModelAdmin):
    list_display = ['brand', 'model', 'year', 'price', 'mileage', 'is_sold', 'created_at']
    list_filter = ['brand', 'year', 'is_sold', 'license', 'created_at']
    search_fields = ['brand', 'model', 'description']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_sold']

@admin.register(MotorcycleImage)
class MotorcycleImageAdmin(admin.ModelAdmin):
    list_display = ['motorcycle', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['motorcycle__brand', 'motorcycle__model']
