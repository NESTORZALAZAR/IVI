from django.contrib.auth.models import User

u = User.objects.filter(username='admin').first()
if not u:
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print('created admin')
else:
    u.set_password('admin')
    u.is_superuser = True
    u.is_staff = True
    u.save()
    print('updated admin')
print('done')
