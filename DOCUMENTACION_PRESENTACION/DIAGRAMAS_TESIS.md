# Diagramas de tesis de IVI

Este documento contiene las 14 fuentes Mermaid correspondientes al Plan Tecnico. Cada bloque puede renderizarse desde Markdown compatible con Mermaid o exportarse como SVG/PNG para incorporarlo a la tesis.

## Figura 6.1. Diagrama de contexto. Nivel 0

```mermaid
flowchart LR
    PF[Paciente / Familia] <-->|tamizaje, resultados, lectura| IVI((Sistema IVI))
    PR[Profesional] <-->|evaluacion, seguimiento| IVI
    AD[Administrador] <-->|usuarios, resultados, recursos| IVI
    IVI <-->|OCR y texto a voz| EXT[Servicios externos]
```

## Figura 6.2. Diagrama de flujo de datos. Nivel 1

```mermaid
flowchart LR
    U[Paciente / Familia] --> AUTH[1. Autenticacion]
    P[Profesional] --> AUTH
    A[Administrador] --> AUTH
    AUTH --> EVAL[2. Evaluacion inicial]
    AUTH --> CUEST[3. Cuestionarios]
    AUTH --> JUEG[4. Juegos de tamizaje]
    AUTH --> AYUDA[5. IVI te ayuda]
    AUTH --> RES[6. Directorio de resultados]
    AUTH --> REC[7. Centro de recursos]
    EVAL --> DB[(Base de datos)]
    CUEST --> DB
    JUEG --> DB
    RES <--> DB
    AYUDA --> PROC[Procesamiento OCR / TTS]
    PROC --> DOC[(Archivos procesados)]
    REC --> CONT[Contenido de apoyo]
```

## Figura 6.3. Diagrama conceptual

```mermaid
flowchart LR
    US[Usuario] --> PAC[Paciente]
    US --> PRO[Profesional]
    US --> ADM[Administrador]
    PAC --> EVA[Evaluacion]
    EVA --> CUE[Cuestionario]
    EVA --> JUE[Juego]
    EVA --> RES[Resultado]
    US --> DOC[Documento]
    DOC --> LEC[Lector accesible]
    US --> DIR[Directorio]
    DIR --> RES
    US --> REC[Recurso]
```

> Este diagrama representa conceptos del negocio. Evaluacion, Cuestionario, Juego, Documento, Recurso y Directorio no deben presentarse como tablas independientes si no existen como modelos persistentes.

## Figura 6.4. Diagrama de casos de uso - Paciente/Familia

```mermaid
flowchart LR
    PF[Paciente / Familia]
    PF --> R[Registrarse e iniciar sesion]
    PF --> EI[Realizar evaluacion inicial]
    PF --> CU[Completar cuestionarios]
    PF --> JU[Realizar juegos]
    PF --> IV[Usar IVI te ayuda]
    PF --> AC[Personalizar accesibilidad]
    PF --> CR[Consultar centro de recursos]
    PF --> DR[Consultar resultados propios]
```

## Figura 6.5. Diagrama de casos de uso - Profesional

```mermaid
flowchart LR
    PR[Profesional]
    PR --> AU[Iniciar sesion]
    PR --> CP[Buscar paciente]
    PR --> MC[Iniciar modo consultorio]
    PR --> ET[Aplicar tamizaje]
    PR --> HR[Consultar historial y resultados]
    PR --> IV[Usar lector accesible]
```

## Figura 6.6. Diagrama de casos de uso - Administrador

```mermaid
flowchart LR
    AD[Administrador]
    AD --> AU[Iniciar sesion]
    AD --> GU[Listar usuarios]
    AD --> CU[Crear usuario]
    AD --> EU[Editar usuario]
    AD --> EU2[Eliminar usuario]
    AD --> GR[Consultar resultados]
    AD --> GL[Consultar estado del lector]
```

## Figura 6.7. Diagrama de secuencia - Proceso de tamizaje

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Frontend React
    participant API as API Django
    participant DB as SQLite
    U->>F: Selecciona evaluacion o juego
    F->>F: Presenta preguntas o actividad
    U->>F: Responde y finaliza
    F->>API: Envia tipo, puntaje y detalles
    API->>API: Valida token, rol y datos
    API->>DB: Guarda ResultadoPrueba
    DB-->>API: Confirma persistencia
    API-->>F: Devuelve resultado orientativo
    F-->>U: Muestra puntaje y estado
```

## Figura 6.8. Diagrama de secuencia - Carga de documentos

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Frontend React
    participant API as API Django
    participant EXT as Tesseract / librerias
    participant DB as SQLite
    U->>F: Selecciona archivo o ingresa texto
    F->>API: Envia archivo o contenido
    API->>API: Valida tipo y tamano
    alt PDF o DOCX
        API->>EXT: Extrae texto del documento
    else Imagen
        API->>EXT: Ejecuta OCR con Tesseract
    else TXT
        API->>API: Lee el contenido
    end
    EXT-->>API: Devuelve texto extraido
    API->>EXT: Genera audio con pyttsx3 cuando corresponde
    API->>DB: Guarda ArchivoProcesado y ConversionAudio
    API-->>F: Devuelve texto y audio
    F-->>U: Presenta contenido accesible
```

## Figura 6.9. Diagrama de actividades - Flujo de navegacion

```mermaid
flowchart TD
    IN([Inicio]) --> LOGIN[Ingresar credenciales]
    LOGIN --> OK{Credenciales validas?}
    OK -- No --> ERROR[Mostrar error]
    ERROR --> LOGIN
    OK -- Si --> ROLE{Rol del usuario}
    ROLE -- Paciente --> PAT[Panel de paciente]
    ROLE -- Profesional --> PRO[Panel profesional]
    ROLE -- Administrador --> ADM[Panel administrativo]
    PAT --> ACTION[Ejecutar modulo autorizado]
    PRO --> ACTION
    ADM --> ACTION
    ACTION --> OUT{Cerrar sesion?}
    OUT -- No --> ACTION
    OUT -- Si --> END([Fin])
```

## Figura 6.10. Diagrama de clases

```mermaid
classDiagram
    class User {
        +int id
        +string username
        +string email
        +string password
    }
    class Profile {
        +int id
        +string role
    }
    class Paciente {
        +int id
        +string ci
        +int age
        +boolean is_office_patient
    }
    class Profesional {
        +int id
        +string license_number
        +string specialty
        +string institution
    }
    class TipoPrueba {
        +int id
        +string codigo
        +string nombre
        +string categoria
        +boolean activo
    }
    class ResultadoPrueba {
        +int id
        +int puntaje
        +datetime fecha_prueba
        +int duracion_segundos
        +json detalles
        +string estado
    }
    class RespuestaResultado {
        +int id
        +string clave
        +json respuesta
        +int puntaje
    }
    class ArchivoProcesado {
        +int id
        +string nombre_original
        +string tipo_mime
        +text texto_extraido
        +datetime creado_en
    }
    class ConversionAudio {
        +int id
        +decimal velocidad
        +string formato
        +datetime creado_en
    }
    User "1" --> "0..1" Profile
    Profile "1" --> "0..1" Paciente
    Profile "1" --> "0..1" Profesional
    Paciente "1" --> "0..*" ResultadoPrueba
    TipoPrueba "1" --> "0..*" ResultadoPrueba
    ResultadoPrueba "1" --> "0..*" RespuestaResultado
    User "1" --> "0..*" ArchivoProcesado
    ArchivoProcesado "1" --> "0..*" ConversionAudio
```

## Figura 6.11. Diagrama entidad-relacion (DER)

```mermaid
erDiagram
    USER ||--o| PROFILE : posee
    PROFILE ||--o| PACIENTE : tiene_datos
    PROFILE ||--o| PROFESIONAL : tiene_datos
    PACIENTE ||--o{ RESULTADO_PRUEBA : realiza
    TIPO_PRUEBA ||--o{ RESULTADO_PRUEBA : clasifica
    RESULTADO_PRUEBA ||--o{ RESPUESTA_RESULTADO : contiene
    USER ||--o{ ARCHIVO_PROCESADO : carga
    ARCHIVO_PROCESADO ||--o{ CONVERSION_AUDIO : genera
    USER {
        int id PK
        string username UK
        string email
        string password
    }
    PROFILE {
        int id PK
        int user_id FK
        string role
    }
    PACIENTE {
        int id PK
        int profile_id FK
        string ci UK
        int age
        boolean is_office_patient
    }
    PROFESIONAL {
        int id PK
        int profile_id FK
        string license_number UK
        string specialty
        string institution
    }
    TIPO_PRUEBA {
        int id PK
        string codigo UK
        string nombre
        string categoria
        boolean activo
    }
    RESULTADO_PRUEBA {
        int id PK
        int paciente_id FK
        int prueba_id FK
        int puntaje
        datetime fecha_prueba
        json detalles
        string estado
    }
    RESPUESTA_RESULTADO {
        int id PK
        int resultado_id FK
        string clave
        json respuesta
        int puntaje
    }
    ARCHIVO_PROCESADO {
        int id PK
        int propietario_id FK
        string nombre_original
        string tipo_mime
        text texto_extraido
        datetime creado_en
    }
    CONVERSION_AUDIO {
        int id PK
        int archivo_id FK
        decimal velocidad
        string formato
        datetime creado_en
    }
```

## Figura 6.12. Diagrama de arquitectura general

```mermaid
flowchart TB
    subgraph CLIENTE[Cliente]
        B[Navegador]
        FE[SPA React]
        ACC[Contexto de accesibilidad]
    end
    subgraph SERVIDOR[Servidor de aplicacion]
        API[API REST Django]
        AUTH[Autenticacion y roles]
        DOM[Reglas de dominio]
        PROC[OCR, documentos y audio]
    end
    subgraph DATOS[Persistencia]
        DB[(SQLite)]
        FILES[Archivos procesados]
    end
    B --> FE
    FE --> ACC
    FE -->|HTTP / JSON| API
    API --> AUTH
    API --> DOM
    API --> PROC
    AUTH --> DB
    DOM --> DB
    PROC --> DB
    PROC --> FILES
```

## Figura 6.13. Diagrama de despliegue

```mermaid
flowchart LR
    U[Navegador del usuario] --> FE[Servidor frontend<br/>React / CRA]
    FE --> API[Servidor de aplicaciones<br/>Django + DRF]
    API --> DB[(Base de datos<br/>SQLite)]
    API --> OCR[Servicio local<br/>Tesseract]
    API --> TTS[Motor local<br/>pyttsx3]
    API --> FS[Almacenamiento de archivos]
```

## Figura 6.14. Diagrama de arquitectura de red

```mermaid
flowchart TB
    USU[Usuario / navegador]

    subgraph RED[Red local de desarrollo]
        ROUTER[Router / red local]

        subgraph HOST[Equipo servidor IVI]
            WEB[Frontend React<br/>Servidor web :3000<br/>HTTP]
            API[Backend Django REST<br/>:8000<br/>HTTP / JSON]
            DB[(SQLite<br/>Persistencia local)]
            FILES[(Archivos procesados<br/>Almacenamiento local)]
            OCR[Tesseract<br/>OCR local]
            TTS[pyttsx3<br/>Texto a voz local]
        end
    end

    USU -->|HTTP :3000| ROUTER
    ROUTER --> WEB
    WEB -->|HTTP / JSON| API
    API --> DB
    API --> FILES
    API --> OCR
    API --> TTS

    classDef client fill:#e8f1ff,stroke:#4169a1,color:#17233d
    classDef network fill:#fff4d6,stroke:#bd8b00,color:#4b3900
    classDef service fill:#e6f5ed,stroke:#3c8c61,color:#173d28
    classDef data fill:#f2e8ff,stroke:#8055aa,color:#352047

    class USU client
    class ROUTER network
    class WEB,API,OCR,TTS service
    class DB,FILES data
```

## Uso en la tesis

- Insertar cada diagrama como una figura independiente con el titulo indicado.
- Mantener el mismo nombre de actores, procesos y entidades en todos los diagramas.
- Exportar los bloques Mermaid a SVG o PNG antes de incorporarlos al documento final.
- Ubicar el DER y el diagrama de clases despues de explicar la arquitectura y antes de describir los modulos.
- Mantener los diagramas de nivel 2 y el modelo relacional detallado como anexos opcionales.

## Imagenes exportadas

Las versiones SVG listas para insertar en la tesis se encuentran en [diagramas_tesis](diagramas_tesis/):

1. [Figura 6.1 - Contexto nivel 0](diagramas_tesis/figura_6_1_diagrama_de_contexto_nivel_0.svg)
2. [Figura 6.2 - Flujo de datos nivel 1](diagramas_tesis/figura_6_2_diagrama_de_flujo_de_datos_nivel_1.svg)
3. [Figura 6.3 - Diagrama conceptual](diagramas_tesis/figura_6_3_diagrama_conceptual.svg)
4. [Figura 6.4 - Casos de uso Paciente/Familia](diagramas_tesis/figura_6_4_diagrama_de_casos_de_uso_paciente_familia.svg)
5. [Figura 6.5 - Casos de uso Profesional](diagramas_tesis/figura_6_5_diagrama_de_casos_de_uso_profesional.svg)
6. [Figura 6.6 - Casos de uso Administrador](diagramas_tesis/figura_6_6_diagrama_de_casos_de_uso_administrador.svg)
7. [Figura 6.7 - Secuencia de tamizaje](diagramas_tesis/figura_6_7_diagrama_de_secuencia_proceso_de_tamizaje.svg)
8. [Figura 6.8 - Secuencia de carga de documentos](diagramas_tesis/figura_6_8_diagrama_de_secuencia_carga_de_documentos.svg)
9. [Figura 6.9 - Actividades de navegacion](diagramas_tesis/figura_6_9_diagrama_de_actividades_flujo_de_navegacion.svg)
10. [Figura 6.10 - Diagrama de clases](diagramas_tesis/figura_6_10_diagrama_de_clases.svg)
11. [Figura 6.11 - Diagrama entidad-relacion](diagramas_tesis/figura_6_11_diagrama_entidad_relacion_der_.svg)
12. [Figura 6.12 - Arquitectura general](diagramas_tesis/figura_6_12_diagrama_de_arquitectura_general.svg)
13. [Figura 6.13 - Diagrama de despliegue](diagramas_tesis/figura_6_13_diagrama_de_despliegue.svg)
14. [Figura 6.14 - Arquitectura de red](diagramas_tesis/figura_6_14_diagrama_de_arquitectura_de_red.svg)
