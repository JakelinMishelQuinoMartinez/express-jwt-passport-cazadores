# API de autenticación y cazadores

## Descripción

API REST desarrollada como práctica académica para demostrar autenticación con **Passport**, emisión y validación de **JWT**, autorización por rol y validación de datos. La temática representa un gremio de cazadores y una bóveda de recompensas.

Los cazadores y las recompensas se almacenan en MySQL. Al iniciar, la API crea las tablas necesarias e inserta los usuarios de prueba que aún no existan.

## Stack tecnológico

- **Node.js** con módulos ES (`type: module`).
- **Express 5** para el servidor y las rutas HTTP.
- **Passport**, con estrategias `passport-local` y `passport-jwt`.
- **jsonwebtoken** para firmar JWT con HS256 y expiración de dos horas.
- **express-validator** para validar los cuerpos de las solicitudes.
- **CORS** para permitir solicitudes desde otros orígenes.
- **mysql2**: conexión y consultas parametrizadas a MySQL.

## Requisitos e instalación

Se requiere Node.js compatible con Express 5 (Node.js 18 o posterior), npm y un servidor MySQL.

```bash
git clone <URL-del-repositorio>
cd express-jwt-passport-cazadores
npm install
```

### Configurar la base de datos

Crea la base de datos MySQL si todavía no existe:

```sql
CREATE DATABASE cazadores CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

En la raíz del proyecto, copia `.env.example` como `.env` y actualiza sus valores según tu instalación:

```powershell
Copy-Item .env.example .env
```

En Linux o macOS, usa `cp .env.example .env`.

El archivo contiene estas variables:

| Variable | Descripción |
|---|---|
| `DB_HOST` | Host del servidor MySQL. |
| `DB_PORT` | Puerto de MySQL. |
| `DB_USER` | Usuario de MySQL. |
| `DB_PASSWORD` | Contraseña de MySQL. |
| `DB_DATABASE` | Base de datos que usará la API. |

No compartas ni subas `.env` al repositorio; úsalo para tus credenciales locales. La API carga ese archivo al iniciar y no inicia si no puede conectarse a MySQL. Las tablas `cazadores` y `recompensas` se crean automáticamente; los cazadores de prueba se insertan únicamente si no existen, por lo que sus cambios en la base de datos no se sobrescriben al reiniciar.

### Iniciar el servidor

Con MySQL ejecutándose y `.env` configurado, inicia la API:

```bash
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
| `POST` | `/api/v1/boveda/recompensa` | JWT de administrador | Registra una recompensa en MySQL. |

Las solicitudes con cuerpo deben usar `Content-Type: application/json`. Las rutas protegidas requieren un token JWT:

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

## Pruebas de los endpoints

Con el servidor iniciado, comprueba primero el estado de la API y luego autentícate. Usa el token devuelto en las dos rutas protegidas.

### Windows PowerShell

```powershell
Invoke-RestMethod http://localhost:4000/health

$login = Invoke-RestMethod `
  -Uri http://localhost:4000/api/v1/users/authenticate `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{ username = "satinder"; password = "12345" } | ConvertTo-Json)

$TOKEN = $login.token

Invoke-RestMethod `
  -Uri http://localhost:4000/api/v1/user/list `
  -Headers @{ Authorization = "Bearer $TOKEN" }

Invoke-RestMethod `
  -Uri http://localhost:4000/api/v1/boveda/recompensa `
  -Method Post `
  -Headers @{ Authorization = "Bearer $TOKEN" } `
  -ContentType "application/json" `
  -Body (@{ mision = "Caceria de prueba"; cristales = 250 } | ConvertTo-Json)
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
├── app.js                       # Configuración de Express, middleware e inicio
├── config/database.js           # Pool MySQL, tablas e inicialización de semillas
├── config/passport.js           # Estrategias Local y JWT
├── controllers/auth.controller.js # Controladores de autenticación y recompensas
├── dtos/cazador.dto.js          # Normalización de datos y perfiles de respuesta
├── middlewares/
│   ├── auth.middleware.js       # Autenticación JWT/Local y autorización admin
│   └── error.middleware.js      # Respuestas 404 y manejo de errores
├── models/cazador.model.js      # Datos semilla de los cazadores
├── routes/auth.routes.js        # Definición de endpoints
├── services/cazador.service.js  # Lógica de cazadores, JWT y recompensas
└── validators/auth.validator.js # Validaciones de entrada
```

## Comandos disponibles

- `npm install`: instala las dependencias.
- `npm run dev`: inicia el servidor con Node.js.