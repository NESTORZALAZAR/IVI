from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError


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


class Profile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('paciente', 'Paciente'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='paciente')
    ci = models.CharField(max_length=64, unique=True, null=True, blank=True, help_text='Identificador único (CI) del paciente')

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"

    def clean(self):
        """Validaciones del modelo Profile.
        No se ejecuta automáticamente al guardar para evitar romper la creación
        de usuarios desde señales; la validación se aplica en formularios (admin/API).
        """
        if self.role == 'paciente':
            if not self.ci or not str(self.ci).strip():
                raise ValidationError({'ci': 'CI es obligatorio para pacientes'})



@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        try:
            instance.profile.save()
        except Exception:
            # En caso de que el profile no exista por alguna razón, crear uno
            Profile.objects.get_or_create(user=instance)
