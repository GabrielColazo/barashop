# BaraShop — Desarrollo técnico

## Stack

- **Frontend:** HTML + CSS (Bootstrap 5 + Sass) + JavaScript vanilla
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Hosting:** GitHub Pages (estáticos) + Supabase cloud
- **Repo:** https://github.com/GabrielColazo/barashop
- **URL:** https://gabrielcolazo.github.io/barashop/

## Supabase (gratis)

> ⚠️ Las claves reales están en `js/supabase.js`. Acá van solo placeholders por seguridad.

- **URL:** `YOUR_SUPABASE_URL`
- **Anon Key:** `YOUR_SUPABASE_ANON_KEY`
- **Storage bucket:** `imagenes` (público)
- **Auth providers:** Email/Contraseña, Google OAuth, Magic Link
- **Google OAuth:** Client ID configurado en Google Cloud Console + Supabase Providers
- **Magic Link:** `signInWithOtp` con `shouldCreateUser: true`, redirect a `auth-callback.html`
- **Redirect URLs:** `https://gabrielcolazo.github.io/barashop/**` (wildcard)

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
- `anuncios`: SELECT todos, INSERT autenticados (WITH CHECK usuario_id = auth.uid()), UPDATE/DELETE propietario
- `anuncio_imagenes`: SELECT todos, INSERT autenticados (WITH CHECK true), DELETE propietario

### CHECK constraints
- `anuncios_precio_check`: precio >= 0
- `anuncios_titulo_length`: char_length(titulo) BETWEEN 3 AND 120
- `anuncios_telefono_length`: char_length(telefono) BETWEEN 6 AND 30
- `anuncios_descripcion_length`: char_length(descripcion) <= 2000

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

- Logo: imagen `barashop.webp` en header
- Hero: gradiente verde clarito (#D1FAE5 → #FAFAFA), título "BaraShop" con "Shop" en verde #059669
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
- Google OAuth: Client ID y Secret configurados en Supabase (Google Cloud Console → credentials → Web App)
- Magic Link: `signInWithOtp` con `shouldCreateUser: true`, redirect a `publicar.html`
- Google OAuth callback URL: `https://{project}.supabase.co/auth/v1/callback`
- Redirect URLs en Supabase: `https://gabrielcolazo.github.io/barashop/**`
- RLS: reemplazado `auth.role()` deprecado por `TO authenticated` + `WITH CHECK (usuario_id = auth.uid())` en políticas INSERT
- Traducción de errores Supabase en `login.html`: "Invalid login credentials", "Email not confirmed", "User already registered" → mensajes claros en español
- Skeleton loader: 6 cards animadas con pulse mientras cargan anuncios en index.html
- **Rebranding Barago → BaraShop** (jul 2026): rename completo por conflicto con "BaraderoGo", un comercio local de Baradero cuyo nombre generaba riesgo de confusión con "Barago". Cambios realizados:
  - Hero: `Bara<span class="hero-go">Go</span>` → `Bara<span class="hero-shop">Shop</span>` (misma lógica visual, "Shop" en verde #059669)
  - Clase CSS `.hero-go` renombrada a `.hero-shop` en `main.css` y `_layout.scss`
  - Logo: reemplazado `barago.webp` por `barashop.webp` en header de las 5 páginas HTML
  - Titles de página y alt de logo actualizados en todos los HTML
  - Footer: marca y copyright actualizados en todas las páginas
  - `auth-callback.html`: título, "Bienvenido a BaraShop", fallback link `/barashop/publicar.html`
  - `js/auth.js`: `AUTH_REDIRECT` actualizado a `https://gabrielcolazo.github.io/barashop/auth-callback.html`
  - `README.md` y `docs/DESARROLLO.md`: todas las referencias, URLs y estructura de archivos actualizadas
  - Repositorio GitHub renombrado de `barago` a `barashop`
  - Redirect URLs en Supabase actualizadas a `https://gabrielcolazo.github.io/barashop/**`

## Auth

### Métodos disponibles (login.html)

| Método | Función | Redirect | Estado |
|--------|---------|----------|-------|
| Email + contraseña | `iniciarSesion()` / `registrar()` | `auth-callback.html` (emailRedirectTo) | ✅ Funciona |
| Google | OAuth redirect (`signInWithOAuth`) | `auth-callback.html` | ✅ Funciona, muestra `supabase.co` |
| Magic Link | `enviarMagicLink()` → `signInWithOtp` | `auth-callback.html` | ⏳ Pendiente CNAME en DonWeb |

### Auth redirect flow

1. Todos los métodos de auth usan `AUTH_REDIRECT = 'https://gabrielcolazo.github.io/barashop/auth-callback.html'`
2. `auth-callback.html` recibe el redirect de Supabase, parsea la URL buscando errores
3. Si hay error (`error`, `error_description` en query string o hash) → lo muestra en pantalla sin redirigir
4. Si no hay error → llama `getSession()`, si hay sesión redirige a `publicar.html`
5. Si no hay sesión → se suscribe a `onAuthStateChange` y redirige en `SIGNED_IN`
6. Timeout de seguridad de 8s (cancelable si ya se redirigió por los pasos anteriores)

### Google — implementación

- Se usa `sb.auth.signInWithOAuth({ provider: 'google' })` con redirect a `auth-callback.html`
- Google muestra `supabase.co` en el consent screen (normal al usar OAuth externo)
- Para mostrar dominio propio se necesita flujo PKCE manual (pendiente)

### Google Cloud Console — credenciales

- **Client ID / Secret:** en Google Cloud Console (no documentados por seguridad)
- **Authorized redirect URIs:** `https://mqyefceumiesjelorjbm.supabase.co/auth/v1/callback`

## Diseño — cambios recientes

- **Footer:** fondo `#F0FDF4`, borde superior con gradiente animado (verde → ámbar), fade-in al cargar, subrayado animado en link GaboWeb
- **login.html:** botón "Ingresar con Google" con ícono G estilizado, separador "o", link "Enviar link mágico"
- **auth.js:** funciones `iniciarSesionGoogle()` (fallback OAuth), `enviarMagicLink()`, constante `AUTH_REDIRECT`
- **Responsive design (mobile-first):** jul 2026
  - Logo responsive: 40px mobile / 48px tablet / 56px desktop
  - Hero: padding y títulos escalan con `min-width` (576px y 992px)
  - Grid de anuncios: `minmax(160px, 1fr)` mobile → `220px` tablet → `270px` desktop
  - Detalle anuncio: header en columna en mobile, fila en tablet+
  - Imagen de detalle: `max-height: 280px` mobile, `450px` desktop
  - Gallery thumbs: 56px mobile / 64px tablet / 72px desktop
  - Auth card: padding 1.5rem mobile / 2.25rem desktop
  - Footer: padding y margin-top reducidos en mobile
- **Logo:** reemplazado `barashop.webp` por nueva versión con fondo `#F8FDFA` (match con header)
- **mix-blend-mode:** eliminado `multiply` del logo para evitar distorsión de color
- **Sección "Mis Avisos":** jul 2026
  - Nueva página `mis-avisos.html` que lista los anuncios del usuario autenticado
  - Menú de usuario actualizado en todas las páginas con link a "Mis Avisos"
  - Cada aviso tiene botones "Editar" y "Eliminar"
  - `publicar.html` modificado para aceptar `?editar=id` y editar anuncios existentes
  - Nuevas funciones en `anuncios.js`: `obtenerMisAnuncios()`, `actualizarAnuncio()`, `eliminarImagenesAnuncio()`
  - Nuevos estilos: `.mis-aviso-card`, `.btn-sm-edit`, `.btn-sm-delete`
- **Imagen detalle anuncio reducida:** 200px mobile / 260px tablet / 300px desktop
- **Subir hasta 2 imágenes con compresión:** jul 2026
  - Input file con `multiple`, máximo 2 fotos
  - Compresión automática vía canvas (1600px máx, JPEG 0.8) si pesa >1MB
  - Rechazo si tras compresión sigue >5MB
  - Preview por imagen con botón × individual
  - Modo edición respeta fotos existentes + nuevas ≤ 2
- **Storage cleanup:** jul 2026
  - Nueva función `eliminarArchivosStorage()` que borra archivos del bucket al eliminar anuncio o editar fotos
  - Se integra en `eliminarAnuncio()` y `eliminarImagenesAnuncio()`
- **Vigencia de anuncios (7 días):** jul 2026
  - Badge "Vence en X días" en detalle del anuncio (anuncio.html)
  - Indicador compacto "Xd" en cada tarjeta del listado (index.html)
  - Color gris (>2 días), naranja (≤2 días) o gris apagado (vencido)
- **Limpieza automática via GitHub Actions:** jul 2026
  - Script Node.js `scripts/limpiar-vencidos/index.js` con service_role key
  - Workflow diario 11:00 UTC (08:00 ARG) + disparo manual
  - Borra anuncios con created_at < 7 días + sus imágenes del storage

## Pendientes

- [ ] Probar registro completo (crear usuario, confirmar email, publicar)
- [ ] Configurar SMTP en Supabase con `contacto@gaboweb.com.ar` (DonWeb)
- [ ] SITE_URL y Redirect URLs en Supabase Auth ya configurados para GitHub Pages
- [ ] (Opcional) Login con Google
- [ ] (Opcional) Hostear en DonWeb

## Estructura de archivos

```
barashop/
├── .nojekyll                 # Desactiva Jekyll en GitHub Pages
├── README.md                 # Presentación pública del proyecto
├── index.html                # Home con listado de anuncios
├── login.html                # Login/Registro con email
├── publicar.html             # Publicar anuncio (registro inline)
├── anuncio.html              # Detalle del anuncio con galería
├── auth-callback.html         # Callback OAuth (reserva para PKCE)
├── schema.sql                # SQL completo de la DB (fuente única)
├── migraciones_aplicadas/    # Migraciones históricas (referencia)
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
│       ├── barashop.webp        # Logo
│       └── no-image.svg
├── .gitignore
├── mis-avisos.html            # Listado de mis anuncios (editar/eliminar)
├── .github/
│   └── workflows/
│       └── limpiar-vencidos.yml  # Daily cleanup de anuncios vencidos
├── scripts/
│   └── limpiar-vencidos/
│       ├── index.js           # Script de limpieza (Node.js)
│       └── package.json
└── docs/
    └── README.md             # (este archivo)
```
