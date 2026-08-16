import os
import sys
import django
import json
import time
# Ensure project root is on sys.path so 'backend' settings module is importable
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..'))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from usuarios.models import Profile, ResultadoPrueba
from django.utils import timezone

def create_user(username, email, password, role='paciente', ci=None, is_staff=False, is_superuser=False):
    if User.objects.filter(username=username).exists():
        u = User.objects.get(username=username)
    else:
        u = User.objects.create(username=username, email=email, is_staff=is_staff, is_superuser=is_superuser)
        u.set_password(password)
        u.save()
    prof, _ = Profile.objects.get_or_create(user=u)
    prof.role = role
    if ci is not None:
        prof.ci = ci
    prof.full_clean()
    prof.save()
    return u

def create_result(usuario, tipo_prueba, puntaje, detalles=None, fecha=None):
    if detalles is None: detalles = {}
    fecha = fecha or timezone.now()
    r = ResultadoPrueba.objects.create(usuario=usuario, tipo_prueba=tipo_prueba, puntaje=puntaje, duracion_segundos=60, detalles=detalles)
    return r

def seed():
    print('Seeding users and results...')
    ts = int(time.time())
    doc = create_user(f'doc_{ts}', f'doctor1_{ts}@doctor.com', 'doctorpass', role='doctor', ci=f'DOC{ts}')
    p1 = create_user(f'pat1_{ts}', f'pat1_{ts}@example.com', 'patpass1', role='paciente', ci=f'CI1001_{ts}')
    p2 = create_user(f'pat2_{ts}', f'pat2_{ts}@example.com', 'patpass2', role='paciente', ci=f'CI1002_{ts}')

    create_result(p1, 'lectura', 78, {'notes':'test1'})
    create_result(p1, 'velocidad', 65, {'notes':'test2'})
    create_result(p2, 'lectura', 88, {'notes':'testA'})
    create_result(p2, 'ortografia', 55, {'notes':'testB'})
    print('Seed complete')
    return doc, p1, p2, ts

def call_api_doctor(login_identifier, password='doctorpass', ci=None, name=None, tipo_prueba=None, date_from=None, date_to=None):
    import requests
    # login as doctor (accepts email or username)
    resp = requests.post('http://127.0.0.1:8000/api/login/', json={'email': login_identifier,'password':password})
    print('Login doctor status', resp.status_code, resp.text)
    if resp.status_code!=200:
        return
    token = resp.json().get('token')
    headers = {'Authorization': f'Bearer {token}'}
    params = {}
    if ci: params['ci'] = ci
    if name: params['name'] = name
    if tipo_prueba: params['tipo_prueba'] = tipo_prueba
    if date_from: params['date_from'] = date_from
    if date_to: params['date_to'] = date_to
    r = requests.get('http://127.0.0.1:8000/api/doctor/', headers=headers, params=params)
    print('Doctor search', params, '->', r.status_code)
    try:
        print(json.dumps(r.json(), indent=2, ensure_ascii=False))
    except Exception as e:
        print('Response text:', r.text)

if __name__ == '__main__':
    doc, p1, p2, ts = seed()
    time.sleep(0.5)
    print('\n=== Search by CI CI1001 ===')
    call_api_doctor(login_identifier=doc.email, ci=f'CI1001_{ts}')
    print('\n=== Search by name pat2 ===')
    call_api_doctor(login_identifier=doc.email, name=f'pat2_{ts}')
    print('\n=== Search by tipo_prueba lectura ===')
    call_api_doctor(login_identifier=doc.email, name=f'pat1_{ts}', tipo_prueba='lectura')
