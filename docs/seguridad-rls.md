# Seguridad — Row Level Security (RLS)

Registro de fixes de seguridad aplicados a las políticas RLS de Supabase.

---

## 2026-07-28 — INSERT en `anuncio_imagenes`

| Campo | Detalle |
|-------|---------|
| **Tabla** | `anuncio_imagenes` |
| **Política** | `Usuarios autenticados pueden subir imágenes` |
| **Operación** | `INSERT` |
| **Migración** | `migraciones_aplicadas/migracion_rls_imagenes.sql` |

### Problema

La cláusula `WITH CHECK (true)` permitía a **cualquier usuario autenticado** insertar una imagen apuntando a un `anuncio_id` que no le pertenecía. Un atacante podía subir fotos a avisos ajenos sin restricción.

### Fix

```sql
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes" ON anuncio_imagenes;

CREATE POLICY "Usuarios autenticados pueden subir imágenes" ON anuncio_imagenes
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM anuncios
      WHERE anuncios.id = anuncio_imagenes.anuncio_id
        AND anuncios.usuario_id = auth.uid()
    )
  );
```

### Pruebas realizadas

| Caso | Resultado |
|------|-----------|
| Insertar imagen en aviso propio | OK — la imagen se crea sin error |
| Insertar imagen en aviso ajeno (desde consola) | Bloqueado — error de RLS |

---

## 2026-07-28 — UPDATE en `anuncios`

| Campo | Detalle |
|-------|---------|
| **Tabla** | `anuncios` |
| **Política** | `Propietario puede editar su anuncio` |
| **Operación** | `UPDATE` |
| **Migración** | `migraciones_aplicadas/migracion_rls_update_anuncios.sql` |

### Problema

La política solo tenía `USING (auth.uid() = usuario_id)`, sin `WITH CHECK`. En PostgreSQL, `USING` controla qué filas podés tocar, pero `WITH CHECK` controla a qué valores podés cambiarlas. Sin esta cláusula, un usuario que edita **su propio aviso** podía cambiar el campo `usuario_id` a otro valor, transfiriendo la propiedad del aviso a otra persona sin autorización.

### Fix

```sql
DROP POLICY IF EXISTS "Propietario puede editar su anuncio" ON anuncios;

CREATE POLICY "Propietario puede editar su anuncio" ON anuncios
  FOR UPDATE
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);
```

### Pruebas realizadas

| Caso | Resultado |
|------|-----------|
| Editar título/precio de aviso propio | OK — el cambio se aplica sin error |
| Cambiar `usuario_id` a otro ID (desde consola) | Bloqueado — `new row violates row-level security policy` |

---

## 2026-07-28 — XSS en `anuncio.html`

| Campo | Detalle |
|-------|---------|
| **Archivo** | `anuncio.html` |
| **Línea** | ~109 |
| **Tipo** | Cross-Site Scripting (XSS) reflejado |

### Problema

Cuando un anuncio no tiene imagen, el fallback renderizaba el título directamente en el atributo `alt` sin pasar por `escapeHtml()`:

```js
galeriaHtml = `<img ... alt="${a.titulo}">`
```

Un atacante podía publicar un anuncio sin foto con un título como `"><img src=x onerror=alert(1)>`, que rompía el atributo `alt` e inyectaba código JavaScript. Se ejecutaba en el navegador de cualquier usuario que abriera ese anuncio.

### Fix

```js
galeriaHtml = `<img ... alt="${escapeHtml(a.titulo)}">`
```

Se agregó `escapeHtml()` al título en el fallback, igual que ya se hacía en el resto del archivo (líneas 98, 116, 117, 123, 132).

### Pruebas realizadas

| Caso | Resultado |
|------|-----------|
| Abrir anuncio sin imagen y título normal | OK — el título se muestra correctamente en `alt` |
| Abrir anuncio sin imagen con título `"><img src=x onerror=alert(1)>` | OK — se muestra el texto literal como string, no se ejecuta ningún script |

### Barrido adicional

Se revisaron `index.html` y `mis-avisos.html` — no se encontraron otros casos de texto de usuario insertado sin `escapeHtml()`.
