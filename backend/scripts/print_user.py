import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE','backend.settings')
django.setup()
from django.contrib.auth.models import User
u = list(User.objects.filter(username='testuser1').values('id','username','email'))
print(u)
