from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import ResultadoPrueba
from .models import Profile
import json
from datetime import datetime
import shutil
from django.db import models
from django.views.decorators.csrf import csrf_exempt

@api_view(['POST'])
def login_view(request):
    """
    Endpoint para autenticar usuarios.
    Espera: {"email": "..." (o username), "password": "..."}
    Devuelve: {"token": "...", "user": {...}}
    """
    try:
        data = json.loads(request.body)
        email_or_username = data.get('email')  # Puede ser email o username
        password = data.get('password')

        if not email_or_username or not password:
            return Response(
                {"error": "Email/Usuario y contraseña son requeridos"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Intentar autenticar con el valor ingresado como username
        user = authenticate(username=email_or_username, password=password)

        if user is None:
            # Intentar username case-insensitive
            try:
                user_ci = User.objects.get(username__iexact=email_or_username)
                if user_ci.check_password(password):
                    user = user_ci
            except User.DoesNotExist:
                pass

        if user is None:
            # Si aún falla, intentar buscar por email case-insensitive
            try:
                user_obj = User.objects.get(email__iexact=email_or_username)
                # Comprobar password directamente en el objeto de usuario como fallback
                if user_obj.check_password(password):
                    user = user_obj
                else:
                    return Response({"error": "Correo o contraseña incorrectos"}, status=status.HTTP_401_UNAUTHORIZED)
            except User.DoesNotExist:
                # Si tampoco existe por email, retornar error
                return Response({"error": "Correo o contraseña incorrectos"}, status=status.HTTP_401_UNAUTHORIZED)

        if user is None:
            return Response(
                {"error": "Correo o contraseña incorrectos"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generar un token simple (en producción usar JWT o Token de DRF)
        token = f"token_{user.id}_{user.username}"

        # Incluir role y ci desde el Profile si existe
        role = None
        ci = None
        try:
            role = user.profile.role
            ci = user.profile.ci
        except Exception:
            pass

        return Response({
            "token": token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": role,
                "ci": ci,
            }
        }, status=status.HTTP_200_OK)

    except json.JSONDecodeError:
        return Response(
            {"error": "JSON inválido"},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def get_user_from_token(token):
    """
    Extrae el usuario del token simple.
    Formato del token: token_{user_id}_{username}
    """
    try:
        parts = token.split('_')
        if len(parts) >= 3:
            user_id = int(parts[1])
            return User.objects.get(id=user_id)
    except (ValueError, User.DoesNotExist):
        pass
    return None


@api_view(['GET', 'POST'])
def resultados_view(request):
    """
    GET: Obtiene todos los resultados de pruebas del usuario autenticado.
    POST: Guarda un nuevo resultado de prueba para el usuario autenticado.
    
    Headers requeridos: Authorization: Bearer {token}
    """
    # Obtener token del header
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response(
            {"error": "Token no proporcionado"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    token = auth_header.replace('Bearer ', '')
    user = get_user_from_token(token)
    
    if not user:
        return Response(
            {"error": "Token inválido"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if request.method == 'GET':
        """
        Retorna todos los resultados del usuario.
        """
        resultados = ResultadoPrueba.objects.filter(usuario=user)
        data = [
            {
                "id": r.id,
                "tipo_prueba": r.tipo_prueba,
                "tipo_prueba_display": r.get_tipo_prueba_display(),
                "puntaje": r.puntaje,
                "fecha_prueba": r.fecha_prueba.isoformat(),
                "duracion_segundos": r.duracion_segundos,
                "estado": r.estado,
                "detalles": r.detalles
            }
            for r in resultados
        ]
        return Response(data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        """
        Crea un nuevo resultado de prueba.
        Espera: {
            "tipo_prueba": "lectura|velocidad|comprension|ortografia",
            "puntaje": 0-100,
            "duracion_segundos": ...,
            "detalles": {...}
        }
        """
        try:
            data = json.loads(request.body)
            tipo_prueba = data.get('tipo_prueba', '').strip()
            puntaje = data.get('puntaje')
            duracion_segundos = data.get('duracion_segundos', 0)
            detalles = data.get('detalles', {})
            resultado_user = user
            target_user_id = data.get('target_user_id')
            if target_user_id:
                if not hasattr(user, 'profile') or user.profile.role not in ('doctor', 'admin'):
                    return Response({'error': 'Solo un doctor puede registrar resultados de otro usuario'}, status=status.HTTP_403_FORBIDDEN)
                try:
                    resultado_user = User.objects.get(id=target_user_id)
                    if resultado_user.profile.role != 'paciente':
                        return Response({'error': 'El destinatario debe ser un paciente'}, status=status.HTTP_400_BAD_REQUEST)
                except (User.DoesNotExist, Profile.DoesNotExist):
                    return Response({'error': 'Paciente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

            # Validaciones
            valid_tipos = ['lectura', 'velocidad', 'comprension', 'ortografia']
            if tipo_prueba not in valid_tipos:
                return Response(
                    {"error": f"Tipo de prueba inválido. Debe ser uno de: {', '.join(valid_tipos)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if puntaje is None or not (0 <= puntaje <= 100):
                return Response(
                    {"error": "El puntaje debe ser un número entre 0 y 100"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Crear el resultado
            resultado = ResultadoPrueba.objects.create(
                usuario=resultado_user,
                tipo_prueba=tipo_prueba,
                puntaje=puntaje,
                duracion_segundos=int(duracion_segundos),
                detalles=detalles
            )

            return Response({
                "id": resultado.id,
                "tipo_prueba": resultado.tipo_prueba,
                "tipo_prueba_display": resultado.get_tipo_prueba_display(),
                "puntaje": resultado.puntaje,
                "fecha_prueba": resultado.fecha_prueba.isoformat(),
                "duracion_segundos": resultado.duracion_segundos,
                "estado": resultado.estado,
                "detalles": resultado.detalles,
                "message": "Resultado registrado exitosamente"
            }, status=status.HTTP_201_CREATED)

        except json.JSONDecodeError:
            return Response(
                {"error": "JSON inválido"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['POST'])
def signup_view(request):
    """
    Endpoint para registrar nuevos usuarios.
    Espera: {
        "username": "...",
        "email": "...",
        "password": "...",
        "first_name": "...",
        "last_name": "..."
    }
    Devuelve: {"token": "...", "user": {...}}
    """
    # Permitir registro desde UI: creamos usuarios con role 'paciente' y validamos campos.
    try:
        data = json.loads(request.body)
        username = (data.get('username') or '').strip()
        email = (data.get('email') or '').strip()
        password = data.get('password') or ''
        first_name = data.get('first_name') or ''
        last_name = data.get('last_name') or ''
        ci = (data.get('ci') or '').strip()
        requested_role = data.get('role', 'user')
        license_number = (data.get('license_number') or '').strip()
        specialty = (data.get('specialty') or '').strip()
        institution = (data.get('institution') or '').strip()

        if not username or not password or not email:
            field_errors = {}
            if not username:
                field_errors['username'] = 'username es requerido'
            if not email:
                field_errors['email'] = 'email es requerido'
            if not password:
                field_errors['password'] = 'password es requerida'
            return Response({'field_errors': field_errors}, status=status.HTTP_400_BAD_REQUEST)

        # Unicidad username (case-insensitive)
        if User.objects.filter(username__iexact=username).exists():
            return Response({'field_errors': {'username': 'username ya existe'}}, status=status.HTTP_400_BAD_REQUEST)

        # Unicidad email (case-insensitive)
        if User.objects.filter(email__iexact=email).exists():
            return Response({'field_errors': {'email': 'email ya registrado'}}, status=status.HTTP_400_BAD_REQUEST)

        # CI obligatorio y numérico para pacientes
        if not ci:
            return Response({'field_errors': {'ci': 'CI es obligatorio'}}, status=status.HTTP_400_BAD_REQUEST)
        if not str(ci).isdigit():
            return Response({'field_errors': {'ci': 'CI debe contener sólo dígitos'}}, status=status.HTTP_400_BAD_REQUEST)
        # Unicidad CI
        if Profile.objects.filter(ci=ci).exists():
            return Response({'field_errors': {'ci': 'CI ya registrado para otro usuario'}}, status=status.HTTP_400_BAD_REQUEST)

        if requested_role == 'professional' and (not license_number or not specialty):
            professional_errors = {}
            if not license_number:
                professional_errors['license_number'] = 'La matrícula profesional es obligatoria'
            if not specialty:
                professional_errors['specialty'] = 'La especialidad es obligatoria'
            return Response({'field_errors': professional_errors}, status=status.HTTP_400_BAD_REQUEST)

        # Crear usuario
        user_new = User.objects.create(username=username, email=email, first_name=first_name, last_name=last_name)
        user_new.set_password(password)
        user_new.is_active = True
        user_new.save()

        # Crear o actualizar profile
        prof, _ = Profile.objects.get_or_create(user=user_new)
        prof.role = 'doctor' if requested_role == 'professional' else 'paciente'
        prof.ci = ci
        prof.license_number = license_number if prof.role == 'doctor' else ''
        prof.specialty = specialty if prof.role == 'doctor' else ''
        prof.institution = institution if prof.role == 'doctor' else ''
        try:
            prof.full_clean()
        except Exception as e:
            # En caso de validación fallida, eliminar usuario creado y retornar error
            user_new.delete()
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        prof.save()

        # Generar token simple
        token = f"token_{user_new.id}_{user_new.username}"
        return Response({
            'token': token,
            'user': {
                'id': user_new.id,
                'username': user_new.username,
                'email': user_new.email,
                'first_name': user_new.first_name,
                'last_name': user_new.last_name,
                'role': prof.role,
                'ci': prof.ci,
                'license_number': prof.license_number,
                'specialty': prof.specialty,
                'institution': prof.institution,
            }
        }, status=status.HTTP_201_CREATED)
    except json.JSONDecodeError:
        return Response({'error': 'JSON inválido'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def doctor_view(request):
    """
    Vista para que médicos verifiquen resultados de pacientes.
    Requiere header: Authorization: Bearer {token}
    Parámetros de query: `name` (nombre o username) o `ci` (identificador único del paciente)
    """
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({"error": "Token no proporcionado"}, status=status.HTTP_401_UNAUTHORIZED)

    token = auth_header.replace('Bearer ', '')
    user = get_user_from_token(token)
    if not user:
        return Response({"error": "Token inválido"}, status=status.HTTP_401_UNAUTHORIZED)

    # Verificar rol doctor o admin
    try:
        role = user.profile.role
    except Exception:
        role = 'paciente'

    if role not in ['doctor', 'admin']:
        return Response({"error": "Acceso denegado: se requiere rol doctor"}, status=status.HTTP_403_FORBIDDEN)

    name = request.GET.get('name', '').strip()
    ci = request.GET.get('ci', '').strip()
    tipo_prueba = request.GET.get('tipo_prueba', '').strip()
    date_from_r = request.GET.get('date_from', '').strip()
    date_to_r = request.GET.get('date_to', '').strip()
    office_only = request.GET.get('office', '').strip().lower() in ('1', 'true', 'yes')

    pacientes = []
    if ci:
        perfiles = Profile.objects.filter(ci=ci)
        pacientes = [p.user for p in perfiles]
    elif name:
        # Buscar por username o por nombre completo
        usuarios = User.objects.filter(username__icontains=name) | User.objects.filter(first_name__icontains=name) | User.objects.filter(last_name__icontains=name)
        pacientes = list(usuarios.distinct())
    else:
        # Si no se especifica name ni ci, devolver un preview: últimos resultados por paciente
        preview = []
        perfiles = Profile.objects.filter(role='paciente').select_related('user')
        if office_only:
            perfiles = perfiles.filter(is_office_patient=True)
        for p in perfiles:
            paciente = p.user
            res_qs = ResultadoPrueba.objects.filter(usuario=paciente).order_by('-fecha_prueba')[:3]
            last_results = []
            tipo_acc = {}
            for r in res_qs:
                last_results.append({
                    'resultado_id': r.id,
                    'tipo_prueba': r.tipo_prueba,
                    'puntaje': r.puntaje,
                    'fecha_prueba': r.fecha_prueba.isoformat(),
                })
                t = r.tipo_prueba
                if t not in tipo_acc: tipo_acc[t] = {'count':0,'sum':0}
                tipo_acc[t]['count'] += 1
                tipo_acc[t]['sum'] += (r.puntaje or 0)
            averages = { k: (v['sum']/v['count']) if v['count']>0 else 0 for k,v in tipo_acc.items() }
            preview.append({
                'paciente_id': paciente.id,
                'paciente_username': paciente.username,
                'paciente_ci': p.ci,
                'last_results': last_results,
                'averages': averages,
                'recent_count': ResultadoPrueba.objects.filter(usuario=paciente).count()
            })
        return Response(preview, status=status.HTTP_200_OK)

    # Recolectar resultados
    if office_only:
        office_ids = Profile.objects.filter(is_office_patient=True).values_list('user_id', flat=True)
        pacientes = [paciente for paciente in pacientes if paciente.id in office_ids]
    resultados = []
    for paciente in pacientes:
        res = ResultadoPrueba.objects.filter(usuario=paciente)
        if tipo_prueba:
            res = res.filter(tipo_prueba=tipo_prueba)
        if date_from_r:
            try:
                res = res.filter(fecha_prueba__date__gte=date_from_r)
            except Exception:
                pass
        if date_to_r:
            try:
                res = res.filter(fecha_prueba__date__lte=date_to_r)
            except Exception:
                pass
        for r in res:
            resultados.append({
                "paciente_id": paciente.id,
                "paciente_username": paciente.username,
                "paciente_ci": getattr(paciente.profile, 'ci', None),
                "resultado_id": r.id,
                "tipo_prueba": r.tipo_prueba,
                "tipo_prueba_display": r.get_tipo_prueba_display(),
                "puntaje": r.puntaje,
                "fecha_prueba": r.fecha_prueba.isoformat(),
                "detalles": r.detalles,
            })

    return Response(resultados, status=status.HTTP_200_OK)


@api_view(['POST'])
def doctor_consultorio_view(request):
    """Crea o recupera un paciente provisional para una evaluación en consultorio."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({'error': 'Token no proporcionado'}, status=status.HTTP_401_UNAUTHORIZED)
    doctor = get_user_from_token(auth_header.replace('Bearer ', ''))
    if not doctor or not hasattr(doctor, 'profile') or doctor.profile.role not in ('doctor', 'admin'):
        return Response({'error': 'Se requiere rol doctor'}, status=status.HTTP_403_FORBIDDEN)

    name = (request.data.get('name') or '').strip()
    ci = (request.data.get('ci') or '').strip()
    if not name or not ci:
        return Response({'field_errors': {'name': 'Nombre requerido', 'ci': 'CI requerido'}}, status=status.HTTP_400_BAD_REQUEST)
    if not ci.isdigit():
        return Response({'field_errors': {'ci': 'El CI debe contener solo dígitos'}}, status=status.HTTP_400_BAD_REQUEST)

    profile = Profile.objects.filter(ci=ci).select_related('user').first()
    if profile:
        patient = profile.user
    else:
        base_username = f'consultorio_{ci}'
        username = base_username
        suffix = 1
        while User.objects.filter(username=username).exists():
            username = f'{base_username}_{suffix}'
            suffix += 1
        patient = User.objects.create(username=username, first_name=name)
        patient.set_unusable_password()
        patient.save()
        profile = patient.profile
        profile.role = 'paciente'
        profile.ci = ci
    profile.is_office_patient = True
    profile.save()

    return Response({'patient': {'id': patient.id, 'name': name or patient.first_name, 'ci': profile.ci}}, status=status.HTTP_200_OK)


@api_view(['GET','POST'])
def admin_users_view(request):
    """Lista usuarios (solo para admin)."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({"error": "Token no proporcionado"}, status=status.HTTP_401_UNAUTHORIZED)
    token = auth_header.replace('Bearer ', '')
    user = get_user_from_token(token)
    if not user:
        return Response({"error": "Token inválido"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        role = user.profile.role
    except Exception:
        role = 'paciente'
    if role != 'admin':
        return Response({"error": "Acceso denegado: se requiere rol admin"}, status=status.HTTP_403_FORBIDDEN)

    # POST: crear nuevo usuario (solo admin)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email', '')
            first_name = data.get('first_name', '')
            last_name = data.get('last_name', '')
            role_new = data.get('role', 'paciente')
            ci_new = (data.get('ci', '') or '').strip()
            license_number_new = (data.get('license_number', '') or '').strip()
            specialty_new = (data.get('specialty', '') or '').strip()
            institution_new = (data.get('institution', '') or '').strip()
            is_staff_flag = bool(data.get('is_staff', False))
            is_superuser_flag = bool(data.get('is_superuser', False))

            if not username or not password:
                return Response({'error': 'username y password son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(username=username).exists():
                return Response({'error': 'username ya existe'}, status=status.HTTP_400_BAD_REQUEST)

            # Validaciones de CI: obligatorio para pacientes
            if role_new == 'paciente':
                if not ci_new or not str(ci_new).strip():
                    return Response({'error': 'CI es obligatorio para role paciente'}, status=status.HTTP_400_BAD_REQUEST)
                # Unicidad de CI
                if Profile.objects.filter(ci=ci_new).exists():
                    return Response({'error': 'CI ya registrado para otro usuario'}, status=status.HTTP_400_BAD_REQUEST)
            if role_new == 'doctor' and (not license_number_new or not specialty_new):
                return Response({'error': 'Matrícula profesional y especialidad son obligatorias para doctores'}, status=status.HTTP_400_BAD_REQUEST)

            user_new = User.objects.create(username=username, email=email, first_name=first_name, last_name=last_name, is_staff=is_staff_flag, is_superuser=is_superuser_flag)
            user_new.set_password(password)
            user_new.is_active = True
            user_new.save()
            # Crear profile
            try:
                prof = Profile.objects.get(user=user_new)
            except Profile.DoesNotExist:
                prof = Profile(user=user_new)
            prof.role = role_new
            prof.ci = ci_new if ci_new != '' else None
            prof.license_number = license_number_new if role_new == 'doctor' else ''
            prof.specialty = specialty_new if role_new == 'doctor' else ''
            prof.institution = institution_new if role_new == 'doctor' else ''
            # Validar el profile antes de guardar
            try:
                prof.full_clean()
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            prof.save()

            return Response({'message': 'Usuario creado', 'id': user_new.id}, status=status.HTTP_201_CREATED)
        except json.JSONDecodeError:
            return Response({'error': 'JSON inválido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Paginación simple: ?page=1&page_size=20
    try:
        page = int(request.GET.get('page', '1'))
        page_size = int(request.GET.get('page_size', '20'))
    except ValueError:
        page = 1
        page_size = 20

    usuarios_qs = User.objects.all().order_by('id')
    # Búsqueda simple por q=texto en username, email, first_name, last_name o ci
    q = request.GET.get('q', '').strip()
    if q:
        usuarios_qs = usuarios_qs.filter(
            models.Q(username__icontains=q) |
            models.Q(email__icontains=q) |
            models.Q(first_name__icontains=q) |
            models.Q(last_name__icontains=q) |
            models.Q(profile__ci__icontains=q)
        )

    # Filtros avanzados
    role = request.GET.get('role', '').strip()
    if role:
        usuarios_qs = usuarios_qs.filter(profile__role=role)

    has_ci = request.GET.get('has_ci', None)
    if has_ci is not None and has_ci != '':
        if has_ci.lower() in ('1', 'true', 'yes'):
            usuarios_qs = usuarios_qs.filter(profile__ci__isnull=False).exclude(profile__ci__exact='')
        elif has_ci.lower() in ('0', 'false', 'no'):
            usuarios_qs = usuarios_qs.filter(models.Q(profile__ci__isnull=True) | models.Q(profile__ci__exact=''))

    date_from = request.GET.get('date_joined_from', '').strip()
    if date_from:
        usuarios_qs = usuarios_qs.filter(date_joined__gte=date_from)

    date_to = request.GET.get('date_joined_to', '').strip()
    if date_to:
        usuarios_qs = usuarios_qs.filter(date_joined__lte=date_to)

    is_staff = request.GET.get('is_staff', '').strip()
    if is_staff in ('1', 'true', 'yes'):
        usuarios_qs = usuarios_qs.filter(is_staff=True)
    elif is_staff in ('0', 'false', 'no'):
        usuarios_qs = usuarios_qs.filter(is_staff=False)

    is_superuser = request.GET.get('is_superuser', '').strip()
    if is_superuser in ('1', 'true', 'yes'):
        usuarios_qs = usuarios_qs.filter(is_superuser=True)
    elif is_superuser in ('0', 'false', 'no'):
        usuarios_qs = usuarios_qs.filter(is_superuser=False)

    total = usuarios_qs.count()
    start = (page - 1) * page_size
    end = start + page_size
    usuarios = usuarios_qs[start:end]
    data = []
    for u in usuarios:
        role_u = None
        ci_u = None
        license_number_u = ''
        specialty_u = ''
        institution_u = ''
        try:
            role_u = u.profile.role
            ci_u = u.profile.ci
            license_number_u = u.profile.license_number
            specialty_u = u.profile.specialty
            institution_u = u.profile.institution
        except Exception:
            pass
        data.append({
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'role': role_u,
            'ci': ci_u,
            'license_number': license_number_u,
            'specialty': specialty_u,
            'institution': institution_u,
        })
    return Response({
        'count': total,
        'page': page,
        'page_size': page_size,
        'results': data,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def check_username_view(request):
    """Verifica disponibilidad de username (case-insensitive)."""
    username = (request.GET.get('username') or '').strip()
    if not username:
        return Response({'error': 'username requerido'}, status=status.HTTP_400_BAD_REQUEST)
    exists = User.objects.filter(username__iexact=username).exists()
    return Response({'available': not exists}, status=status.HTTP_200_OK)


@api_view(['GET'])
def check_email_view(request):
    """Verifica disponibilidad de email (case-insensitive)."""
    email = (request.GET.get('email') or '').strip()
    if not email:
        return Response({'error': 'email requerido'}, status=status.HTTP_400_BAD_REQUEST)
    exists = User.objects.filter(email__iexact=email).exists()
    return Response({'available': not exists}, status=status.HTTP_200_OK)


@api_view(['GET'])
def admin_results_view(request):
    """Lista todos los resultados (solo admin)."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({"error": "Token no proporcionado"}, status=status.HTTP_401_UNAUTHORIZED)
    token = auth_header.replace('Bearer ', '')
    user = get_user_from_token(token)
    if not user:
        return Response({"error": "Token inválido"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        role = user.profile.role
    except Exception:
        role = 'paciente'
    if role != 'admin':
        return Response({"error": "Acceso denegado: se requiere rol admin"}, status=status.HTTP_403_FORBIDDEN)

    resultados = ResultadoPrueba.objects.select_related('usuario').all()
    data = []
    for r in resultados:
        data.append({
            'id': r.id,
            'usuario_id': r.usuario.id,
            'usuario_username': r.usuario.username,
            'tipo_prueba': r.tipo_prueba,
            'tipo_prueba_display': r.get_tipo_prueba_display(),
            'puntaje': r.puntaje,
            'fecha_prueba': r.fecha_prueba.isoformat(),
            'detalles': r.detalles,
        })
    return Response({ 'count': len(data), 'results': data }, status=status.HTTP_200_OK)


@api_view(['GET'])
def admin_lector_view(request):
    """Estado simple del lector (tesseract) para admin."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({"error": "Token no proporcionado"}, status=status.HTTP_401_UNAUTHORIZED)
    token = auth_header.replace('Bearer ', '')
    user = get_user_from_token(token)
    if not user:
        return Response({"error": "Token inválido"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        role = user.profile.role
    except Exception:
        role = 'paciente'
    if role != 'admin':
        return Response({"error": "Acceso denegado: se requiere rol admin"}, status=status.HTTP_403_FORBIDDEN)

    t_available = shutil.which('tesseract') is not None
    return Response({'tesseract_available': t_available}, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'DELETE'])
def admin_user_detail_view(request, user_id):
    """GET: detalles de usuario, PUT: actualizar role/ci/nombres, DELETE: eliminar usuario (solo admin)."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({"error": "Token no proporcionado"}, status=status.HTTP_401_UNAUTHORIZED)
    token = auth_header.replace('Bearer ', '')
    user = get_user_from_token(token)
    if not user:
        return Response({"error": "Token inválido"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        role = user.profile.role
    except Exception:
        role = 'paciente'
    if role != 'admin':
        return Response({"error": "Acceso denegado: se requiere rol admin"}, status=status.HTTP_403_FORBIDDEN)

    try:
        target = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        try:
            prof = target.profile
            role_t = prof.role
            ci_t = prof.ci
            license_number_t = prof.license_number
            specialty_t = prof.specialty
            institution_t = prof.institution
        except Exception:
            role_t = None
            ci_t = None
            license_number_t = ''
            specialty_t = ''
            institution_t = ''
        return Response({
            'id': target.id,
            'username': target.username,
            'email': target.email,
            'first_name': target.first_name,
            'last_name': target.last_name,
            'role': role_t,
            'ci': ci_t,
            'license_number': license_number_t,
            'specialty': specialty_t,
            'institution': institution_t,
        })

    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            # Campos editables: role, ci, first_name, last_name, email
            if 'first_name' in data:
                target.first_name = data.get('first_name') or ''
            if 'last_name' in data:
                target.last_name = data.get('last_name') or ''
            if 'email' in data:
                target.email = data.get('email') or ''
            target.save()
            prof, _ = Profile.objects.get_or_create(user=target)
            if 'role' in data:
                prof.role = data.get('role') or prof.role
            if 'ci' in data:
                ci_val = (data.get('ci') or '').strip()
                prof.ci = ci_val if ci_val != '' else None
            if 'license_number' in data:
                prof.license_number = (data.get('license_number') or '').strip()
            if 'specialty' in data:
                prof.specialty = (data.get('specialty') or '').strip()
            if 'institution' in data:
                prof.institution = (data.get('institution') or '').strip()
            if prof.role == 'doctor' and (not prof.license_number or not prof.specialty):
                return Response({'error': 'Matrícula profesional y especialidad son obligatorias para doctores'}, status=status.HTTP_400_BAD_REQUEST)
            if prof.role != 'doctor':
                prof.license_number = ''
                prof.specialty = ''
                prof.institution = ''
            if 'password' in data and data.get('password'):
                target.set_password(data.get('password'))
                target.save()
            prof.full_clean()
            prof.save()
            return Response({'message': 'Usuario actualizado'})
        except json.JSONDecodeError:
            return Response({'error': 'JSON inválido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        target.delete()
        return Response({'message': 'Usuario eliminado'})
