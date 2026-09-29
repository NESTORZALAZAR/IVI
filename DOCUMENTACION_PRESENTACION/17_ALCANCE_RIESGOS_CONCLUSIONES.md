# 17. Alcance, riesgos y conclusiones

![Alcance, riesgos y conclusiones](17_ALCANCE_RIESGOS_CONCLUSIONES.svg)

## Alcance incluido

- Plataforma web React y API Django.
- Registro, autenticacion y roles.
- Cuestionarios por etapa.
- Cinco juegos de tamizaje y un acceso al menú principal.
- Historial y seguimiento profesional.
- Lectura de documentos, OCR y audio.
- Configuracion de accesibilidad.
- Administracion de usuarios.

## Fuera de alcance

- Diagnostico clinico automatico.
- Sustitucion de psicopedagogos, neurologos o fonoaudiologos.
- Interpretacion medica definitiva.
- Integracion con historias clinicas externas.
- Despliegue productivo institucional sin configuracion adicional.

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Resultado interpretado como diagnostico | Alto | Avisos, guia y derivacion profesional |
| Exposicion de datos personales | Alto | Roles, HTTPS, minimizacion y auditoria |
| OCR impreciso | Medio | Mensaje de revision y mejora de imagen |
| TTS no disponible | Medio | Web Speech API y mensaje de fallback |
| Token simple en desarrollo | Alto | Migrar a JWT/DRF Token en produccion |
| Falta de cobertura automatizada | Medio | Plan de pruebas y CI |

## Conclusiones

IVI integra tamizaje orientativo, actividades ludicas, lectura accesible y seguimiento profesional en una sola plataforma. Su valor principal es reducir barreras de acceso y presentar la informacion en formatos adaptables.

El sistema queda preparado para una demostracion funcional y una evolucion posterior hacia mayor seguridad, persistencia, pruebas automatizadas y despliegue institucional.
