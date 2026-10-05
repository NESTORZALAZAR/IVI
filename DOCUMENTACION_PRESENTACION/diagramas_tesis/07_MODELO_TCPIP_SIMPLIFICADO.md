# Modelo TCP/IP simplificado de la plataforma IVI

Versión reducida del modelo arquitectónico TCP/IP, enfocada en los componentes
esenciales y en el flujo principal de comunicación.

```plantuml
@startuml 07_MODELO_TCPIP_SIMPLIFICADO

title Modelo arquitectónico TCP/IP - IVI

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
skinparam note {
    BackgroundColor #FFF8DC
    BorderColor #C9A227
}

package "1. CAPA DE APLICACION" #DCEEFF {
    rectangle "Frontend\nReact 19.2\nGitHub Pages" as FRONTEND
    rectangle "API REST\nHTTP / JSON" as API
    rectangle "Backend\nDjango 4.2 + DRF 3.14\nPythonAnywhere" as BACKEND

    FRONTEND --> API : Solicitudes
    API --> BACKEND : Respuestas
}

package "2. CAPA DE TRANSPORTE" #E8F5E9 {
    rectangle "TLS\nHTTPS" as TLS
    rectangle "TCP" as TCP

    TLS --> TCP : Cifrado sobre transporte
}

package "3. CAPA DE INTERNET" #FCE4EC {
    rectangle "DNS\nResuelve los dominios" as DNS
    rectangle "IP\nDireccionamiento" as IP

    DNS --> IP : Ubica los servicios
}

package "4. CAPA DE ACCESO A LA RED" #FFF3E0 {
    rectangle "Wi-Fi / datos moviles\nInfraestructura cloud" as NETWORK
}

BACKEND --> TLS : Comunicacion segura
TCP --> DNS : Enrutamiento
IP --> NETWORK : Acceso a la red

note right of FRONTEND
    Frontend:
    nestorzalazar.github.io/IVI/
end note

note right of BACKEND
    Backend:
    danzgamer1.pythonanywhere.com
    SQLite se ejecuta en PythonAnywhere.
end note

note bottom of API
    Autenticacion: token propio
end note

@enduml
```

El flujo simplificado es:

**Frontend React → API REST → Backend Django → TLS/HTTPS → TCP → DNS/IP →
red Wi-Fi o datos móviles → infraestructura cloud.**
