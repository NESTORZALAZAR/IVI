from django.contrib import admin
from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.models import User
from .models import Paciente, Profesional, Profile, RespuestaResultado, ResultadoPrueba, TipoPrueba


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = '__all__'

    def clean(self):
        cleaned = super().clean()
        role = cleaned.get('role')
        ci = cleaned.get('ci')

        if role == 'paciente':
            if not ci or not str(ci).strip():
                raise ValidationError({'ci': 'CI es obligatorio para pacientes'})

        # Verificar unicidad de CI cuando exista
        if ci:
            qs = Paciente.objects.filter(ci=ci)
            if self.instance and self.instance.pk and hasattr(self.instance, 'paciente'):
                qs = qs.exclude(pk=self.instance.paciente.pk)
            if qs.exists():
                raise ValidationError({'ci': 'CI ya registrado para otro usuario'})

        return cleaned


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Perfiles'
    fk_name = 'user'
    form = ProfileForm


class CustomUserAdmin(DjangoUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_role', 'get_license_number', 'get_specialty', 'get_institution')

    def get_role(self, obj):
        try:
            return obj.profile.get_role_display()
        except Exception:
            return ''
    get_role.short_description = 'Rol'

    def get_license_number(self, obj):
        return getattr(obj.profile, 'license_number', '')
    get_license_number.short_description = 'Matrícula'

    def get_specialty(self, obj):
        return getattr(obj.profile, 'specialty', '')
    get_specialty.short_description = 'Especialidad'

    def get_institution(self, obj):
        return getattr(obj.profile, 'institution', '')
    get_institution.short_description = 'Institución'


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


@admin.register(ResultadoPrueba)
class ResultadoPruebaAdmin(admin.ModelAdmin):
    list_display = ('get_usuario', 'tipo_prueba', 'puntaje', 'fecha_prueba', 'estado')
    list_filter = ('prueba', 'estado', 'fecha_prueba')
    search_fields = ('paciente__profile__user__username', 'paciente__profile__user__email')
    readonly_fields = ('fecha_prueba',)

    fieldsets = (
        ('Información Básica', {
            'fields': ('paciente', 'prueba', 'puntaje', 'estado')
        }),
        ('Detalles', {
            'fields': ('duracion_segundos', 'detalles', 'fecha_prueba')
        }),
    )

    @admin.display(description='Usuario')
    def get_usuario(self, obj):
        return obj.usuario


admin.site.register((TipoPrueba, Paciente, Profesional, RespuestaResultado))
