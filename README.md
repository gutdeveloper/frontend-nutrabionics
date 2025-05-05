# Nutrabionics - Gestión de Productos

Un panel de administración completo desarrollado con React para la gestión de productos con autenticación, roles de usuario y funcionalidades de CRUD.

## 📋 Características

- **Autenticación y Autorización**
  - Sistema de login/registro con validación
  - Roles de usuario (admin/usuario estándar)
  - Rutas protegidas en función del rol
  - Persistencia de sesión

- **Gestión de Productos**
  - Listado paginado de productos
  - Visualización detallada con información completa
  - Creación de nuevos productos
  - Edición de productos existentes
  - Eliminación de productos
  - Referencias y slugs de producto

## 🚀 Instalación y Uso

### Prerequisitos

- Node.js >= 18.x
- npm >= 9.x

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/gutdeveloper/frontend-nutrabionics.git
   cd react-nutrabionics
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp env.example .env
   ```
   
   Edita el archivo `.env` con tus propias configuraciones.

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre tu navegador en `http://localhost:5174`

## 🏗️ Estructura del Proyecto

```
react-nutrabionics/
├── src/                    # Código fuente
│   ├── assets/             # Recursos estáticos (imágenes, etc.)
│   ├── components/         # Componentes React
│   │   ├── atoms/          # Componentes básicos (Button, Input, etc.)
│   │   └── molecules/      # Componentes compuestos
│   ├── context/            # Contextos de React (Auth, Toast)
│   ├── layouts/            # Componentes de layout
│   ├── lib/                # Funciones utilitarias
│   ├── pages/              # Componentes de página
│   ├── schemas/            # Esquemas de validación Zod
│   ├── services/           # Servicios de API
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── public/                 # Archivos públicos
└── ...
```

## 🔐 Autenticación y Seguridad

El sistema cuenta con autenticación basada en roles:
- **Usuarios estándar**: Acceso al dashboard personal
- **Administradores**: Acceso completo a la gestión de productos

Las rutas protegidas verifican los permisos del usuario antes de renderizar el contenido.
