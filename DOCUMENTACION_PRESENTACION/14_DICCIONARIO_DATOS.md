# 14. Diccionario de datos

Este diccionario refleja las tablas propias de IVI. Django tambien administra tablas internas para autenticacion, sesiones y permisos.

## User

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| id | Entero PK | Si | Identificador de Django |
| username | Texto | Si | Nombre de acceso |
| email | Texto | Si | Correo del usuario |
| password | Hash | Si | Contrasena almacenada por Django |
| first_name | Texto | No | Nombre |
| last_name | Texto | No | Apellido |

## Profile

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| id | Entero PK | Si | Identificador del perfil |
| user_id | FK unica | Si | Relacion 1:1 con `User` |
| role | Enum | Si | `admin`, `doctor` o `paciente` |

`Profile` no contiene CI, edad, matricula ni especialidad. Esos datos se guardan en las tablas especificas siguientes.

## Paciente

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| id | Entero PK | Si | Identificador del registro |
| profile_id | FK unica | Si | Perfil representado |
| ci | Texto unico | No | Identificador civil; la API lo exige para pacientes registrados |
| age | Entero positivo | No | Edad del paciente |
| is_office_patient | Booleano | Si | Indica atencion en consultorio |

## Profesional

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| id | Entero PK | Si | Identificador del registro |
| profile_id | FK unica | Si | Perfil del profesional |
| license_number | Texto unico nullable | No | Matricula profesional; requerida para doctores |
| specialty | Texto | No | Especialidad; requerida para doctores |
| institution | Texto | No | Institucion asociada |

## TipoPrueba

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| id | Entero PK | Si | Identificador del catalogo |
| codigo | Texto unico | Si | Codigo usado por la API |
| nombre | Texto | Si | Nombre visible de la prueba |
| categoria | Texto | Si | `evaluacion`, `filtro` o `juego` |
| activo | Booleano | Si | Permite habilitar o deshabilitar el tipo |

## ResultadoPrueba

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| id | Entero PK | Si | Identificador del resultado |
| paciente_id | FK | Si | Paciente que realiza la prueba |
| prueba_id | FK | Si | Tipo del catalogo `TipoPrueba` |
| puntaje | Entero | Si | Valor entre 0 y 100 |
| fecha_prueba | Fecha/hora | Si | Se asigna automaticamente |
| duracion_segundos | Entero | No | Duracion de la actividad |
| detalles | JSON | No | Metadatos variables y compatibilidad de la API |
| estado | Enum | Si | `completada`, `incompleta` o `cancelada` |

La API mantiene `usuario_id` y `usuario_username` como datos derivados para no romper el frontend, pero la base almacena la relacion `paciente_id`. El codigo `tipo_prueba` tambien se deriva de `prueba_id`.

## RespuestaResultado

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| id | Entero PK | Si | Identificador de la respuesta |
| resultado_id | FK | Si | Resultado al que pertenece |
| clave | Texto | Si | Nombre de la pregunta, indicador o componente |
| respuesta | JSON | Si | Valor o estructura de la respuesta |
| puntaje | Entero | No | Puntaje individual entre 0 y 100 |

La combinacion `resultado_id` + `clave` es unica.

## ArchivoProcesado

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| id | Entero PK | Si | Identificador del procesamiento |
| propietario_id | FK nullable | No | Usuario autenticado que envio el archivo |
| nombre_original | Texto | Si | Nombre recibido |
| tipo_mime | Texto | No | Tipo MIME informado por la carga |
| texto_extraido | Texto largo | Si | Texto obtenido del PDF, DOCX o TXT |
| creado_en | Fecha/hora | Si | Fecha de procesamiento |

## ConversionAudio

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| id | Entero PK | Si | Identificador de la conversion |
| archivo_id | FK | Si | Archivo procesado de origen |
| velocidad | Decimal | Si | Velocidad solicitada para TTS |
| formato | Texto | Si | Actualmente `mp3` |
| creado_en | Fecha/hora | Si | Fecha de conversion |

## Catalogo inicial de pruebas

| Codigo | Categoria | Nombre |
|---|---|---|
| `lectura` | evaluacion | Prueba de Lectura |
| `velocidad` | evaluacion | Prueba de Velocidad |
| `comprension` | evaluacion | Prueba de Comprension |
| `ortografia` | evaluacion | Prueba de Ortografia |
| `alfabeto` | filtro | Filtro de Conocimiento: Alfabeto |
| `parejas` | juego | Juego: Parejas escondidas |
| `silabas` | juego | Juego: El tren de silabas |
| `letras` | juego | Juego: Lluvia de letras |
