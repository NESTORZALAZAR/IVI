import json
from urllib import request, error

BASE = 'http://127.0.0.1:8000'

def post_json(path, data, token=None):
    url = BASE + path
    body = json.dumps(data).encode('utf-8')
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = request.Request(url, data=body, headers=headers, method='POST')
    try:
        with request.urlopen(req) as resp:
            return resp.getcode(), json.load(resp)
    except error.HTTPError as e:
        try:
            return e.code, json.load(e)
        except Exception:
            return e.code, e.read().decode('utf-8')
    except Exception as e:
        return None, str(e)

def main():
    print('1) Logueando como admin...')
    code, data = post_json('/api/login/', {'email':'admin@example.com','password':'admin'})
    print('Login admin response:', code, data)
    if code != 200:
        print('No se pudo loguear como admin; ajusta credenciales y reintenta.')
        return
    token = data.get('token')

    # Crear user de prueba
    import random, time
    u = f'testuser{int(time.time())%10000}'
    payload = {
        'username': u,
        'password': 'Pass1234',
        'email': f'{u}@example.com',
        'first_name': 'Test',
        'last_name': 'User',
        'role': 'paciente',
        'ci': f'CI{int(time.time())%100000}',
    }
    print('2) Creando usuario:', payload)
    code2, data2 = post_json('/api/admin/users/', payload, token=token)
    print('Create user response:', code2, data2)
    if code2 != 201:
        print('Fallo al crear usuario; revisa el error.')
        return

    # Intentar login con el usuario creado
    print('3) Intentando login con el nuevo usuario (por email)...')
    code3, data3 = post_json('/api/login/', {'email': payload['email'], 'password': payload['password']})
    print('Login attempt (email):', code3, data3)
    print('4) Intentando login con el nuevo usuario (por username)...')
    code4, data4 = post_json('/api/login/', {'email': payload['username'], 'password': payload['password']})
    print('Login attempt (username):', code4, data4)

if __name__ == '__main__':
    main()
