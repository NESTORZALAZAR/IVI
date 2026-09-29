from django.db import models
from django.contrib.auth.models import User


class ArchivoProcesado(models.Model):
	propietario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='archivos_procesados')
	nombre_original = models.CharField(max_length=255)
	tipo_mime = models.CharField(max_length=100, blank=True, default='')
	texto_extraido = models.TextField(blank=True, default='')
	creado_en = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-creado_en']


class ConversionAudio(models.Model):
	archivo = models.ForeignKey(ArchivoProcesado, on_delete=models.CASCADE, related_name='conversiones_audio')
	velocidad = models.DecimalField(max_digits=3, decimal_places=1, default=1.0)
	formato = models.CharField(max_length=20, default='mp3')
	creado_en = models.DateTimeField(auto_now_add=True)
