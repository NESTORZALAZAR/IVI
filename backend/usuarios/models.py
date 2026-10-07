from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator


class TipoPrueba(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=120)
    categoria = models.CharField(max_length=30, default='evaluacion')
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ['codigo']
        verbose_name = 'Tipo de prueba'
        verbose_name_plural = 'Tipos de prueba'

    def __str__(self):
        return self.nombre


class ResultadoPrueba(models.Model):
    """
    Modelo para almacenar los resultados de las pruebas de dislexia de cada usuario.
    """
    paciente = models.ForeignKey('Paciente', on_delete=models.CASCADE, related_name='resultados_pruebas')
    prueba = models.ForeignKey(TipoPrueba, on_delete=models.PROTECT, related_name='resultados')
    puntaje = models.IntegerField(
        help_text="Puntaje obtenido en la prueba (0-100)",
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
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

    @property
    def usuario(self):
        return self.paciente.profile.user

    @property
    def tipo_prueba(self):
        return self.prueba.codigo

    def get_tipo_prueba_display(self):
        return self.prueba.nombre


class RespuestaResultado(models.Model):
    resultado = models.ForeignKey(ResultadoPrueba, on_delete=models.CASCADE, related_name='respuestas')
    clave = models.CharField(max_length=100)
    respuesta = models.JSONField(default=dict, blank=True)
    puntaje = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['resultado', 'clave'], name='respuesta_por_clave_unica'),
        ]


class Profile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('paciente', 'Paciente'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='paciente')

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(role__in=['admin', 'doctor', 'paciente']),
                name='profile_role_valido',
            ),
        ]

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"

    def _paciente(self):
        paciente, _ = Paciente.objects.get_or_create(profile=self)
        return paciente

    def _profesional(self):
        profesional, _ = Profesional.objects.get_or_create(profile=self)
        return profesional

    @property
    def ci(self):
        return self._paciente().ci if self.role == 'paciente' else None

    @ci.setter
    def ci(self, value):
        if self.role != 'paciente':
            return
        paciente = self._paciente()
        paciente.ci = value
        paciente.save(update_fields=['ci'])

    @property
    def age(self):
        return self._paciente().age if self.role == 'paciente' else None

    @age.setter
    def age(self, value):
        if self.role != 'paciente':
            return
        paciente = self._paciente()
        paciente.age = value
        paciente.save(update_fields=['age'])

    @property
    def is_office_patient(self):
        return self._paciente().is_office_patient if self.role == 'paciente' else False

    @is_office_patient.setter
    def is_office_patient(self, value):
        if self.role != 'paciente':
            return
        paciente = self._paciente()
        paciente.is_office_patient = value
        paciente.save(update_fields=['is_office_patient'])

    @property
    def license_number(self):
        return self._profesional().license_number if self.role == 'doctor' else ''

    @license_number.setter
    def license_number(self, value):
        if self.role != 'doctor':
            return
        profesional = self._profesional()
        profesional.license_number = value
        profesional.save(update_fields=['license_number'])

    @property
    def specialty(self):
        return self._profesional().specialty if self.role == 'doctor' else ''

    @specialty.setter
    def specialty(self, value):
        if self.role != 'doctor':
            return
        profesional = self._profesional()
        profesional.specialty = value
        profesional.save(update_fields=['specialty'])

    @property
    def institution(self):
        return self._profesional().institution if self.role == 'doctor' else ''

    @institution.setter
    def institution(self, value):
        if self.role != 'doctor':
            return
        profesional = self._profesional()
        profesional.institution = value
        profesional.save(update_fields=['institution'])

    def clean(self):
        """Validaciones del modelo Profile.
        No se ejecuta automáticamente al guardar para evitar romper la creación
        de usuarios desde señales; la validación se aplica en formularios (admin/API).
        """
        if self.role not in dict(self.ROLE_CHOICES):
            raise ValidationError({'role': 'Rol no válido'})


class Paciente(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='paciente')
    ci = models.CharField(max_length=64, unique=True, null=True, blank=True, help_text='Identificador único del paciente')
    age = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='Edad')
    is_office_patient = models.BooleanField(default=False, verbose_name='Paciente en consultorio')

    def __str__(self):
        return f'{self.profile.user.username} - {self.ci or "sin CI"}'


class Profesional(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='profesional')
    license_number = models.CharField(max_length=100, unique=True, null=True, blank=True, verbose_name='Matrícula profesional')
    specialty = models.CharField(max_length=150, blank=True, default='', verbose_name='Especialidad')
    institution = models.CharField(max_length=200, blank=True, default='', verbose_name='Institución')

    def __str__(self):
        return f'{self.profile.user.username} - {self.specialty or "sin especialidad"}'



@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    profile, _ = Profile.objects.get_or_create(
        user=instance,
        defaults={'role': 'admin' if instance.is_superuser else 'paciente'},
    )
    # Django superusers also need the IVI role to access admin routes.
    if instance.is_superuser and profile.role != 'admin':
        profile.role = 'admin'
        profile.save(update_fields=['role'])
