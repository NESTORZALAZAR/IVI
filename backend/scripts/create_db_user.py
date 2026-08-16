import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE','backend.settings')
django.setup()
from django.contrib.auth.models import User
from usuarios.models import Profile

username='testuser1'
if User.objects.filter(username=username).exists():
    print('User already exists')
else:
    u=User.objects.create_user(username, 'test1@example.com', 'testpass')
    u.first_name='Test'
    u.last_name='User'
    u.save()
    try:
        Profile.objects.create(user=u, role='paciente', ci='CI123456')
    except Exception as e:
        # if profile auto-created, update
        try:
            p=Profile.objects.get(user=u)
            p.role='paciente'; p.ci='CI123456'; p.save()
        except Exception:
            pass
    print('Created user', u.id)
