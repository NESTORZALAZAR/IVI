from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0005_profile_age'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resultadoprueba',
            name='tipo_prueba',
            field=models.CharField(
                choices=[
                    ('lectura', 'Prueba de Lectura'),
                    ('velocidad', 'Prueba de Velocidad'),
                    ('comprension', 'Prueba de Comprensión'),
                    ('ortografia', 'Prueba de Ortografía'),
                    ('alfabeto', 'Filtro de Conocimiento: Alfabeto'),
                ],
                max_length=20,
            ),
        ),
    ]