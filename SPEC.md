# Especificación del Proyecto: Gestión de Productos con Autenticación JWT

## 1. Requerimientos Funcionales

### 1.1 Gestión de Usuarios
- **Registro de usuarios**: Los usuarios deben poder registrarse proporcionando username, email y password.
- **Inicio de sesión**: Los usuarios autenticados pueden iniciar sesión con email y password.
- **Cierre de sesión**: Los usuarios pueden cerrar sesión invalidando su token JWT.
- **Protección de contraseña**: Las contraseñas deben ser hasheadas usando bcrypt antes de almacenarse.

### 1.2 Gestión de Productos (CRUD)
- **Crear producto**: Los usuarios autenticados pueden crear nuevos productos.
- **Leer productos**: 
  - Listar todos los productos (protegido)
  - Ver un producto específico por ID (protegido)
- **Actualizar producto**: Los usuarios autenticados pueden modificar productos existentes.
- **Eliminar producto**: Los usuarios autenticados pueden eliminar productos.

### 1.3 Autenticación y Autorización
- **JWT**: Uso de JSON Web Tokens para autenticar requests.
- **Rutas protegidas**: Solo usuarios con token válido pueden acceder a rutas de productos.
- **Middleware de autenticación**: Verificación de token en cada request protegido.

### 1.4 Interfaz de Usuario
- **Página de login**: Vista estática HTML para autenticación de usuarios.
- **Formulario de login**: Campos para email y password.

---

## 2. Requerimientos No Funcionales

### 2.1 Rendimiento
- Tiempo de respuesta máximo: 200ms para operaciones CRUD básicas.
- Soporte para múltiples solicitudes concurrentes.

### 2.2 Seguridad
- Contraseñas hasheadas con bcrypt (salt de 10 rounds).
- Tokens JWT con expiración configurada (24h por defecto).
- Validación de datos de entrada en registro y login.
- Manejo de errores sin exponer información sensible.

### 2.3 Escalabilidad
- Arquitectura modular (modelos, controladores, rutas, middlewares).
- Código limpio y mantenible.

### 2.4 Tecnologías
- **Backend**: Node.js, Express.js
- **Base de datos**: MongoDB con Mongoose
- **Autenticación**: JWT (jsonwebtoken)
- **Testing**: Jest
- **Despliegue**: GitHub Actions, Vercel

---

## 3. Estructura de la API

### 3.1 Endpoints de Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /api/auth/register | Registrar nuevo usuario | No |
| POST | /api/auth/login | Iniciar sesión | No |
| POST | /api/auth/logout | Cerrar sesión | Sí |

### 3.2 Endpoints de Productos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | /api/products | Listar todos los productos | Sí |
| GET | /api/products/:id | Ver producto por ID | Sí |
| POST | /api/products | Crear producto | Sí |
| PUT | /api/products/:id | Actualizar producto | Sí |
| DELETE | /api/products/:id | Eliminar producto | Sí |

---

## 4. Modelos de Datos

### 4.1 Usuario (User)
```javascript
{
  username: String (requerido, único),
  email: String (requerido, único),
  password: String (requerido, hasheado),
  createdAt: Date
}
```

### 4.2 Producto (Product)
```javascript
{
  name: String (requerido),
  description: String,
  price: Number (requerido, mínimo 0),
  category: String,
  stock: Number (mínimo 0),
  user: ObjectId (referencia a User),
  createdAt: Date
}
```

---

## 5. Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Request exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error |

---

## 6. Configuración de Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| PORT | Puerto del servidor | 3000 |
| MONGODB_URI | URI de conexión MongoDB | mongodb://localhost:27017/productos_db |
| JWT_SECRET | Clave secreta para JWT | secret_key_default |
| JWT_EXPIRE | Tiempo de expiración del token | 24h |

---

## 7. Pruebas Unitarias

### 7.1 Coverage Requerido
- Controladores de autenticación (register, login)
- Controladores de productos (CRUD)
- Middleware de autenticación JWT

### 7.2 Casos de Prueba
- Registro exitoso de usuario
- Registro con email duplicado
- Login con credenciales correctas
- Login con credenciales incorrectas
- Crear producto autenticado
- Crear producto sin autenticación
- Listar productos
- Actualizar producto
- Eliminar producto

---

## 8. Despliegue

### 8.1 GitHub Actions
- Pipeline CI/CD para ejecutar pruebas en cada push.
- Ejecución de lint y pruebas unitarias.

### 8.2 Vercel
- Despliegue automático desde rama main.
- Configuración de variables de entorno en dashboard de Vercel.
