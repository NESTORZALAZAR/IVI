# Modelo arquitectónico TCP/IP de la plataforma IVI

Diagrama PlantUML del flujo de comunicación entre el navegador, GitHub Pages,
la API Django en PythonAnywhere y la base de datos SQLite.

```plantuml
@startuml 07_MODELO_TCPIP

title Modelo arquitectónico TCP/IP - Plataforma IVI

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
    |= Capa TCP/IP | Color |
    | Aplicacion | <back:#DCEEFF> Azul claro </back> |
    | Transporte | <back:#E8F5E9> Verde claro </back> |
    | Internet | <back:#FCE4EC> Rosa claro </back> |
    | Acceso a la red | <back:#FFF3E0> Naranja claro </back> |
endlegend

package "CAPA DE APLICACION" #DCEEFF {
    actor "Usuario" as USER
    rectangle "Navegador web\nCliente SPA React 19.2" as BROWSER
    rectangle "GitHub Pages\nnestorzalazar.github.io/IVI/" as PAGES
    rectangle "Fetch\nSolicitudes del frontend" as FETCH
    rectangle "HTTP / HTTPS\nJSON" as HTTP
    rectangle "API REST\nDjango REST Framework 3.14" as API
    rectangle "Backend Django 4.2\nPythonAnywhere" as BACKEND
    database "SQLite\nPythonAnywhere" as DB
    rectangle "Autenticacion\nAuthorization: Bearer\n token_<id>_<username>" as AUTH
    rectangle "OCR\ntesseract.js" as OCR
    rectangle "Texto a voz\nspeechSynthesis" as TTS

    USER --> BROWSER : Interaccion
    BROWSER --> PAGES : Carga de la SPA
    BROWSER --> FETCH : Ejecuta
    FETCH --> HTTP : Envia
    HTTP --> API : Consume
    API --> BACKEND : Enruta
    BACKEND --> DB : Django ORM
    FETCH --> AUTH : Agrega token
    BROWSER --> OCR : Procesa imagen
    BROWSER --> TTS : Reproduce texto
}

package "CAPA DE TRANSPORTE" #E8F5E9 {
    rectangle "TCP\nConexion orientada a flujo" as TCP
    rectangle "TLS\nCifrado de HTTPS" as TLS
    rectangle "Puerto 443\nComunicacion segura" as PORT

    TCP --> TLS : Transporta
    TLS --> PORT : Protege
}

package "CAPA DE INTERNET" #FCE4EC {
    rectangle "IP\nDireccionamiento y enrutamiento" as IP
    rectangle "DNS\nnestorzalazar.github.io\n danzgamer1.pythonanywhere.com" as DNS
    rectangle "Rutas entre cliente,\nGitHub Pages y PythonAnywhere" as ROUTING

    DNS --> IP : Resuelve dominios
    IP --> ROUTING : Enruta paquetes
}

package "CAPA DE ACCESO A LA RED" #FFF3E0 {
    rectangle "Wi-Fi / datos moviles\nCliente" as CLIENT_NET
    cloud "Infraestructura cloud\nGitHub Pages" as GH_NET
    cloud "Infraestructura cloud\nPythonAnywhere" as PA_NET
    rectangle "Enlace fisico y acceso\nal medio" as LINK

    CLIENT_NET --> LINK : Acceso
    LINK --> GH_NET : Conectividad
    LINK --> PA_NET : Conectividad
}

USER --> CLIENT_NET : Accede a Internet
PAGES --> TLS : HTTPS
HTTP --> TLS : Se cifra
TLS --> TCP : Usa
PORT --> DNS : Consulta
DNS --> GH_NET : Resuelve GitHub Pages
DNS --> PA_NET : Resuelve PythonAnywhere
GH_NET --> PAGES : Sirve frontend
PA_NET --> BACKEND : Aloja backend
ROUTING --> IP : Direcciona
IP --> TCP : Entrega segmentos

note bottom of HTTP
    Flujo principal:
    Usuario -> navegador -> GitHub Pages -> Fetch -> HTTPS/TLS
    -> TCP/IP -> API REST en PythonAnywhere -> SQLite.
end note

@enduml
```

## Tecnologías representadas

- **Aplicación:** HTTP/HTTPS, JSON, Fetch, API REST, React 19.2, Django 4.2,
  Django REST Framework 3.14, `tesseract.js` y `speechSynthesis`.
- **Transporte:** TCP y TLS para proteger la comunicación HTTPS.
- **Internet:** IP y DNS para resolver `nestorzalazar.github.io` y
  `danzgamer1.pythonanywhere.com`.
- **Acceso a la red:** Wi-Fi o datos móviles del cliente e infraestructura
  cloud de GitHub Pages y PythonAnywhere.
- **Persistencia:** SQLite alojado en PythonAnywhere.
