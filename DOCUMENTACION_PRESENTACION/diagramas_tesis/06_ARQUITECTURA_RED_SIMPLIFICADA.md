# Arquitectura de red y despliegue simplificada de IVI

Diagrama PlantUML reducido a los componentes esenciales de cliente, red
pública, backend y persistencia.

```plantuml
@startuml 06_ARQUITECTURA_RED_SIMPLIFICADA

title Arquitectura de red y despliegue - IVI

top to bottom direction
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
    RoundCorner 10
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

package "1. NIVEL CLIENTE" #DCEEFF {
    rectangle "Navegador web\nSPA React 19.2\nReact Router 7.13\nGitHub Pages" as BROWSER
    rectangle "localStorage\nToken y preferencias" as STORAGE
    rectangle "OCR: tesseract.js\nTTS: speechSynthesis" as ACCESSIBILITY

    BROWSER --> STORAGE : Sesion
    BROWSER --> ACCESSIBILITY : Procesamiento local
}

package "2. NIVEL DE RED PUBLICA" #E8F5E9 {
    rectangle "GitHub Pages\nFrontend estatico" as PAGES
    rectangle "GitHub Actions\ndeploy-pages.yml" as ACTIONS

    ACTIONS --> PAGES : Despliegue automatico
}

package "3. NIVEL BACKEND" #FCE4EC {
    rectangle "API REST\nHTTP / JSON" as API
    rectangle "PythonAnywhere\nDjango 4.2 + DRF 3.14\nPython 3.12" as BACKEND
    rectangle "Autenticacion\nToken propio" as AUTH

    API --> BACKEND : Solicitudes
    BACKEND --> AUTH : Valida token
}

package "4. NIVEL DE PERSISTENCIA" #FFF3E0 {
    rectangle "Django ORM\nModelos y migraciones" as ORM
    database "SQLite\nPythonAnywhere" as DB

    ORM --> DB : Lectura y escritura
}

BROWSER --> PAGES : Accede por HTTPS
PAGES --> API : Consume API
AUTH --> ORM : Datos autenticados

note right of PAGES
    https://nestorzalazar.github.io/IVI/
end note

note right of BACKEND
    https://danzgamer1.pythonanywhere.com
end note

@enduml
```

## Flujo principal

**Navegador web → GitHub Pages → API REST → PythonAnywhere → Django ORM →
SQLite.**

El frontend ejecuta localmente el OCR con `tesseract.js` y el texto a voz con
`speechSynthesis`. La autenticación utiliza un token propio enviado a la API.
