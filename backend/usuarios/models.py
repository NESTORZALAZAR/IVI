from django.db import models
from django.contrib.auth.models import User


class ResultadoPrueba(models.Model):
    """
    Modelo para almacenar los resultados de las pruebas de dislexia de cada usuario.
    """
    TIPO_PRUEBA_CHOICES = [
        ('lectura', 'Prueba de Lectura'),
        ('velocidad', 'Prueba de Velocidad'),
        ('comprension', 'Prueba de Comprensión'),
        ('ortografia', 'Prueba de Ortografía'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resultados_pruebas')
    tipo_prueba = models.CharField(max_length=20, choices=TIPO_PRUEBA_CHOICES)
    puntaje = models.IntegerField(help_text="Puntaje obtenido en la prueba (0-100)")
    fecha_prueba = models.DateTimeField(auto_now_add=True)
    duracion_segundos = models.IntegerField(default=0, help_text="Duración de la prueba en segundos")
    detalles = models.JSONField(default=dict, blank=True, help_text="Detalles adicionales de la prueba")
    estado = models.CharField(
        max_length=20,
        choices=[
            ('completada', 'Completada'),
            ('incompleta', 'Incompleta'),
            ('cancelada', 'Cancelada'),
        ],
        default='completada'
    )

    class Meta:
        ordering = ['-fecha_prueba']
        verbose_name = 'Resultado de Prueba'
        verbose_name_plural = 'Resultados de Pruebas'

    def __str__(self):
        return f"{self.usuario.username} - {self.get_tipo_prueba_display()} - {self.puntaje}%"
