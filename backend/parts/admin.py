from django.contrib import admin
from .models import Category, Part, PartImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']

@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'brand', 'price', 'stock', 'created_at']
    list_filter = ['category', 'brand', 'created_at']
    search_fields = ['name', 'brand', 'compatible_models']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(PartImage)
class PartImageAdmin(admin.ModelAdmin):
    list_display = ['part', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['part__name', 'part__brand']
