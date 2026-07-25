# Documentación: Mejoras del Hero en BaraShop

## Resumen de Modificaciones

Este documento documenta el rediseño del Hero de BaraShop para una presentación mínima, elegante y centrada, eliminando completamente elementos de fondo y mejorando la jerarquía visual.

## Descripción del Proceso
El Hero se rediseñó desde cero para crear una experiencia visual limpia y profesional, eliminando texturas innecesarias y simplificando las animaciones para un enfoque en los elementos principales.

### 1. Eliminación Completa de Texturas
- **Fondo Principal:** Se eliminó completamente el patrón de corcho y cualquier fondo SVG o textura
- **Hero::before:** Ahora con `background: transparent` para máxima limpieza
- **Objetivo:** Eliminar cualquier distracción visual del contenido principal

### 2. Rediseño del Tablero Principal (hero-board)
- **Simplify Fondo:** Cambio de gradientes complejos a blanco sólido para claridad máxima
- **Ajustes de Espaciado:** Aumentado de `3rem 2rem 3.5rem` a `4rem 3rem` para mejor breathing room
- **Radios de Borde:** Reducidos de `28px` a `20px` para diseño más moderno y limpio
- **Sombras Simplificadas:** Sombra de superficie única `0 8px 32px rgba(0, 0, 0, 0.04)`
- **Efectos Hover:** Transición simple de `translateY(-8px)` con shadow ampliado

### 3. Eliminación de Animaciones Complejas
- **Efectos de Pins:** Eliminado `pinFloat`, brillo y parpadeo - manteniendo solo hover sutil
- **Tarjetas Flotantes:** Eliminada `cardFloat` y todas las animaciones por tiempo
- **Tarjetas Hover:** Eliminada escala, corrimiento y shadow raised - efectos más sutiles

### 4. Nuevos Estándares Tipográficos y de Contenido
- **Tipografía Principal:** Fuentes Inter con jerarquía de peso y tamaño limpias
- **Paleta de Colores:** Preservada escala enimi (primary: #059669, secondary: #047857)
- **Sistema de Espaciado:**Implementado espaciado consistente basado en espaciado predeterminado

## Arquitectura Técnica

### Aspectos Principales
- **CSS Moderno:** Archivos separados mantenidos como estilos en línea, sin refactorización innecesaria
- **Pipeline de Build:**Proceso directo - mantenimiento mínimo de archivos CSS
- **Control de Versiones:** Todas las animaciones complejas eliminadas, sin librerías innecesarias

### Optimización Móvil
- **Diseño Mobile-First:** Establecido base limpia y móvil
- **Progressive Enhancement:** Actualizaciones enfocadas en responsividad manteniendo simplicidad

## Líneas de Base e inspiración

### Lineamientos de Diseño
- **Jerarquía:** Eliminado capas visuales innecesarias, enfocación en contenido
- **Espacios en Blanco:** Maximizado espacios en blanco con fondos simples
- **Profesionalismo:** Estilo minimalista corporativo actualizado

### Mejoras Futuras Consideradas
- **Control de Animaciones:** Posibilidad de agregar alternativas sin movimiento
- **Interacción con Buscador:** Opciones de enfoque mejoradas con enfoque limpio
- **Optimización de Contenido:** Uso racional espacio asignado a imágenes y elementos decorativos

## Resumen de Resultados

El Hero moderno elimina completamente elementos de fondo innecesarios, estableciendo baseline visual profesional y moderno con impacto visual equilibrado:

- **Máxima limpieza visual:** Fondo completamente transparente
- **Jerarquía centrada:** Título, subtítulo, buscador y botones como elementos principales
- **Variedad tipográfica:** Equilibrio entre simplicidad y atractividad visual
- **Performance mejorada:** Eliminación de todas las animaciones complejas
- **Adopción universal:** Establecimiento de baseline limpio y minimalista

## Ilustración SVG del Hero (Barquito)

### Cambios Recientes (2026)

Se agregó una ilustración SVG decorativa de un barquito con vela entre el subtítulo (`hero-tagline`) y el buscador (`hero-search`).

### Estructura HTML
- Ubicación: `<div class="hero-barco">` entre `hero-tagline` y `hero-search`
- Atributo: `aria-hidden="true"` (decorativo, no accesible)
- SVG inline con viewBox `0 0 680 320`

### Estilos CSS (`css/partials/_layout.scss`)
```scss
.hero-barco {
  max-width: 380px;        // Desktop
  margin: -0.5rem auto 0.75rem;

  @media (max-width: 575px) {
    max-width: 220px;      // Mobile
    margin: 0 auto 1rem;
  }
}
```

### Tamaños Finales
- **Desktop:** 380px de ancho máximo
- **Mobile (≤575px):** 220px de ancho máximo

### Archivos Modificados
- `index.html` - Línea ~54: SVG del barquito
- `css/partials/_layout.scss` - Línea ~118: Estilos `.hero-barco`
- `css/main.css` - CSS compilado

## Iconos Decorativos del Hero

### Descripción
16 iconos SVG inline distribuidos en los laterales del hero (8 izquierda + 8 derecha), con opacidad sutil y `pointer-events: none` para que no interfieran con la interacción.

### Estructura HTML
- **Contenedores:** `.hero-decor-left` y `.hero-decor-right` dentro de `<section class="hero">`
- Cada icono es un `<svg class="decor-icon">` con estilos inline (posición, tamaño, rotación)
- Todos usan `stroke="currentColor"`, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`

### Iconos Actuales (Julio 2026)

**Lado Izquierdo (8):**
1. Libro (top:2%, left:5%, 46px, rotate:-14deg)
2. Laptop (top:13%, left:24%, 74px, rotate:9deg)
3. Auto (top:24%, left:3%, 58px, rotate:-7deg)
4. Bolsa de compras (top:35%, left:22%, 64px, rotate:15deg)
5. Cartera (top:46%, left:5%, 42px, rotate:-19deg)
6. Globe (top:56%, left:22%, 38px, rotate:12deg)
7. Estrella (top:66%, left:3%, 48px, rotate:-5deg)
8. Reloj alarma (top:75%, left:23%, 44px, rotate:17deg)

**Lado Derecho (8):**
1. Bolsa (top:5%, right:3%, 52px, rotate:13deg)
2. Reloj (top:15%, right:25%, 40px, rotate:-11deg)
3. Camión (top:25%, right:2%, 76px, rotate:8deg)
4. Bicicleta (top:35%, right:23%, 58px, rotate:-16deg)
5. Pulso/heartbeat (top:45%, right:4%, 42px, rotate:-8deg)
6. Mesa (top:55%, right:2%, 66px, rotate:14deg)
7. Martillo (top:65%, right:24%, 50px, rotate:-17deg)
8. Barco (top:75%, right:3%, 44px, rotate:6deg)
9. Libro/carpeta (top:2%, right:13%, 36px, rotate:19deg)

### Estilos CSS (`css/partials/_layout.scss`)
```scss
.hero-decor {
  position: absolute;
  top: 0;
  height: 100%;
  width: 580px;
  pointer-events: none;
  z-index: 0;

  @media (max-width: 991px) {
    display: none; // Solo desktop
  }
}

.hero-decor-left  { left: 0; }
.hero-decor-right { right: 0; }

.decor-icon {
  position: absolute;
  opacity: 0.16;
  color: v.$color-primary; // #059669
}
```

### Reglas de Diseño
- **Rango vertical:** Todos entre 2%-75% para evitar cortes en bordes
- **Opacidad:** 0.16 (sutil, no compite con contenido principal)
- **Zona libre:** Centro ~35% reservado para `.hero-barco`
- **Ocultos en móvil:** `display: none` bajo 991px

### Iconos Eliminados
- Llave inglesa
- Grilla de ventanas
- Gota de agua
- Pico de minería

### Archivos Modificados
- `index.html` - Líneas 51-68: SVGs decorativos
- `css/partials/_layout.scss` - `.hero-decor` y `.decor-icon`
- `css/main.css` - CSS compilado