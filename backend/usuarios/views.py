from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import ResultadoPrueba
import json
from datetime import datetime

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

        return Response({
            "token": token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
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
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()

        # Validaciones
        if not username or not email or not password:
            return Response(
                {"error": "Usuario, correo y contraseña son requeridos"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 6:
            return Response(
                {"error": "La contraseña debe tener al menos 6 caracteres"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificar si el usuario ya existe
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "El nombre de usuario ya existe"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificar si el email ya existe
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "El correo ya está registrado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear el nuevo usuario
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Generar un token simple (en producción usar JWT o Token de DRF)
        token = f"token_{user.id}_{user.username}"

        return Response({
            "token": token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
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
