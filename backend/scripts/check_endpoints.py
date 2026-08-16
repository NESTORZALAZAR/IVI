import requests
def main():
    endpoints = [
     'http://127.0.0.1:8000/api/lector/extract-and-speak/',
     'http://127.0.0.1:8000/api/admin/lector/',
     'http://127.0.0.1:8000/api/admin/results/',
     'http://127.0.0.1:8000/api/admin/users/',
     'http://127.0.0.1:8000/api/resultados/',
     'http://127.0.0.1:8000/api/doctor/',
    ]
    resp = requests.post('http://127.0.0.1:8000/api/login/', json={'email':'doctor1_1786908433@doctor.com','password':'doctorpass'})
    print('login', resp.status_code, resp.text)
    token = None
    if resp.status_code==200:
        token = resp.json().get('token')
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    for url in endpoints:
        try:
            if url.endswith('extract-and-speak/'):
                r = requests.post(url, headers=headers, json={'text':'hola'})
            else:
                r = requests.get(url, headers=headers)
            print(url, r.status_code)
            try:
                print(r.text[:1000])
            except Exception:
                pass
        except Exception as e:
            print(url, 'ERROR', e)

if __name__ == '__main__':
    main()
