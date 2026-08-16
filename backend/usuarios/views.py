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
            # Si falla, intentar buscar por email
            try:
                user_obj = User.objects.get(email=email_or_username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                # Si tampoco existe por email, retornar error
                return Response(
                    {"error": "Correo o contraseña incorrectos"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

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
                usuario=user,
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
    # Las cuentas deben ser creadas sólo desde el panel de admin.
    return Response(
        {"error": "Creación de cuentas deshabilitada vía API. Use el panel de administración."},
        status=status.HTTP_403_FORBIDDEN
    )



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

    pacientes = []
    if ci:
        perfiles = Profile.objects.filter(ci=ci)
        pacientes = [p.user for p in perfiles]
    elif name:
        # Buscar por username o por nombre completo
        usuarios = User.objects.filter(username__icontains=name) | User.objects.filter(first_name__icontains=name) | User.objects.filter(last_name__icontains=name)
        pacientes = list(usuarios.distinct())
    else:
        return Response({"error": "Se requiere `name` o `ci` como parámetro de búsqueda"}, status=status.HTTP_400_BAD_REQUEST)

    # Recolectar resultados
    resultados = []
    for paciente in pacientes:
        res = ResultadoPrueba.objects.filter(usuario=paciente)
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


@api_view(['GET'])
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
        try:
            role_u = u.profile.role
            ci_u = u.profile.ci
        except Exception:
            role_u = None
            ci_u = None
        data.append({
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'role': role_u,
            'ci': ci_u,
        })
    return Response({
        'count': total,
        'page': page,
        'page_size': page_size,
        'results': data,
    }, status=status.HTTP_200_OK)


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
        except Exception:
            role_t = None
            ci_t = None
        return Response({
            'id': target.id,
            'username': target.username,
            'email': target.email,
            'first_name': target.first_name,
            'last_name': target.last_name,
            'role': role_t,
            'ci': ci_t,
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
                prof.ci = data.get('ci') or prof.ci
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
