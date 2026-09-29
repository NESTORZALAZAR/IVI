# Documentacion de Presentacion - IVI

Este paquete resume la plataforma IVI para presentacion academica, tecnica y funcional.

## Orden recomendado

1. [01_ARQUITECTURA.md](01_ARQUITECTURA.md)
2. [02_CASOS_DE_USO_NIVEL_0.md](02_CASOS_DE_USO_NIVEL_0.md)
3. [03_CASOS_DE_USO_NIVEL_1.md](03_CASOS_DE_USO_NIVEL_1.md)
4. [04_DER_MODELO_DATOS.md](04_DER_MODELO_DATOS.md)
5. [05_REQUISITOS.md](05_REQUISITOS.md)
6. [06_FLUJOS_PRINCIPALES.md](06_FLUJOS_PRINCIPALES.md)
7. [07_MATRIZ_TRAZABILIDAD.md](07_MATRIZ_TRAZABILIDAD.md)
8. [08_GUIA_DE_PRESENTACION.md](08_GUIA_DE_PRESENTACION.md)
9. [11_PLAN_DE_PRUEBAS.md](11_PLAN_DE_PRUEBAS.md)
10. [12_API.md](12_API.md)
11. [13_SEGURIDAD_PRIVACIDAD.md](13_SEGURIDAD_PRIVACIDAD.md)
12. [14_DICCIONARIO_DATOS.md](14_DICCIONARIO_DATOS.md)
13. [15_MANUAL_USUARIO.md](15_MANUAL_USUARIO.md)
14. [16_DESPLIEGUE.md](16_DESPLIEGUE.md)
15. [17_ALCANCE_RIESGOS_CONCLUSIONES.md](17_ALCANCE_RIESGOS_CONCLUSIONES.md)
16. [18_CATALOGO_DE_CASOS_DE_USO.md](18_CATALOGO_DE_CASOS_DE_USO.md)

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
