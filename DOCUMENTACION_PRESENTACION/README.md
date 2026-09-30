# Documentacion de Presentacion - IVI

Este paquete resume la plataforma IVI para presentacion academica, tecnica y funcional.

## Orden recomendado

1. [06_PLAN_TECNICO.md](06_PLAN_TECNICO.md) - Capitulo 6 para el borrador de tesis.
2. [DIAGRAMAS_TESIS.md](DIAGRAMAS_TESIS.md) - Fuentes de las 13 figuras del capitulo 6.
3. [01_ARQUITECTURA.md](01_ARQUITECTURA.md)
4. [02_CASOS_DE_USO_NIVEL_0.md](02_CASOS_DE_USO_NIVEL_0.md)
5. [03_CASOS_DE_USO_NIVEL_1.md](03_CASOS_DE_USO_NIVEL_1.md)
6. [04_DER_MODELO_DATOS.md](04_DER_MODELO_DATOS.md)
7. [05_REQUISITOS.md](05_REQUISITOS.md)
8. [06_FLUJOS_PRINCIPALES.md](06_FLUJOS_PRINCIPALES.md)
9. [07_MATRIZ_TRAZABILIDAD.md](07_MATRIZ_TRAZABILIDAD.md)
10. [08_GUIA_DE_PRESENTACION.md](08_GUIA_DE_PRESENTACION.md)
11. [11_PLAN_DE_PRUEBAS.md](11_PLAN_DE_PRUEBAS.md)
12. [12_API.md](12_API.md)
13. [13_SEGURIDAD_PRIVACIDAD.md](13_SEGURIDAD_PRIVACIDAD.md)
14. [14_DICCIONARIO_DATOS.md](14_DICCIONARIO_DATOS.md)
15. [15_MANUAL_USUARIO.md](15_MANUAL_USUARIO.md)
16. [16_DESPLIEGUE.md](16_DESPLIEGUE.md)
17. [17_ALCANCE_RIESGOS_CONCLUSIONES.md](17_ALCANCE_RIESGOS_CONCLUSIONES.md)
18. [18_CATALOGO_DE_CASOS_DE_USO.md](18_CATALOGO_DE_CASOS_DE_USO.md)

## Alcance

IVI es una plataforma web de apoyo y tamizaje dislexico. Integra:

- Registro e inicio de sesion.
- Cuestionarios de tamizaje por etapa.
- Cinco juegos de memoria, silabas, letras, lectura y ortografia, mas un acceso al menu principal.
- Registro de resultados para seguimiento.
- Panel de doctor/profesional y administracion de usuarios.
- Lectura de documentos y textos.
- OCR para imagenes y conversion de texto a audio.
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
