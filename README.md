# Baluu Store - Tienda Online con Pedidos Personalizados

Baluu Store es una aplicación web completa de comercio electrónico construida con la arquitectura **MERN Stack** (MongoDB, Express.js, React, Node.js) que se especializa en productos personalizados y pedidos únicos.

## 🚀 Características Principales

### Frontend (React + TypeScript)
- ✅ Catálogo de productos con filtros avanzados
- ✅ Sistema de pedidos personalizados con formularios dinámicos
- ✅ Integración con Stripe para procesamiento de pagos
- ✅ Seguimiento de pedidos en tiempo real
- ✅ Panel de administración completo
- ✅ Diseño responsive con Tailwind CSS
- ✅ Gestión de estado con Zustand
- ✅ Notificaciones toast

### Backend (Node.js + Express)
- ✅ API RESTful completa
- ✅ Autenticación JWT
- ✅ Base de datos MongoDB con Mongoose
- ✅ Procesamiento de pagos con Stripe
- ✅ Subida de archivos con Multer
- ✅ Middleware de seguridad
- ✅ Rate limiting
- ✅ Validación de datos

### Funcionalidades Específicas
- 🎨 **Productos Personalizables**: Materiales, tamaños, colores, texto personalizado
- 📦 **Gestión de Órdenes**: Estados, seguimiento, timeline
- 💳 **Pagos Seguros**: Integración completa con Stripe
- 📊 **Dashboard Admin**: Estadísticas, reportes, gestión de usuarios
- 📧 **Notificaciones**: Email automático para actualizaciones
- 🔐 **Seguridad**: Encriptación, validación, protección CORS

## 📁 Estructura del Proyecto

```
baluu/
├── package.json (scripts principales)
├── backend/
│   ├── server.js (servidor principal)
│   ├── models/ (esquemas MongoDB)
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/ (endpoints API)
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── controllers/
│   └── uploads/
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   ├── products/
    │   │   └── orders/
    │   ├── pages/
    │   ├── services/ (API calls)
    │   ├── store/ (Zustand stores)
    │   ├── types/ (TypeScript definitions)
    │   └── utils/
    └── public/
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- Cuenta de Stripe (para pagos)
- Git

### 1. Clonar el Repositorio
```bash
git clone <tu-repositorio>
cd baluu
```

### 2. Instalar Dependencias
```bash
# Instalar dependencias del proyecto principal
npm install

# Instalar dependencias del backend
npm run install-server

# Instalar dependencias del frontend
npm run install-client
```

### 3. Configuración del Backend

#### Crear archivo de variables de entorno
```bash
cd backend
cp .env.example .env
```

#### Configurar variables de entorno (backend/.env)
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/baluu

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRE=7d

# Servidor
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_tu_stripe_secret_key_aqui
STRIPE_PUBLISHABLE_KEY=pk_test_tu_stripe_publishable_key_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_aqui
```

### 4. Configuración del Frontend

#### Crear archivo de variables de entorno
```bash
cd frontend
touch .env
```

#### Configurar variables de entorno (frontend/.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_tu_stripe_publishable_key_aqui
```

### 5. Configurar MongoDB

#### Opción A: MongoDB Local
1. Instala MongoDB Community Edition
2. Inicia el servicio de MongoDB
3. La URI por defecto ya está configurada

#### Opción B: MongoDB Atlas (Recomendado)
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un nuevo cluster
3. Obtén tu connection string
4. Actualiza `MONGODB_URI` en el archivo .env

### 6. Configurar Stripe

1. Crea una cuenta en [Stripe](https://stripe.com)
2. Ve a Developers > API Keys
3. Copia las claves de test
4. Actualiza las variables de Stripe en los archivos .env

## 🚀 Ejecutar la Aplicación

### Desarrollo (Modo Completo)
```bash
# Desde la raíz del proyecto
npm run dev
```
Esto iniciará:
- Backend en http://localhost:5000
- Frontend en http://localhost:3000

### Desarrollo (Por Separado)

#### Solo Backend
```bash
npm run server
# o
cd backend && npm run dev
```

#### Solo Frontend
```bash
npm run client
# o
cd frontend && npm start
```

## 📱 Uso de la Aplicación

### Para Clientes
1. **Navegar Productos**: Explora el catálogo de productos disponibles
2. **Ver Muestras**: Revisa ejemplos de trabajos anteriores
3. **Pedido Personalizado**: 
   - Selecciona un producto base
   - Personaliza materiales, tamaños, colores
   - Agrega instrucciones especiales
   - Completa información de contacto
4. **Pago**: Realiza el pago seguro con Stripe
5. **Seguimiento**: Rastrea tu pedido con el número de orden

### Para Administradores
1. **Dashboard**: Ve estadísticas de ventas y órdenes
2. **Gestión de Productos**: Crear, editar, eliminar productos
3. **Gestión de Órdenes**: Actualizar estados, agregar tracking
4. **Gestión de Usuarios**: Administrar clientes y permisos
5. **Reportes**: Generar reportes de ventas por periodo

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/:id` - Actualizar producto (Admin)

### Órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/:orderNumber` - Obtener orden
- `GET /api/orders` - Listar órdenes (Admin)
- `PUT /api/orders/:id/status` - Actualizar estado (Admin)

### Pagos
- `POST /api/payments/create-intent` - Crear Payment Intent
- `POST /api/payments/confirm` - Confirmar pago
- `POST /api/payments/webhook` - Webhook de Stripe

## 🔐 Configuración de Seguridad

### Variables de Entorno Seguras
- Usa contraseñas fuertes para JWT_SECRET
- Configura MongoDB con autenticación
- Usa HTTPS en producción

### Configuración de Stripe
1. Configura webhooks en el dashboard de Stripe
2. Endpoint: `https://tu-dominio.com/api/payments/webhook`
3. Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`

## 📊 Base de Datos

### Modelos Principales

#### Usuario (User)
```javascript
{
  name: String,
  email: String (único),
  password: String (encriptado),
  role: 'customer' | 'admin',
  address: Object,
  preferences: Object
}
```

#### Producto (Product)
```javascript
{
  name: String,
  description: String,
  category: 'muestra' | 'personalizado' | 'popular',
  basePrice: Number,
  images: [Object],
  materials: [Object],
  sizes: [Object],
  customizationOptions: [Object]
}
```

#### Orden (Order)
```javascript
{
  orderNumber: String (único),
  customer: Object,
  items: [Object],
  total: Number,
  status: 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered',
  paymentStatus: 'pending' | 'paid' | 'failed',
  timeline: [Object]
}
```

## 🚀 Despliegue en Producción

### Backend (Node.js)
Recomendado: Railway, Render, DigitalOcean, AWS

```bash
# Construir para producción
cd backend
npm install --production
```

### Frontend (React)
Recomendado: Netlify, Vercel, Cloudflare Pages

```bash
# Construir para producción
cd frontend
npm run build
```

### Variables de Entorno en Producción
- Actualiza todas las URLs a las de producción
- Usa claves de Stripe en vivo
- Configura MongoDB Atlas
- Habilita HTTPS

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ve el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema
4. Incluye logs de error y pasos para reproducir

## 🔄 Próximas Características

- [ ] Chat en vivo para soporte
- [ ] Sistema de reviews y calificaciones
- [ ] Integración con WhatsApp
- [ ] App móvil con React Native
- [ ] Sistema de cupones y descuentos
- [ ] Integración con redes sociales
- [ ] Análisis avanzado con Google Analytics

---

**Desarrollado con ❤️ para Baluu Store**
