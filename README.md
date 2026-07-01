# BuscandoHuellas

BuscandoHuellas es una aplicación web enfocada a uso movil y orientada a la búsqueda y recuperación de mascotas al permitir publicar reportes de mascotas perdidas, avistadas o albergadas; encontrar coincidencias entre publicaciones; abrir conversaciones entre usuarios mediante chats; cerrar un caso cuando la mascota aparece y conservarlos en el sitio como casos de éxito.

La solución está dividida en un frontend en Svelte, una API en Node.js con Express y una base de datos MySQL alojada en Aiven. Además, integra autenticación con verificación por correo, almacenamiento de imágenes en AWS S3 y notificaciones automáticas con Nodemailer.

## 1. Descripción general

El objetivo de BuscandoHuellas es acompañar el ciclo completo de un reporte de mascota con una experiencia simple para quien publica y útil para quien busca desde la comodidad de un teléfono. El flujo real de la aplicación queda dividido en cinco momentos:

- Registro y verificación de la cuenta por correo.
- Creación de una publicación con datos físicos, ubicación, evidencias y datos de contacto.
- Búsqueda y filtrado de coincidencias desde el catálogo global de reportes.
- Comunicación directa mediante chat para acordar prueba de propiedad o un encuentro.
- Cierre del caso y registro de la recuperación como historia de éxito.

La interfaz está pensada como una SPA con vistas específicas para inicio, búsqueda, publicación, publicación detallada, chats, perfil y casos de éxito.

La lógica de negocio se apoya en procedimientos almacenados, notificaciones en base de datos y correos automáticos para reducir fricción en la comunicación entre usuarios.

## 2. Arquitectura

### Frontend

El frontend está hecho con Svelte y Vite. No utiliza un router externo: la navegación principal se resuelve en [client/src/App.svelte](client/src/App.svelte) mediante `history.pushState`, estado local de vista y eventos entre componentes.

Los componentes principales del frontend viven en [client/src/lib](client/src/lib) y cubren las pantallas de inicio, búsqueda, publicación, detalle de publicación, chats, registro, inicio de sesión, edición de perfil, mapa y casos de éxito. La app también carga notificaciones cada cierto intervalo y conserva el estado de sesión con `sessionStorage` para mantener la experiencia entre vistas.

### Backend

El backend es una API REST con Express. El arranque está en [server/src/index.js](server/src/index.js) y expone, entre otros, estos grupos de rutas:

- `GET /health` para verificación básica de conexión con la API.
- `/api/posts` para creación y baja de publicaciones.
- `/api/mascotas` para consulta de reportes.
- `/api/catalogs` para especies, razas, colores y discapacidades.
- `/api/crear-cuenta` y `/api/iniciar-sesion` para autenticación.
- `/api/chats` para conversación y mensajes.
- `/api/images` para cargas hacia S3.
- `/api/notifications` para notificaciones internas.
- `/api/casos-exito` para historias cerradas.

El servidor también valida la conexión a MySQL al iniciar, habilita CORS para el frontend local y ejecuta un proceso periódico de recordatorios de chat desde [server/src/services/chatReminder.js](server/src/services/chatReminder.js). En otras palabras, no solo responde a peticiones: también orquesta envíos de correo y automatizaciones en segundo plano.

### Base de datos

La persistencia usa MySQL hospedado en Aiven. La conexión se configura en [server/src/db.js](server/src/db.js) con SSL, credenciales por variables de entorno y un pool de conexiones de `mysql2`.

A nivel de lógica SQL, el proyecto usa:

- Procedimientos almacenados para crear publicaciones, cerrar casos, registrar cambios de estado y buscar coincidencias de mascotas con reglas de negocio específicas.
- Un trigger para registrar el historial de cambios de estado de publicaciones cada vez que un post cambia de activo a cerrado.
- Una vista consolidada para leer publicaciones completas con mascota, dueño, ubicación e imagen principal en una sola consulta.

Las entidades que el código consulta y relaciona incluyen, entre otras: Users, Posts, Pets, Locations, Chats, Messages, Notifications, Images, Species, Breeds, Colors, Disabilities, Zip_Codes, Pet_Colors, Pet_Disabilities y Post_Status_History. El diseño está orientado a separar la información de mascota, publicación, contacto y conversación para poder reutilizar una misma mascota en más de un flujo.

### Servicios cloud

- AWS S3: almacenamiento de imágenes de publicaciones y evidencias de chat; el backend guarda en MySQL solo la URL resultante.
- Aiven MySQL: base de datos administrada con conexión SSL y certificados configurados desde el servidor.
- Correo SMTP con Gmail vía Nodemailer: verificación de cuenta, avisos de coincidencias, recordatorios de chat y notificaciones de acciones dentro de la conversación.

## 3. Módulos principales

### Autenticación

El módulo de autenticación está formado por registro, verificación y acceso. Al crear una cuenta, el backend comprueba que el correo no exista, inserta el usuario, genera un JWT temporal, arma un enlace de verificación y envía un correo de activación. Cuando se abre ese enlace, el usuario queda marcado como verificado y recién entonces puede iniciar sesión.

En el frontend, el acceso a publicar, chats y edición de perfil depende de sesión activa; si no existe sesión, se redirige a la vista de login. Esto evita que los flujos sensibles queden expuestos por accidente.

Archivos clave:

- [server/src/routes/crearCuenta.js](server/src/routes/crearCuenta.js)
- [server/src/routes/iniciarSesion.js](server/src/routes/iniciarSesion.js)
- [client/src/lib/Crear_cuenta.svelte](client/src/lib/Crear_cuenta.svelte)
- [client/src/lib/Iniciar_sesion.svelte](client/src/lib/Iniciar_sesion.svelte)

### Publicación de mascotas

La publicación permite registrar una mascota extraviada, avistada o albergada con especie, raza, sexo, tamaño, cola, colores, discapacidades, rasgos distintivos, ubicación y datos de contacto. El flujo real primero crea el registro transaccional de mascota, ubicación y post, luego guarda colores y discapacidades, y finalmente sube la imagen a S3 para asociarla al post.

El componente de publicación también prellena nombre, correo y teléfono desde el perfil del usuario cuando existe sesión activa, y utiliza un selector de ubicación basado en Leaflet para capturar latitud, longitud y dirección.

Archivos clave:

- [server/src/routes/posts.js](server/src/routes/posts.js)
- [server/src/routes/images.js](server/src/routes/images.js)
- [client/src/lib/Publicar.svelte](client/src/lib/Publicar.svelte)
- [client/src/lib/MapPicker.svelte](client/src/lib/MapPicker.svelte)

### Búsqueda

La vista de búsqueda carga publicaciones activas y catálogos de apoyo, y permite filtrar por múltiples criterios. El frontend usa geolocalización y búsquedas de dirección con OpenStreetMap Nominatim para ayudar a ubicar coincidencias por cercanía real.

Además del texto libre, la búsqueda incorpora filtros por tipo de publicación, sexo, tamaño, raza, colores, rango de fechas, condición de cruce, presencia de cola y radio aproximado respecto a la ubicación del usuario.

Archivos clave:

- [server/src/routes/reportSheet.js](server/src/routes/reportSheet.js)
- [server/src/routes/catalogs.js](server/src/routes/catalogs.js)
- [client/src/lib/Buscar.svelte](client/src/lib/Buscar.svelte)

### Mensajería y chat

El chat permite abrir conversaciones asociadas a una publicación, enviar mensajes de texto, solicitar prueba de propiedad, proponer encuentros, subir evidencia fotográfica y cerrar el chat. También se generan correos automáticos cuando se envían acciones relevantes.

El backend almacena los mensajes con numeración incremental por chat y registra metadatos como latitud, longitud, fecha del encuentro y estado de validación de la prueba. La interfaz traduce esos tipos de mensaje a componentes visuales distintos para mostrar solicitudes, respuestas, imágenes y acciones de validación.

Archivos clave:

- [server/src/routes/chats.js](server/src/routes/chats.js)
- [server/src/routes/images.js](server/src/routes/images.js)
- [server/src/services/notifications.js](server/src/services/notifications.js)
- [client/src/lib/Chat.svelte](client/src/lib/Chat.svelte)
- [client/src/lib/Chats.svelte](client/src/lib/Chats.svelte)

### Cierre de caso

Cuando una mascota se recupera, la aplicación puede cerrar el caso y registrar un caso de éxito. El backend crea una publicación de tipo Success Story y marca la publicación original como cerrada, mientras que el frontend muestra la historia recuperada en una sección dedicada para darle visibilidad al desenlace.

Archivos clave:

- [server/src/routes/casosExito.js](server/src/routes/casosExito.js)
- [client/src/lib/Caso_cerrado.svelte](client/src/lib/Caso_cerrado.svelte)
- [client/src/lib/Caso_exito.svelte](client/src/lib/Caso_exito.svelte)
- [client/src/lib/Ficha_exito.svelte](client/src/lib/Ficha_exito.svelte)

### Notificaciones

Las notificaciones se almacenan en MySQL y se consultan desde el frontend para mostrar el contador de no leídas. El backend también envía correos de coincidencia, avisos de chat y recordatorios automáticos para mensajes sin respuesta, de modo que el sistema no dependa únicamente de que la persona usuaria vuelva a abrir la app.

Archivos clave:

- [server/src/routes/notifications.js](server/src/routes/notifications.js)
- [server/src/services/notifications.js](server/src/services/notifications.js)
- [server/src/services/chatReminder.js](server/src/services/chatReminder.js)

### Catálogos

Los catálogos sirven para poblar la interfaz con especies, razas, colores y discapacidades aprobadas. Esto centraliza las opciones válidas y evita inconsistencias entre formularios, filtros y consultas.

Archivos clave:

- [server/src/routes/catalogs.js](server/src/routes/catalogs.js)
- [client/src/lib/Publicar.svelte](client/src/lib/Publicar.svelte)
- [client/src/lib/Buscar.svelte](client/src/lib/Buscar.svelte)

## 4. Stack tecnológico completo

### Frontend

- Svelte 5.55.1
- Vite 8.0.4
- Leaflet 1.9.4
- Socket.IO Client 4.8.3

### Backend

- Node.js 24 Alpine, según los Dockerfiles
- Express 5.2.1
- mysql2 3.22.0
- jsonwebtoken 9.0.3
- multer 2.1.1
- multer-s3 3.0.1
- @aws-sdk/client-s3 3.1037.0
- nodemailer 9.0.3
- socket.io 4.8.3
- cors 2.8.6
- dotenv 17.4.2
- leaflet 1.9.4

### Base de datos y servicios

- MySQL en Aiven
- AWS S3 para almacenamiento de imágenes
- Gmail SMTP para correo transaccional vía Nodemailer
- OpenStreetMap Nominatim para geocodificación y búsqueda de ubicaciones desde el frontend

## 5. Instalación y variables de entorno

### Requisitos

- Node.js 24 o superior recomendado para coincidir con los contenedores
- npm
- Una instancia de MySQL en Aiven o equivalente
- Un bucket de AWS S3
- Una cuenta de correo para SMTP

### Instalación local

Instala dependencias en ambos proyectos:

```bash
cd client
npm install

cd ../server
npm install
```

### Variables de entorno del servidor

Crea [server/.env](server/.env) con al menos estas variables:

```env
PORT=3000
DB_HOST=tu-host-de-aiven
DB_PORT=3306
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=buscandohuellas
DB_SSL_CERT=certs/ca.pem
JWT_SECRET=una_clave_larga_y_secreta

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_BUCKET_NAME=tu_bucket

EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_app_password_o_password_smtp
```

Notas:

- `DB_SSL_CERT` debe apuntar al certificado CA que usa Aiven dentro de [server/certs](server/certs).
- El frontend actualmente consume la API en `http://localhost:3000/api` y no usa variables `VITE_` en el código actual.
- Si cambias puertos o dominios, tendrás que ajustar también las URLs hardcodeadas del frontend y de los correos del backend.
- El repositorio no define un archivo `.env` para el cliente; la configuración sensible vive en el backend y en el archivo de despliegue.

## 6. Cómo correr el proyecto en desarrollo

### Opción 1: con npm

En una terminal, levanta el backend:

```bash
cd server
node src/index.js
```

En otra terminal, levanta el frontend:

```bash
cd client
npm run dev
```

En el código actual, la app espera:

- Backend en `http://localhost:3000`
- Frontend en `http://localhost:5173`

### Opción 2: con Docker Compose

El proyecto incluye [docker-compose.yml](docker-compose.yml) con ambos servicios:

```bash
docker compose up --build
```

Esto expone:

- Cliente en `http://localhost:5173`
- Servidor en `http://localhost:3000`

## 7. Estructura de carpetas

```text
.
├── docker-compose.yml
├── client
│   ├── Dockerfile
│   ├── package.json
│   ├── src
│   │   ├── App.svelte
│   │   ├── main.js
│   │   ├── app.css
│   │   └── lib
│   │       ├── Buscar.svelte
│   │       ├── Caso_cerrado.svelte
│   │       ├── Caso_exito.svelte
│   │       ├── Chat.svelte
│   │       ├── Chats.svelte
│   │       ├── Contactos.svelte
│   │       ├── Crear_cuenta.svelte
│   │       ├── Editar_perfil.svelte
│   │       ├── Ficha_exito.svelte
│   │       ├── Iniciar_sesion.svelte
│   │       ├── Inicio.svelte
│   │       ├── MapPicker.svelte
│   │       ├── Navbar.svelte
│   │       ├── Publicacion.svelte
│   │       └── Publicar.svelte
│   └── public
├── server
│   ├── Dockerfile
│   ├── package.json
│   ├── certs
│   └── src
│       ├── db.js
│       ├── index.js
│       ├── mailer.js
│       ├── routes
│       │   ├── casosExito.js
│       │   ├── catalogs.js
│       │   ├── chats.js
│       │   ├── crearCuenta.js
│       │   ├── editarCuenta.js
│       │   ├── images.js
│       │   ├── iniciarSesion.js
│       │   ├── notifications.js
│       │   ├── posts.js
│       │   └── reportSheet.js
│       └── services
│           ├── chatReminder.js
│           └── notifications.js
└── database
    ├── procedures.sql
    ├── triggers.sql
    └── views.sql
```

## 8. Créditos

Este proyecto fue construido de forma colaborativa. Cada integrante cubrió una parte concreta del flujo funcional, lo que explica por qué el README y la estructura del código están divididos por dominios de negocio.

| Avatar | Nombre | Rol | Contribución | GitHub |
|--------|--------|-----|---------------|--------|
| <img src="https://github.com/Avj006.png" width="60"> | Andrea Villaseñor Jiménez | Autenticación y notificaciones | Implementó registro, inicio de sesión, edición de perfil, control de acceso por sesión, verificación por correo y el sistema de correos automáticos de la aplicación. | [@Avj006](https://github.com/Avj006) |
| <img src="https://github.com/11rls11.png" width="60"> | Raymundo Lopez Santiago | Publicación, infraestructura y base de datos | Desarrolló la vista y el backend de publicar, integró Leaflet, conectó la subida de imágenes a AWS S3, estructuró la base de datos y apoyó la contenedorización del proyecto. | [@11rls11](https://github.com/11rls11) |
| <img src="https://github.com/Charlie1719.png" width="60"> | Carlos Eduardo Lopez Cuevas | Búsqueda y visualización | Construyó la experiencia de búsqueda, los filtros combinados y el despliegue detallado de imágenes y datos de cada publicación. | [@Charlie1719](https://github.com/Charlie1719) |
| <img src="https://github.com/RodRM6.png" width="60"> | Rodolfo Alejandro Martínez Rodríguez | Casos de éxito | Diseñó y consolidó el flujo de cierre de caso, el registro del éxito y la pantalla de historias recuperadas. | [@RodRM6](https://github.com/RodRM6) |
| <img src="https://github.com/Alonso39197.png" width="60"> | Santiago Alonso Garzón Pérez | Mensajería en tiempo real | Implementó el chat, la gestión de contactos, la lógica de conversación y las notificaciones asociadas a los mensajes. | [@Alonso39197](https://github.com/Alonso39197) |

<div align="center">
<a href="https://github.com/Rodo996/BuscandoHuellas/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Rodo996/BuscandoHuellas" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

</div>