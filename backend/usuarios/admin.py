from django.contrib import admin
from .models import ResultadoPrueba


@admin.register(ResultadoPrueba)
class ResultadoPruebaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'tipo_prueba', 'puntaje', 'fecha_prueba', 'estado')
    list_filter = ('tipo_prueba', 'estado', 'fecha_prueba')
    search_fields = ('usuario__username', 'usuario__email')
    readonly_fields = ('fecha_prueba',)
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('usuario', 'tipo_prueba', 'puntaje', 'estado')
        }),
        ('Detalles', {
            'fields': ('duracion_segundos', 'detalles', 'fecha_prueba')
        }),
    )
