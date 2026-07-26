# Cambios en BaraShop - Documentación

## Resumen

Rediseño completo del hero, nav, categorías, buscador y formulario de publicación de BaraShop.

---

## 1. Hero Barco SVG

- Reemplazo de la ilustración del diario por un barco simplificado
- **Desktop**: max-width 380px
- **Mobile**: max-width 220px
- **Animación**: flotación suave arriba/abajo (`barcoFlota`, 3.5s, 8px)
- Clase: `.hero-barco`

## 2. Título y Tagline

- **Título**: "El clasificado de Baradero" con "Baradero" en verde (#059669) y text-shadow sutil
- **Tagline**: "Publicá, buscá y encontrá, todo en un solo lugar"
- **Animación del título**: fade-in hacia arriba (`heroFadeUp`, 0.8s)

## 3. Cartelitos de Confianza (6 total)

### Posiciones (dentro de `.hero-decor-left` y `.hero-decor-right`)

**Izquierda:**
| Texto | top | left | Rotación |
|-------|-----|------|----------|
| Más seguro que cualquier red social | 5% | 10% | -2° |
| Con registro, todo más seguro | 35% | 12% | 1° |
| Baradero, Alsina, Sta. Coloma y Portela | 68% | 9% | -1.5° |

**Derecha:**
| Texto | top | right | Rotación |
|-------|-----|-------|----------|
| Acá no hay perfiles anónimos | 8% | 10% | 2° |
| Detrás de cada aviso, un vecino real | 38% | 12% | -1° |
| Categorías claras, para encontrar rápido | 70% | 8% | 1.5° |

### CSS Custom Property

Cada cartelito usa `--rotate` en vez de `transform:rotate()` inline, para que el hover funcione correctamente:

```html
<div class="cartelito" style="--rotate:-2deg; top:5%; left:10%; animation-delay:0.3s;">
```

### Hover Effect

```scss
.cartelito {
  --rotate: 0deg;
  transform: translateY(0) rotate(var(--rotate)) scale(1);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;

  &:hover {
    transform: translateY(-8px) rotate(calc(var(--rotate) + 4deg)) scale(1.03);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(16, 185, 129, 0.2), inset 0 2px 6px rgba(16, 185, 129, 0.1);
    border-color: #10b981;
    background: linear-gradient(180deg, #f0fdf4 0%, #fff 100%);
  }
}
```

### Pin Verde

```scss
.cartelito-pin {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 1px 4px rgba(5, 150, 105, 0.45);
}
```

### Animación de Entrada

- Entrada escalonada con `animation-delay` (0.3s a 0.8s)
- `opacity: 0` inicial, fade-in con `cartelitoIn`

### Responsive

- **Desktop (≥1200px)**: cartelitos visibles
- **Mobile (<1200px)**: `.hero-decor { display: none; }`

---

## 4. Buscador del Hero

### Estructura HTML

```html
<form class="hero-search" id="hero-search-form">
  <span class="hero-search-icon">...</span>
  <input type="text" id="search-input" placeholder="Buscá lo que necesites...">
  <button type="submit" class="hero-search-btn">Buscar</button>
</form>
```

### Botón Buscar

```scss
.hero-search-btn {
  background: rgba(5, 150, 105, 0.12);
  color: #059669;
  border: none;
  padding: 0.6rem 1.1rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #059669;
    color: #FFFFFF;
  }
}
```

### Hover/Focus en el Panel

```scss
.hero-search {
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus-within {
    box-shadow: 0 6px 22px rgba(0, 0, 0, 0.14);
    transform: translateY(-1px);
  }
}
```

### Lógica de Búsqueda vs Categoría

En `js/anuncios.js`:

```javascript
if (filtro.busqueda) {
  query = query.ilike('titulo', `%${filtro.busqueda}%`)
} else if (filtro.categoria_id) {
  query = query.eq('categoria_id', filtro.categoria_id)
}
```

En `index.html`:

```javascript
async function cargarAnuncios() {
  const busqueda = document.getElementById('search-input').value
  const filtro = {}
  if (busqueda) {
    filtro.busqueda = busqueda
  } else if (categoriaActiva) {
    filtro.categoria_id = categoriaActiva
  }
  // ...
}
```

**Comportamiento**: si hay texto de búsqueda, se busca en TODAS las categorías. Si no hay texto, se respeta la categoría activa.

---

## 5. Control de Orden de Avisos

### Estructura HTML

```html
<div class="orden-toggle" id="orden-toggle">
  <span class="orden-toggle-label">Ordenar por:</span>
  <button type="button" class="orden-toggle-btn active" data-orden="desc">Recientes</button>
  <button type="button" class="orden-toggle-btn" data-orden="asc">Antiguos</button>
</div>
```

### Estilo

```scss
.orden-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
  font-size: 0.85rem;
  color: #6B7280;
}

.orden-toggle-btn {
  background: rgba(5, 150, 105, 0.12);
  color: #059669;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover,
  &.active {
    background: #059669;
    color: #FFFFFF;
  }
}

@media (max-width: 575px) {
  .orden-toggle { font-size: 0.8rem; margin: 0.75rem 0; }
  .orden-toggle-btn { padding: 0.35rem 0.8rem; font-size: 0.8rem; }
}
```

### Lógica

```javascript
let ordenActual = 'desc'

async function cargarAnuncios() {
  const filtro = { orden: ordenActual }
  // ...
}

document.querySelectorAll('.orden-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    ordenActual = btn.dataset.orden
    document.querySelectorAll('.orden-toggle-btn').forEach(b => {
      b.classList.toggle('active', b === btn)
    })
    cargarAnuncios()
  })
})
```

En `js/anuncios.js`:

```javascript
.order('created_at', { ascending: filtro.orden === 'asc' })
```

---

## 6. Nav (Header)

### Estilo

```scss
.header {
  background: linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(236,253,245,0.88) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 0.4rem 0;
  // ...
}

.logo-text img {
  height: 90px;  // desktop
  @media (max-width: 575px) { height: 72px; }  // mobile
}
```

### Logo Transparente

- Reemplazado `barashop.webp` por versión con fondo transparente (RGBA → webp con alpha)
- Elimina el recuadro blanco que se notaba sobre el degradado del header

---

## 7. Categorías - Desktop (Home)

### Estilo Tarjetita

```scss
.categorias-scroll,
#categoria-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;

  .badge-categoria {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    min-width: 78px;
    padding: 0.7rem 0.6rem;
    border-radius: 12px;
    background: rgba(5, 150, 105, 0.05);
    border: 1px solid #E5E7EB;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    .cat-icon { font-size: 1.3rem; }
    .cat-label { font-size: 0.72rem; font-weight: 500; }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(5, 150, 105, 0.15);
    }

    &.active {
      background: rgba(5, 150, 105, 0.14);
      border-color: #059669;
    }
  }
}

.categorias-scroll { margin-top: 2rem; }
#categoria-badges { margin-top: 0.75rem; }
```

### Estructura HTML (badge)

```html
<span class="badge-categoria" data-id="1">
  <span class="cat-icon">🏠</span>
  <span class="cat-label">Inmuebles</span>
</span>
```

---

## 8. Categorías - Mobile (Home + Publicar)

### Popover con Grilla

```scss
.categorias-mobile {
  display: none;
  position: relative;
  margin-top: 2rem;
}

@media (max-width: 575px) {
  .categorias-scroll { display: none; }
  .categorias-mobile { display: block; }
  #categoria-badges { display: none !important; }
}

.categorias-mobile-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(6px);
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 0.65rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.categorias-mobile-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%) scale(0.96);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease;
  width: 92vw;
  max-width: 360px;
  max-height: 60vh;
  overflow-y: auto;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  padding: 0.75rem;
  z-index: 150;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;

  &.open {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
  }
}

.categoria-grid-item {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem 0.3rem;
  border-radius: 10px;
  background: rgba(5, 150, 105, 0.05);
  border: 1px solid transparent;

  .cat-icon { font-size: 1.3rem; }
  .cat-label { font-size: 0.68rem; font-weight: 500; }

  &.active {
    background: rgba(5, 150, 105, 0.14);
    border-color: rgba(5, 150, 105, 0.35);
    color: #059669;
  }
}
```

### Label Caption

```scss
.categorias-mobile-caption {
  display: block;
  font-size: 0.75rem;
  color: #6B7280;
  margin-bottom: 0.35rem;
  font-weight: 500;
}
```

### Lógica

```javascript
// Trigger abre/cierra panel
document.getElementById('categorias-mobile-trigger').addEventListener('click', (e) => {
  e.stopPropagation()
  document.getElementById('categorias-mobile-panel').classList.toggle('open')
})

// Click afuera cierra panel
document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('categorias-mobile')
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('categorias-mobile-panel').classList.remove('open')
  }
})
```

---

## 9. Formulario Publicar - Categoría

### Confirmación de Categoría (Desktop)

```html
<div class="categoria-confirmada" id="categoria-confirmada" style="display:none;">
  ✓ Categoría: <span id="categoria-confirmada-nombre"></span>
</div>
```

```scss
.categoria-confirmada {
  font-size: 0.85rem;
  font-weight: 600;
  color: #059669;
  margin-bottom: 0.5rem;
}

@media (max-width: 575px) {
  .categoria-confirmada { display: none !important; }
}
```

### Validación antes de publicar

```javascript
if (!categoriaId) {
  errorEl.style.color = '#EF4444'
  errorEl.textContent = 'Elegí una categoría antes de publicar'
  errorEl.classList.remove('d-none')

  const seccionCategoria = document.getElementById('categoria-badges')
  seccionCategoria.scrollIntoView({ behavior: 'smooth', block: 'center' })

  const trigger = document.getElementById('categorias-mobile-trigger-publicar')
  if (trigger) {
    trigger.style.borderColor = '#EF4444'
    setTimeout(() => { trigger.style.borderColor = '' }, 2500)
  }
  return
}
```

### Sincronización Desktop ↔ Mobile

```javascript
function seleccionarCategoriaMobile(id, el) {
  const badgeDesktop = document.querySelector(`#categoria-badges .badge-categoria[data-id="${id}"]`)
  seleccionarCategoria(id, badgeDesktop || el)
  // actualiza panel mobile y cierra
}

function seleccionarCategoria(id, el) {
  // ... lógica existente ...
  // sincroniza con panel mobile
  const itemMobile = document.querySelector(`#categorias-mobile-panel-publicar .categoria-grid-item[data-id="${id}"]`)
  if (itemMobile) itemMobile.classList.add('active')
}
```

---

## 10. .gitignore

```
css/main.css.map
.DS_Store
.env
.env.local
.env.*.local
```

---

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `index.html` | Hero, cartelitos, buscador form, toggle orden, categorías mobile |
| `publicar.html` | Popover categorías mobile, confirmación, validación |
| `css/partials/_layout.scss` | Estilos hero, search, toggle, nav, responsive |
| `css/partials/_components.scss` | Categorías tarjetita, popover mobile, confirmación |
| `css/main.css` | Compilado |
| `js/anuncios.js` | Lógica búsqueda/categoría, orden |
| `assets/img/barashop.webp` | Logo con transparencia |
| `.gitignore` | Archivos .env |
| `.github/workflows/pages.yml` | Eliminado (deploy automático de GitHub Pages) |

---

## Animaciones (todas CSS, sin JS)

| Elemento | Animación | Duración |
|----------|-----------|----------|
| Título | `heroFadeUp` (fade-in + translate) | 0.8s |
| Barco | `barcoFlota` (translateY ±8px) | 3.5s infinito |
| Cartelitos | `cartelitoIn` (fade-in escalonado) | 0.5s cada uno |
