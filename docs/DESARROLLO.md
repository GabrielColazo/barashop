# Barago — Desarrollo técnico

## Stack

- **Frontend:** HTML + CSS (Bootstrap 5 + Sass) + JavaScript vanilla
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Hosting:** GitHub Pages (estáticos) + Supabase cloud
- **Repo:** https://github.com/GabrielColazo/barago
- **URL:** https://gabrielcolazo.github.io/barago/

## Supabase (gratis)

> ⚠️ Las claves reales están en `js/supabase.js`. Acá van solo placeholders por seguridad.

- **URL:** `YOUR_SUPABASE_URL`
- **Anon Key:** `YOUR_SUPABASE_ANON_KEY`
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
2. Si no está registrado → completa email + contraseña en PASO 1
3. Toca "Registrarse" → se crea la cuenta y se envía email de confirmación
4. Luego de confirmar email, puede ingresar desde `login.html` y publicar
5. Si ya está logueado, publica directo

## CSP (Content Security Policy)

```
default-src 'self' https://*.supabase.co https://cdn.jsdelivr.net
img-src 'self' https: data: blob:
style-src 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com 'unsafe-inline'
script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'
font-src 'self' https://fonts.gstatic.com
connect-src 'self' https://*.supabase.co https://cdn.jsdelivr.net
```

## Diseño

- Logo: imagen `barago.webp` en header
- Hero: gradiente verde clarito (#D1FAE5 → #FAFAFA), título "BaraGo" con "Go" en verde #059669
- Header: fondo verde clarísimo (#F8FDFA), borde inferior verde tenue
- Footer: fondo verde clarito (#F0FDF4), barra animada degradé en el borde superior (verde + ámbar), link a GaboWeb
- Tipografía: Inter (Google Fonts)
- Colores principales: #059669 (verde), #F59E0B (acento)

## Correcciones aplicadas

- Bug crítico: `eliminarAnuncio()` recursivo en `anuncio.html` (stack overflow) — corregido
- Feedback post-publicación: banner verde al volver a `index.html?publicado=1`
- Sanitización XSS: `escapeHtml()` en `index.html` y `anuncio.html`
- CSS compilado en formato `expanded` (legible) para GitHub Pages
- CSP headers agregados a todas las páginas
- Sanitización XSS completa (escapeHtml en todos los templates)
- Constraints en DB: precio >= 0, título 3-120 chars, teléfono 6-30 chars, descripción <= 2000 chars
- Storage RLS: solo autenticados pueden subir, validación de tipo MIME y tamaño
- Longitud máxima en inputs del formulario de publicación
- Validación de precio > 0 y título >= 3 caracteres
- Registro inline: no intenta login inmediato, pide confirmar email
- CSP: agregado fonts.googleapis.com a style-src, unsafe-inline a script-src, cdn.jsdelivr.net a connect-src
- Menú de usuario con "Cerrar sesión" en index.html, anuncio.html y publicar.html
- `.nojekyll` agregado para GitHub Pages

## Issues conocidos

- GitHub Pages falla con "Node.js 20 is deprecated" (error de GitHub, temporal)
- Email de confirmación de Supabase con SendGrid SMTP funcionando (requiere CNAME en DonWeb para evitar spam/greylisting)

## Pendientes

- [ ] Probar registro completo (crear usuario, confirmar email, publicar)
- [ ] Configurar SMTP en Supabase con `contacto@gaboweb.com.ar` (DonWeb)
- [ ] SITE_URL y Redirect URLs en Supabase Auth ya configurados para GitHub Pages
- [ ] (Opcional) Login con Google
- [ ] (Opcional) Hostear en DonWeb

## Estructura de archivos

```
barago/
├── .nojekyll                 # Desactiva Jekyll en GitHub Pages
├── README.md                 # Presentación pública del proyecto
├── index.html                # Home con listado de anuncios
├── login.html                # Login/Registro con email
├── publicar.html             # Publicar anuncio (registro inline)
├── anuncio.html              # Detalle del anuncio con galería
├── schema.sql                # SQL completo de la DB
├── migracion_imagenes.sql    # Migración tabla anuncio_imagenes
├── migracion_telefono.sql    # Migración columna telefono
├── migracion_seguridad.sql   # Constraints + Storage RLS
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
