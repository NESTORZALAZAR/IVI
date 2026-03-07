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
import requests as http_requests

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


@api_view(['POST'])
def describe_imagen_ia(request):
    """Describe imagen usando BLIP captioning dividiendo en secciones"""
    if 'file' not in request.FILES:
        return Response({'error': 'No se recibio ninguna imagen'}, status=400)

    try:
        from PIL import Image as PILImage
        import io as _io
        import torch
        from transformers import BlipProcessor, BlipForConditionalGeneration

        global _blip_processor, _blip_model
        if '_blip_processor' not in globals() or _blip_processor is None:
            _blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
            _blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
            _blip_model.eval()

        archivo_bytes = request.FILES['file'].read()
        imagen = PILImage.open(_io.BytesIO(archivo_bytes)).convert('RGB')
        w, h = imagen.size

        # Prompts que guian al modelo a describir libremente lo que ve
        PROMPTS = [
            "In this image I can see",
            "This picture shows",
            "a drawing of",
        ]

        def describir_seccion(img_region):
            candidatos = []
            for prompt in PROMPTS:
                inputs = _blip_processor(img_region, text=prompt, return_tensors="pt")
                with torch.no_grad():
                    out = _blip_model.generate(
                        **inputs,
                        max_new_tokens=50,
                        num_beams=5,
                        min_length=8,
                        repetition_penalty=1.3,
                    )
                caption = _blip_processor.decode(out[0], skip_special_tokens=True).strip()
                if caption and len(caption) > 5:
                    candidatos.append(caption)
            # Devolver la descripcion mas larga y detallada
            return max(candidatos, key=len) if candidatos else ""

        descripciones = []

        if w > 200 and h > 200:
            secciones = [
                imagen.crop((0,    0,    w//2, h//2)),
                imagen.crop((w//2, 0,    w,    h//2)),
                imagen.crop((0,    h//2, w//2, h)),
                imagen.crop((w//2, h//2, w,    h)),
            ]
            for i, seccion in enumerate(secciones, 1):
                desc = describir_seccion(seccion)
                if desc:
                    descripciones.append(f"Imagen {i}: {desc}")
        else:
            desc = describir_seccion(imagen)
            if desc:
                descripciones.append(desc)

        if not descripciones:
            return Response({'error': 'El modelo no genero descripcion'}, status=500)

        descripcion_en = ". ".join(descripciones)

        # Traducir al espanol via MyMemory
        try:
            t_resp = http_requests.get(
                'https://api.mymemory.translated.net/get',
                params={'q': descripcion_en, 'langpair': 'en|es'},
                timeout=10
            )
            t_data = t_resp.json()
            traduccion = t_data.get('responseData', {}).get('translatedText', '')
            if traduccion and 'mymemory' not in traduccion.lower():
                return Response({'descripcion': traduccion, 'original': descripcion_en})
        except Exception:
            pass

        return Response({'descripcion': descripcion_en, 'original': descripcion_en})

    except Exception as e:
        return Response({'error': str(e)}, status=500)
