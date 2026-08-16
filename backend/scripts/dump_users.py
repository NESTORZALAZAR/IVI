import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from usuarios.models import Profile

rows = []
for u in User.objects.all().order_by('id'):
    try:
        prof = u.profile
        role = prof.role
        ci = prof.ci
    except Exception:
        role = None
        ci = None
    pwd = getattr(u, 'password', '') or ''
    has_password = bool(pwd and not pwd.startswith('!'))
    rows.append({
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'first_name': u.first_name,
        'last_name': u.last_name,
        'is_active': u.is_active,
        'has_password': has_password,
        'password_preview': pwd[:20],
        'role': role,
        'ci': ci,
    })

print(json.dumps(rows, indent=2, ensure_ascii=False))
