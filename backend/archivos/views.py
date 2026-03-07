from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import PyPDF2
from docx import Document
import pyttsx3
import os
import uuid
from io import BytesIO
import base64

# Create your views here.

def extraer_texto_pdf(archivo):
    """Extrae texto de un archivo PDF"""
    try:
        lector_pdf = PyPDF2.PdfReader(archivo)
        texto = ""
        for pagina in lector_pdf.pages:
            texto += pagina.extract_text()
        return texto
    except Exception as e:
        raise ValueError(f"Error al procesar PDF: {str(e)}")

def extraer_texto_docx(archivo):
    """Extrae texto de un archivo DOCX"""
    try:
        documento = Document(archivo)
        texto = ""
        for parrafo in documento.paragraphs:
            texto += parrafo.text + "\n"
        return texto
    except Exception as e:
        raise ValueError(f"Error al procesar DOCX: {str(e)}")

def extraer_texto_txt(archivo):
    """Extrae texto de un archivo TXT"""
    try:
        contenido = archivo.read().decode('utf-8', errors='ignore')
        return contenido
    except Exception as e:
        raise ValueError(f"Error al procesar TXT: {str(e)}")

def convertir_texto_audio(texto, velocidad=1.0):
    """Convierte texto a audio usando pyttsx3"""
    try:
        motor = pyttsx3.init()
        
        # Configurar velocidad
        motor.setProperty('rate', 150 * velocidad)
        
        # Configurar volumen
        motor.setProperty('volume', 0.9)
        
        # Crear archivo temporal para guardar el audio
        archivo_audio = BytesIO()
        nombre_temporal = f"audio_{uuid.uuid4()}.mp3"
        ruta_temporal = f"/tmp/{nombre_temporal}"
        
        # En Windows, usar un directorio temporal
        if os.name == 'nt':
            import tempfile
            ruta_temporal = os.path.join(tempfile.gettempdir(), nombre_temporal)
        
        motor.save_to_file(texto, ruta_temporal)
        motor.runAndWait()
        
        # Leer el archivo de audio generado
        if os.path.exists(ruta_temporal):
            with open(ruta_temporal, 'rb') as f:
                contenido_audio = f.read()
            os.remove(ruta_temporal)
            return contenido_audio
        else:
            raise ValueError("No se pudo generar el archivo de audio")
            
    except Exception as e:
        raise ValueError(f"Error al convertir texto a audio: {str(e)}")

@api_view(['POST'])
def procesar_archivo(request):
    """
    Procesa un archivo cargado, extrae el texto y lo convierte a audio.
    Soporta PDF, DOCX, TXT
    """
    try:
        if 'archivo' not in request.FILES:
            return Response(
                {"error": "No se proporcionó archivo"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        archivo = request.FILES['archivo']
        velocidad = float(request.POST.get('velocidad', 1.0))
        
        # Validar extensión del archivo
        nombre_archivo = archivo.name.lower()
        
        # Extraer texto según el tipo de archivo
        if nombre_archivo.endswith('.pdf'):
            texto = extraer_texto_pdf(archivo)
        elif nombre_archivo.endswith('.docx'):
            texto = extraer_texto_docx(archivo)
        elif nombre_archivo.endswith('.txt'):
            texto = extraer_texto_txt(archivo)
        else:
            return Response(
                {"error": "Tipo de archivo no soportado. Use PDF, DOCX o TXT"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar que se extrajo texto
        if not texto or len(texto.strip()) == 0:
            return Response(
                {"error": "No se pudo extraer texto del archivo"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Convertir a audio
        contenido_audio = convertir_texto_audio(texto, velocidad)
        
        # Codificar audio en base64 para enviar al cliente
        audio_base64 = base64.b64encode(contenido_audio).decode('utf-8')
        
        return Response({
            "success": True,
            "texto": texto,
            "audio": f"data:audio/mpeg;base64,{audio_base64}",
            "caracteres": len(texto),
            "mensaje": "Archivo procesado correctamente"
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": f"Error al procesar el archivo: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
