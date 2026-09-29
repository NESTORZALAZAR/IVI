# 6. Flujos principales

![Flujos principales](06_FLUJOS_PRINCIPALES.svg)

## 6.1 Flujo de paciente

```mermaid
sequenceDiagram
    actor P as Paciente
    participant F as Frontend
    participant B as Backend
    participant DB as Base de datos

    P->>F: Inicia sesion
    F->>B: Solicita autenticacion
    B-->>F: Token y perfil
    P->>F: Selecciona cuestionario o juego
    F->>B: Envia resultado
    B->>DB: Valida y guarda ResultadoPrueba
    DB-->>B: Resultado persistido
    B-->>F: Puntaje y estado
    F-->>P: Muestra resultado orientativo
```

## 6.2 Flujo de doctor en consultorio

```mermaid
sequenceDiagram
    actor D as Doctor
    participant F as Frontend
    participant B as Backend
    participant DB as Base de datos

    D->>F: Abre Panel Doctor
    F->>B: Valida token y rol
    D->>F: Ingresa nombre, CI y edad
    F->>B: Crea contexto de paciente de consultorio
    B->>DB: Verifica o registra datos
    B-->>F: Confirma evaluacion
    F-->>D: Abre modulo de pruebas
    D->>F: Completa evaluacion
    F->>B: Guarda resultados asociados
```

## 6.3 Flujo OCR y audio

```mermaid
flowchart TD
    A[Usuario carga archivo] --> T{Tipo}
    T -->|PDF| PDF[Extraer texto con PyPDF2]
    T -->|DOCX| DOC[Extraer texto con python-docx]
    T -->|TXT| TXT[Leer contenido]
    T -->|Imagen| OCR[Procesar con Tesseract]
    PDF --> TEXT[Texto obtenido]
    DOC --> TEXT
    TXT --> TEXT
    OCR --> TEXT
    TEXT --> AUDIO[Generar audio con pyttsx3]
    AUDIO --> RESP[Devolver texto y audio]
```

## 6.4 Flujo de accesibilidad

1. El usuario abre `Personalizar vista`.
2. Selecciona fuente, tamano, interlineado o tema.
3. `AccessibilityContext` actualiza el estado global.
4. La interfaz aplica variables CSS al documento.
5. La configuracion se guarda en `localStorage`.
