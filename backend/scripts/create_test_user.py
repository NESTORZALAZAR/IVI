import json, urllib.request, sys
login_url='http://127.0.0.1:8000/api/login/'
create_url='http://127.0.0.1:8000/api/admin/users/'
admin={'email':'admin@example.com','password':'admin'}
try:
    data=json.dumps(admin).encode()
    req=urllib.request.Request(login_url, data=data, headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(req, timeout=10) as r:
        d=json.load(r)
    token=d.get('token')
    if not token:
        print('Login failed, response:', d)
        sys.exit(1)
    print('Login OK, token:', token)
    new_user={'username':'testuser1','password':'testpass','email':'test1@example.com','first_name':'Test','last_name':'User','role':'paciente','ci':'CI123456'}
    data2=json.dumps(new_user).encode()
    req2=urllib.request.Request(create_url, data=data2, headers={'Content-Type':'application/json','Authorization':f'Bearer {token}'})
    with urllib.request.urlopen(req2, timeout=10) as r2:
        print('Create status', r2.status)
        print(r2.read().decode())
except Exception as e:
    print('Error:', e)
    sys.exit(2)
