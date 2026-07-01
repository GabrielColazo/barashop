# Barago — Clasificados Local

## Stack

- **Frontend:** HTML + CSS (Bootstrap 5 + Sass) + JavaScript vanilla
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Hosting:** GitHub Pages (estáticos) + Supabase cloud
- **Repo:** https://github.com/GabrielColazo/barago
- **URL:** https://gabrielcolazo.github.io/barago/

## Supabase (gratis)

- **URL:** https://mqyefceumiesjelorjbm.supabase.co
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xeWVmY2V1bWllc2plbG9yamJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NzA1NDYsImV4cCI6MjA5ODQ0NjU0Nn0._1pMQ9_zyoE7sD-EM8Uuu7CKpdAJX1QLlkLJQiCD2n0`
- **Storage bucket:** `imagenes` (público)

## Base de datos

### Tabla `categorias`
| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID | PK, default gen_random_uuid() |
| nombre | TEXT | NOT NULL |
| icono | TEXT | NOT NULL, emoji |
| created_at | TIMESTAMPTZ | default now() |

10 categorías precargadas: Vehículos, Inmuebles, Electrónica, Muebles, Ropa, Deportes, Mascotas, Servicios, Empleos, Otros.

### Tabla `anuncios`
| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID | PK |
| titulo | TEXT | NOT NULL |
| descripcion | TEXT | |
| precio | NUMERIC(10,2) | |
| telefono | TEXT | NOT NULL, obligatorio |
| categoria_id | UUID | FK → categorias(id) |
| usuario_id | UUID | FK → auth.users(id) |
| created_at | TIMESTAMPTZ | |

### Tabla `anuncio_imagenes`
| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID | PK |
| anuncio_id | UUID | FK → anuncios(id), CASCADE |
| url | TEXT | NOT NULL |
| orden | INT | 0,1,2... |
| created_at | TIMESTAMPTZ | |

### RLS Policies activas
- `categorias`: SELECT para todos
- `anuncios`: SELECT todos, INSERT autenticados, UPDATE/DELETE propietario
- `anuncio_imagenes`: SELECT todos, INSERT autenticados, DELETE propietario

## Skills instalados (skills.sh)

- `frontend-design` (anthropics/skills)
- `supabase` (supabase/agent-skills)
- `supabase-postgres-best-practices` (supabase/agent-skills)

## Límites de imágenes

| Concepto | Límite |
|----------|--------|
| Fotos por anuncio | 3 |
| Peso máximo por foto | 5MB |
| Formatos | JPG, PNG, WEBP |

## Flujo de publicación

1. Usuario completa: título, precio, teléfono, foto (opcional), descripción (opcional)
2. Si no está registrado → completa email + contraseña en la misma página
3. Toca "Registrarse" (si es nuevo) o directamente "Publicar" (si ya está logueado)
4. Se registra y publica en el mismo paso

## Diseño

- Logo: imagen `barago.webp` en header
- Hero: gradiente verde clarito (#D1FAE5 → #FAFAFA), título "BaraGo" con "Go" en verde #059669
- Header: fondo verde clarísimo (#F8FDFA), borde inferior verde tenue
- Tipografía: Inter (Google Fonts)
- Colores principales: #059669 (verde), #F59E0B (acento)

## Correcciones aplicadas

- Bug crítico: `eliminarAnuncio()` recursivo en `anuncio.html` (stack overflow) — corregido
- Feedback post-publicación: banner verde al volver a `index.html?publicado=1`
- Sanitización XSS: `escapeHtml()` en `index.html` y `anuncio.html`
- CSS compilado en formato `expanded` (legible) para GitHub Pages
- CSP headers agregados a todas las páginas
- Sanitización XSS completa (escapeHtml en todos los templates)

## Pendientes

- [ ] Probar registro (confirmar usuario manual en Supabase o desactivar Confirm email)
- [ ] Configurar SITE_URL y Redirect URLs en Supabase Auth para GitHub Pages
- [ ] (Opcional) Login con Google

## Estructura de archivos

```
barago/
├── index.html                # Home con listado de anuncios
├── login.html                # Login/Registro con email
├── publicar.html             # Publicar anuncio (registro inline)
├── anuncio.html              # Detalle del anuncio con galería
├── schema.sql                # SQL completo de la DB
├── migracion_imagenes.sql    # Migración tabla anuncio_imagenes
├── migracion_telefono.sql    # Migración columna telefono
├── css/
│   ├── main.scss
│   ├── main.css              # Compilado (expandido)
│   └── partials/
│       ├── _variables.scss
│       ├── _base.scss
│       ├── _layout.scss
│       ├── _components.scss
│       ├── _auth.scss
│       └── _anuncios.scss
├── js/
│   ├── supabase.js           # Config conexión
│   ├── auth.js               # Auth functions
│   └── anuncios.js           # CRUD anuncios + imágenes
├── assets/
│   └── img/
│       ├── barago.webp        # Logo
│       └── no-image.svg
├── .gitignore
└── docs/
    └── README.md             # (este archivo)
```
