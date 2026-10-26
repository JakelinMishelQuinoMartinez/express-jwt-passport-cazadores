# API de autenticación y cazadores

## Descripción

API REST desarrollada como práctica académica para demostrar autenticación con **Passport**, emisión y validación de **JWT**, autorización por rol y validación de datos. La temática representa un gremio de cazadores y una bóveda de recompensas.

> **Alcance de esta versión:** los usuarios de prueba y las recompensas se guardan en memoria. Los cambios de recompensas se pierden al reiniciar el servidor. Aunque el proyecto incluye un esquema de Mongoose, actualmente no se conecta a MongoDB.

## Stack tecnológico

- **Node.js** con módulos ES (`type: module`).
- **Express 5** para el servidor y las rutas HTTP.
- **Passport**, con estrategias `passport-local` y `passport-jwt`.
- **jsonwebtoken** para firmar JWT con HS256 y expiración de dos horas.
- **express-validator** para validar los cuerpos de las solicitudes.
- **CORS** para permitir solicitudes desde otros orígenes.
- **Mongoose**: esquema de cazador definido, aún no conectado a una base de datos.

## Requisitos e instalación

Se requiere Node.js compatible con Express 5 (Node.js 18 o posterior) y npm.

```bash
git clone <URL-del-repositorio>
cd express-jwt-passport-cazadores
npm install
npm run dev
```

El servidor queda disponible en `http://localhost:4000`. Se puede cambiar el puerto con la variable de entorno `PORT`.

Para detenerlo, usa `Ctrl+C`.

## Rutas disponibles

Todas las rutas de la API —excepto la comprobación de estado— usan el prefijo `/api/v1`.

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/health` | Público | Comprueba que el servidor está activo. |
| `POST` | `/api/v1/users/authenticate` | Público | Valida credenciales y devuelve un JWT. |
| `GET` | `/api/v1/user/list` | JWT | Devuelve la identidad del token y los perfiles de cazadores. |
| `POST` | `/api/v1/boveda/recompensa` | JWT de administrador | Registra una recompensa en memoria. |

Las solicitudes con cuerpo deben usar `Content-Type: application/json`. Las rutas protegidas requieren el encabezado:

```text
Authorization: Bearer <token>
```

### Usuarios de prueba

| Usuario | Contraseña | Rango | Administrador |
|---|---|---|---|
| `satinder` | `12345` | S | Sí |
| `kael` | `54321` | A | No |
| `nyx` | `99999` | A | No |

El usuario `satinder` es necesario para probar la ruta de creación de recompensas. Estas credenciales y la clave JWT predeterminada son únicamente para desarrollo y demostración; no deben usarse en producción.

## Pruebas desde la terminal con `curl`

Los siguientes ejemplos realizan el inicio de sesión y muestran cómo copiar el token de la respuesta para las solicitudes protegidas. Reemplaza `<TOKEN>` por el valor recibido en el campo `token`.

### Windows PowerShell

En PowerShell usa `curl.exe` para invocar `curl` y no el alias de PowerShell:

```powershell
curl.exe http://localhost:4000/health

curl.exe -X POST http://localhost:4000/api/v1/users/authenticate `
  -H "Content-Type: application/json" `
  -d '{"username":"satinder","password":"12345"}'

$TOKEN = "<TOKEN>"

curl.exe http://localhost:4000/api/v1/user/list `
  -H "Authorization: Bearer $TOKEN"

curl.exe -X POST http://localhost:4000/api/v1/boveda/recompensa `
  -H "Authorization: Bearer $TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"mision":"Caceria de prueba","cristales":250}'
```

### Linux (Bash)

```bash
curl http://localhost:4000/health

curl -X POST http://localhost:4000/api/v1/users/authenticate \
  -H 'Content-Type: application/json' \
  -d '{"username":"satinder","password":"12345"}'

TOKEN='<TOKEN>'

curl http://localhost:4000/api/v1/user/list \
  -H "Authorization: Bearer $TOKEN"

curl -X POST http://localhost:4000/api/v1/boveda/recompensa \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"mision":"Caceria de prueba","cristales":250}'
```

El cuerpo de una recompensa requiere `mision` (entre 3 y 80 caracteres) y `cristales` (entero entre 1 y 100000). Un token válido sin el permiso de administrador recibe `403`; sin token válido, las rutas protegidas responden `401`.

## Organización del proyecto

```text
src/
├── app.js                       # Configuración de Express, middleware y servidor
├── config/passport.js           # Estrategias Local y JWT
├── controllers/auth.controller.js # Controladores de autenticación y recompensas
├── dtos/cazador.dto.js          # Normalización de datos y perfiles de respuesta
├── middlewares/
│   ├── auth.middleware.js       # Autenticación JWT/Local y autorización admin
│   └── error.middleware.js      # Respuestas 404 y manejo de errores
├── models/cazador.model.js      # Esquema Mongoose y usuarios semilla
├── routes/auth.routes.js        # Definición de endpoints
├── services/cazador.service.js  # Lógica de cazadores, JWT y recompensas
└── validators/auth.validator.js # Validaciones de entrada
```

## Comandos disponibles

- `npm install`: instala las dependencias.
- `npm run dev`: inicia el servidor con Node.js.