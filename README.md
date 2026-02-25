# Gestión de Productos - API REST

Aplicación web para la gestión de productos con sistema de autenticación JWT.

## Características

- CRUD de productos
- Registro e inicio de sesión de usuarios
- Autenticación mediante JWT
- Interfaz web para login y gestión de productos
- Pruebas unitarias con Jest
- CI/CD con GitHub Actions
- Despliegue en Vercel

## Tecnologías

- Node.js
- Express.js
- MongoDB / Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Jest

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env` con las siguientes variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/productos_db
JWT_SECRET=tu_clave_secreta
JWT_EXPIRE=24h
```

## Ejecución

```bash
npm run dev
```

## API Endpoints

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/logout | Cerrar sesión |
| GET | /api/auth/me | Obtener usuario actual |

### Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/products | Listar productos |
| GET | /api/products/:id | Ver producto |
| POST | /api/products | Crear producto |
| PUT | /api/products/:id | Actualizar producto |
| DELETE | /api/products/:id | Eliminar producto |

## Pruebas

```bash
npm test
```

## Despliegue

El proyecto está configurado para desplegarse automáticamente en Vercel mediante GitHub Actions.

### Variables de entorno en Vercel

- `MONGODB_URI`: URI de MongoDB Atlas
- `JWT_SECRET`: Clave secreta para JWT
- `JWT_EXPIRE`: Tiempo de expiración del token
