from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import pyttsx3
import PyPDF2
from docx import Document
import pytesseract
from PIL import Image
import io
import os
import tempfile
import shutil

# Verificar si Tesseract está disponible
TESSERACT_AVAILABLE = shutil.which('tesseract') is not None


@api_view(['GET'])
def check_tesseract(request):
    """Verifica si Tesseract OCR está instalado"""
    return Response({
        'tesseract_available': TESSERACT_AVAILABLE,
        'message': '✅ Tesseract OCR está instalado' if TESSERACT_AVAILABLE else '❌ Tesseract OCR no está instalado',
        'install_url': 'https://github.com/UB-Mannheim/tesseract/wiki'
    })

@api_view(['POST'])
def extract_and_speak(request):
    """
    Endpoint para extraer texto de archivos (PDF, DOCX, TXT, JPG, PNG, GIF, BMP)
    y generar audio con text-to-speech
    """
    if 'file' not in request.FILES:
        return Response(
            {'error': 'No file provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    file = request.FILES['file']
    file_ext = os.path.splitext(file.name)[1].lower()
    
    try:
        # Verificar si es una imagen y Tesseract no está disponible
        if file_ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']:
            if not TESSERACT_AVAILABLE:
                return Response(
                    {
                        'error': '❌ Tesseract OCR no está instalado',
                        'message': 'Para procesar imágenes, instala Tesseract OCR desde: https://github.com/UB-Mannheim/tesseract/wiki',
                        'instrucciones': 'Windows: Descarga tesseract-ocr-w64-setup-v5.x.x.exe y ejecuta el instalador',
                        'archivo': file.name,
                        'tipo': 'imagen'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Extraer texto según el tipo de archivo
        if file_ext == '.pdf':
            text = extract_text_from_pdf(file)
        elif file_ext == '.docx':
            text = extract_text_from_docx(file)
        elif file_ext == '.txt':
            text = file.read().decode('utf-8')
        elif file_ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']:
            text = extract_text_from_image(file)
        else:
            return Response(
                {'error': f'Tipo de archivo no soportado: {file_ext}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not text.strip():
            return Response(
                {'error': 'No se pudo extraer texto del archivo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generar audio
        audio_path = generate_speech(text)
        
        # Leer el archivo de audio
        with open(audio_path, 'rb') as audio_file:
            audio_data = audio_file.read()
        
        # Limpiar archivo temporal
        os.remove(audio_path)
        
        return Response({
            'text': text,
            'audio': audio_data.hex(),
            'message': 'Texto extraído y audio generado correctamente'
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def extract_text_from_pdf(file):
    """Extrae texto de un archivo PDF"""
    text = ""
    pdf_reader = PyPDF2.PdfReader(file)
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()
    return text


def extract_text_from_docx(file):
    """Extrae texto de un archivo DOCX"""
    doc = Document(file)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text


def extract_text_from_image(file):
    """Extrae texto de una imagen usando OCR"""
    try:
        image = Image.open(file)
        # Usar Tesseract para extraer texto
        text = pytesseract.image_to_string(image, lang='spa+eng')
        return text
    except Exception as e:
        error_msg = str(e)
        if "tesseract is not installed" in error_msg.lower() or "not in your path" in error_msg.lower():
            raise Exception(
                "❌ Tesseract OCR no está instalado. "
                "Por favor, instálalo desde: https://github.com/UB-Mannheim/tesseract/wiki "
                "Para Windows: Descarga e instala tesseract-ocr-w64-setup-v5.x.x.exe"
            )
        else:
            raise Exception(f"Error al procesar la imagen: {error_msg}")


def generate_speech(text):
    """Genera audio a partir de texto usando pyttsx3"""
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)
    engine.setProperty('volume', 0.9)
    
    # Crear archivo temporal
    with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as tmp_file:
        audio_path = tmp_file.name
    
    engine.save_to_file(text, audio_path)
    engine.runAndWait()
    
    return audio_path
