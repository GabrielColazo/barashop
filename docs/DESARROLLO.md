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
- Header: fondo blanco semitransparente (rgba 255,255,255,0.97), backdrop-filter blur, borde inferior gris suave, shadow sutil. Botón "Publicar" con clase `.btn-publicar` (verde, compacto, SVG plus). Dropdown de usuario animado (fadeDown).
- Hero: compacto (padding 1.5rem), fondo gradiente verde (#D1FAE5 → #A7F3D0 → #FAFAFA), título chico 1.15rem, barra de búsqueda redonda con lupa SVG integrada (`.hero-search`). Foto de fondo `imagenbaradero.webp` vía pseudo-elemento `::before` con overlay gradiente semitransparente (opacidad 0.75–0.85), fallback al gradiente si no carga la imagen. Mobile: background-position center 30%.
- Categorías: chips con `flex-wrap` (`.categorias-scroll`), outline white, active verde sólido. Todas visibles de una, sin scroll horizontal.
- Cards (`.card-anuncio`): 1:1 aspect ratio, imagen cover, pill de categoría overlay posicionado arriba-izquierda (`.card-img-wrap .badge-categoria`), precio como tag naranja (#EA580C) superpuesto abajo-izquierda (`.card-precio-tag`), meta compacta. Hover: translateY(-6px) + shadow. Clavito decorativo arriba-centro. Overflow visible para tag y clavito.
- Grid (`.grid-anuncios`): minmax(150px, 1fr) mobile → 180px tablet → 180–210px desktop, gaps justos.
- Skeleton (`.card-skeleton`): 1:1 ratio, pulse animation.
- Mis avisos: misma card-anuncio/grid-anuncios que index, con barra de acciones extra abajo (`.card-acciones-mis-avisos`).
- Footer: fondo verde oscuro (#065F46), texto blanco semitransparente, enlaces en #6EE7B7.
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
- **Grid desktop limitada a 240px por tarjeta:** `minmax(200px, 240px)` en desktop para que no se estiren las tarjetas
- **Rediseño tipo clasificados (jul 2026):** estilo visual tipo OLX/MercadoLibre
  - Header compacto (0.5rem padding), clase `.btn-publicar` reusable con SVG plus
  - Hero minimal con buscador integrado (`.hero-search`), padding reducido
  - Categorías como chips horizontales con scroll-snap (`.categorias-scroll`), outline white
  - Cards 1:1 con pill de categoría overlay (`.card-categoria-pill`), precio dominante 1.1rem en #111827
  - Skeleton 1:1, grid 150px min mobile
  - Footer oscuro #065F46 con texto blanco
  - Dropdown de usuario animado (fadeDown)
- **Foto de Baradero de fondo en hero (jul 2026):** `imagenbaradero.webp` vía `.hero::before` con overlay gradiente semitransparente 0.75–0.85 opacidad. Fallback al gradiente si no carga. Mobile: background-position center 30%.
- **Unificación mis-avisos.html (jul 2026):** reemplazado `mis-aviso-card` por el mismo componente `card-anuncio`/`grid-anuncios` que index.html. Barra de acciones extra (`.card-acciones-mis-avisos`) con botones Editar/Eliminar. Eliminadas reglas CSS viejas `.mis-aviso-card`.
- **Fix (jul 2026):** badge "Todas" en categorías no tenía onclick asignado — corregido.
- **Fix (jul 2026):** Inconsistencia entre `.badge-categoria` y `.card-categoria` — los estilos base (cursor: pointer, hover, active) faltaban en el SCSS source; solo existían en CSS compilado. Unificada toda la UI a `.badge-categoria` según especificación DESARROLLO.md:105 (outline white, active verde sólido). Eliminado código muerto `.card-categoria`. Renombrado `.card-categoria-pill` → `.badge-categoria-pill` en card-img-wrap para consistencia.
- **CSS cleanup (jul 2026):** 682 líneas eliminadas de `main.css` — clases hero muertas (`hero-board`, `hero-object-*`, `hero-center`, `hero-title`, `hero-subtitle`, `hero-search`, `hero-actions`, `hero-trust`, `hero-pin`, `btn-hero-primary/secondary`), `.sello-artesanal` duplicado, `@keyframes` duplicados.
- **Accessibility (jul 2026):** `role="button"`, `tabindex="0"`, `onkeydown` Enter/Space, `:focus-visible` en `.card-anuncio`. CLS fix con `width="400" height="400"` en `<img>`.
- **Conditional location (jul 2026):** `.card-ubicacion` renderiza solo cuando `a.ubicacion` existe (sin placeholder).
- **Hero subtitle & search restore (jul 2026):** Reglas `.hero-subtitle`, `.hero-search`, `.hero-search-icon`, `.hero-search input` restauradas en `main.css` tras limpieza accidental.
- **Categories scroll padding (jul 2026):** `padding-right: 40px` agregado a `.categorias-scroll` para que la última categoría no quede tapada por el fade `::after`.
- **Phone validation (jul 2026):** Input teléfono con `autocomplete="off"`, `inputmode="tel"`, `pattern="[0-9+\-\s()]{6,30}"`. Validación extra que detecta `@` en el campo y bloquea publicación con mensaje específico.
- **Categories flex-wrap (jul 2026):** Reemplazado scroll horizontal por `flex-wrap` — todas las categorías visibles de una, sin flechas ni fade. Eliminados `.categorias-wrapper`, `.cat-arrow` y reglas de scroll-snap.
- **Hero padding (jul 2026):** Restaurado `padding: 2.5rem 0 2rem` (mobile: `1.75rem 0 1.5rem`), eliminado `perspective: 1000px` no utilizado.
- **Price tag overlay (jul 2026):** Precio movido de `.card-body` a `.card-precio-tag` — etiqueta naranja (#EA580C) position:absolute sobre la esquina inferior-izquierda de la imagen, con `::before` decorativo, rotación -4deg, sombra. Padding de `.card-body` ajustado para compensar.
- **Card overflow fix (jul 2026):** Eliminado `overflow: hidden` de `.card-anuncio` para que el clavito `::before` y `.card-precio-tag` se vean completos. Border-radius movido a `.card-img-wrap` (arriba) y `.card-body` (abajo).
- **Card-img-wrap overflow fix (jul 2026):** Eliminado `overflow: hidden` de `.card-img-wrap` para que `.card-precio-tag` no se corte. Border-radius aplicado directamente a `.card-img`.
- **Category pill positioning (jul 2026):** Nueva regla `.card-img-wrap .badge-categoria` con `position: absolute; top: 8px; left: 8px` — pill de categoría posicionado sobre la imagen, sin afectar chips de filtro.

## Pendientes

- [ ] Probar registro completo (crear usuario, confirmar email, publicar)
- [ ] Configurar SMTP en Supabase con `contacto@gaboweb.com.ar` (DonWeb)
- [ ] SITE_URL y Redirect URLs en Supabase Auth ya configurados para GitHub Pages
- [ ] (Opcional) Login con Google
- [ ] (Opcional) Hostear en DonWeb

## Estado actual (jul 2026)

- Último commit: `84b4a01` — Posicionamiento absoluto del pill de categoría dentro de card-img-wrap
- Repo: `https://github.com/GabrielColazo/barashop`
- URL: `https://gabrielcolazo.github.io/barashop/`

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
│       ├── barashop.webp             # Logo
│       ├── imagenbaradero.webp       # Fondo del hero
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
    └── DESARROLLO.md         # (este archivo)
```
