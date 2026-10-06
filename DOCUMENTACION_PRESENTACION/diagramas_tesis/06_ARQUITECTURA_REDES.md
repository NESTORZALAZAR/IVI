# Arquitectura de red y despliegue de la plataforma IVI

Fuente PlantUML del diagrama actualizado:

```plantuml
@startuml 06_ARQUITECTURA_REDES

title Arquitectura de red y despliegue - Plataforma IVI

left to right direction
skinparam backgroundColor #FFFFFF
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultTextAlignment center
skinparam packageStyle rectangle
skinparam ArrowColor #34495E
skinparam ArrowThickness 1.5
skinparam packageBorderColor #34495E
skinparam rectangle {
    BackgroundColor #FFFFFF
    BorderColor #34495E
    RoundCorner 12
}
skinparam database {
    BackgroundColor #FFFFFF
    BorderColor #34495E
}
skinparam cloud {
    BackgroundColor #FFFFFF
    BorderColor #34495E
}
skinparam note {
    BackgroundColor #FFF8DC
    BorderColor #C9A227
}

legend right
    |= Nivel | Color |
    | Cliente | <back:#DCEEFF> Azul claro </back> |
    | Red publica | <back:#E8F5E9> Verde claro </back> |
    | Backend | <back:#FCE4EC> Rosa claro </back> |
    | Persistencia | <back:#FFF3E0> Naranja claro </back> |
endlegend

package "1. NIVEL CLIENTE" #DCEEFF {
    actor "Usuario" as USER
    rectangle "Navegador web" as BROWSER
    rectangle "SPA React 19.2\nReact Router 7.13\nCreate React App 5.0.1" as FRONTEND
    rectangle "GitHub Pages\nnestorzalazar.github.io/IVI/" as PAGES
    rectangle "Sesion y preferencias\nlocalStorage" as STORAGE
    rectangle "OCR en navegador\ntesseract.js" as OCR
    rectangle "Texto a voz en navegador\nspeechSynthesis" as TTS

    USER --> BROWSER : Interaccion
    BROWSER --> FRONTEND : Carga de la SPA
    FRONTEND --> PAGES : Se sirve desde
    FRONTEND --> STORAGE : Token y preferencias
    FRONTEND --> OCR : Imagen
    FRONTEND --> TTS : Texto
}

package "2. NIVEL DE RED PUBLICA" #E8F5E9 {
    cloud "GitHub\nNESTORZALAZAR/IVI" as REPO
    rectangle "GitHub Actions\ndeploy-pages.yml" as ACTIONS
    rectangle "HTTPS\nHTTP/JSON\nAuthorization: Bearer" as HTTP

    REPO --> ACTIONS : Push a main
    ACTIONS --> PAGES : Build y despliegue
    BROWSER --> HTTP : Solicitudes API
}

package "3. NIVEL BACKEND" #FCE4EC {
    cloud "PythonAnywhere\nDanzgamer1" as PYANY
    rectangle "API Django\nPython 3.12\nDjango 4.2" as DJANGO
    rectangle "Django REST Framework 3.14\n/api/ y endpoints de dominio" as DRF
    rectangle "Usuarios, tamizaje,\nlector y archivos" as MODULES
    rectangle "Autenticacion propia\n token_<id>_<username>" as AUTH

    PYANY --> DJANGO : Ejecuta
    DJANGO --> DRF : Expone API
    DRF --> MODULES : Enrutamiento
    MODULES --> AUTH : Valida Bearer token
}

package "4. NIVEL DE PERSISTENCIA" #FFF3E0 {
    database "SQLite\nPythonAnywhere" as DB
    rectangle "Django ORM\nMigraciones y modelos" as ORM

    MODULES --> ORM : Persistencia
    ORM --> DB : Lectura y escritura
}

PAGES --> HTTP : Frontend publicado
HTTP --> PYANY : HTTPS\nhttps://danzgamer1.pythonanywhere.com
AUTH --> HTTP : Respuesta API

note bottom of HTTP
    Desarrollo local: frontend http://localhost:3000
    Backend http://localhost:8000
    En produccion, la SPA se publica en GitHub Pages
    y consume la API alojada en PythonAnywhere.
end note

@enduml
```

## Servicios representados

- Frontend React publicado en [GitHub Pages](https://nestorzalazar.github.io/IVI/).
- Backend Django REST alojado en [PythonAnywhere](https://danzgamer1.pythonanywhere.com).
- Código fuente en [GitHub](https://github.com/NESTORZALAZAR/IVI).
- Despliegue automático mediante GitHub Actions y `deploy-pages.yml`.
- Persistencia SQLite en PythonAnywhere.
- OCR con `tesseract.js` y texto a voz con `speechSynthesis`, ambos en el navegador.

La imagen SVG generada a partir de esta fuente se encuentra en
`06_ARQUITECTURA_REDES.svg`.
