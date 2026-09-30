# Documentacion de Presentacion - IVI

Este paquete resume la plataforma IVI para presentacion academica, tecnica y funcional.

## Orden recomendado

1. [01_ARQUITECTURA.md](01_ARQUITECTURA.md) - Arquitectura y capas.
2. [02_CASOS_DE_USO_NIVEL_0.md](02_CASOS_DE_USO_NIVEL_0.md) - Contexto y actores.
3. [03_CASOS_DE_USO_NIVEL_1.md](03_CASOS_DE_USO_NIVEL_1.md) - Flujos detallados.
4. [04_DER_MODELO_DATOS.md](04_DER_MODELO_DATOS.md) - Modelo entidad-relacion.
5. [05_REQUISITOS.md](05_REQUISITOS.md) - Requisitos funcionales y no funcionales.
6. [06_FLUJOS_PRINCIPALES.md](06_FLUJOS_PRINCIPALES.md) - Flujos principales.
7. [06_PLAN_TECNICO.md](06_PLAN_TECNICO.md) - Plan tecnico del capitulo 6.
8. [07_MATRIZ_TRAZABILIDAD.md](07_MATRIZ_TRAZABILIDAD.md) - Cobertura de requisitos.
9. [08_GUIA_DE_PRESENTACION.md](08_GUIA_DE_PRESENTACION.md) - Guion de exposicion.
10. [09_ESTRUCTURA_ENTREGA.md](09_ESTRUCTURA_ENTREGA.md) - Estructura de la entrega.
11. [10_LIMITACIONES_Y_MEJORAS.md](10_LIMITACIONES_Y_MEJORAS.md) - Limites y mejoras.
12. [11_PLAN_DE_PRUEBAS.md](11_PLAN_DE_PRUEBAS.md) - Plan de pruebas.
13. [12_API.md](12_API.md) - Contrato de la API.
14. [13_SEGURIDAD_PRIVACIDAD.md](13_SEGURIDAD_PRIVACIDAD.md) - Seguridad y privacidad.
15. [14_DICCIONARIO_DATOS.md](14_DICCIONARIO_DATOS.md) - Diccionario de datos.
16. [15_MANUAL_USUARIO.md](15_MANUAL_USUARIO.md) - Manual de usuario.
17. [16_DESPLIEGUE.md](16_DESPLIEGUE.md) - Despliegue.
18. [17_ALCANCE_RIESGOS_CONCLUSIONES.md](17_ALCANCE_RIESGOS_CONCLUSIONES.md) - Cierre del proyecto.
19. [18_CATALOGO_DE_CASOS_DE_USO.md](18_CATALOGO_DE_CASOS_DE_USO.md) - Catalogo consolidado.
20. [DIAGRAMAS_TESIS.md](DIAGRAMAS_TESIS.md) - Fuentes Mermaid y figuras exportadas.

## Alcance

IVI es una plataforma web de apoyo y tamizaje dislexico. Integra:

- Registro e inicio de sesion.
- Cuestionarios de tamizaje por etapa.
- Cinco juegos de memoria, silabas, letras, lectura y ortografia, mas un acceso al menu principal.
- Registro de resultados para seguimiento.
- Panel de doctor/profesional y administracion de usuarios.
- Lectura de documentos y textos; el lector de texto usa la API `SpeechSynthesis` del navegador.
- OCR para imagenes; esta capacidad mantiene Tesseract porque no existe una API web nativa estandar para OCR.
- Configuracion de fuente, tamano, espaciado y tema.

## Estado del modelo de datos

La base de datos esta normalizada en nueve entidades documentadas en el DER:
`User`, `Profile`, `Paciente`, `Profesional`, `TipoPrueba`, `ResultadoPrueba`,
`RespuestaResultado`, `ArchivoProcesado` y `ConversionAudio`. La migracion
`usuarios.0008` realiza el traslado desde el esquema anterior y el catalogo
inicial contiene ocho tipos de prueba.

## Nota de alcance clinico

Los resultados son orientativos y no constituyen un diagnostico medico. La plataforma apoya la deteccion temprana y el acompanamiento; la confirmacion corresponde a un profesional especializado.

## Fuentes del proyecto

- Frontend: `frontend/src/js/App.js`, paginas React y hojas CSS.
- Backend: `backend/usuarios`, `backend/lector`, `backend/tamizaje` y `backend/archivos`.
- Modelos principales: `backend/usuarios/models.py`.
