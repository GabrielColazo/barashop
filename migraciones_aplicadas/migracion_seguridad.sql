-- ============================================================
-- Migración de seguridad: constraints, storage RLS, cleanup
-- ============================================================

-- 1. CHECK constraints en anuncios
ALTER TABLE anuncios ADD CONSTRAINT anuncios_precio_check CHECK (precio >= 0);
ALTER TABLE anuncios ADD CONSTRAINT anuncios_titulo_length CHECK (char_length(titulo) BETWEEN 3 AND 120);
ALTER TABLE anuncios ADD CONSTRAINT anuncios_telefono_length CHECK (char_length(telefono) BETWEEN 6 AND 30);
ALTER TABLE anuncios ADD CONSTRAINT anuncios_descripcion_length CHECK (char_length(descripcion) <= 2000);

-- 2. Eliminar columna imagen_url (no se usa, reemplazada por anuncio_imagenes)
-- Si da advertencia de operación destructiva, comentá la línea de abajo.
-- ALTER TABLE anuncios DROP COLUMN IF EXISTS imagen_url;

-- 3. Storage: política para que solo autenticados puedan subir archivos
-- (Ejecutar en SQL Editor de Supabase > Storage > Policies)
-- CREATE POLICY "Solo autenticados pueden subir" ON storage.objects
--   FOR INSERT WITH CHECK (
--     auth.role() = 'authenticated'
--     AND bucket_id = 'imagenes'
--     AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp'))
--     AND octet_length(content) < 5242880
--   );
--
-- CREATE POLICY "Todos pueden ver imágenes" ON storage.objects
--   FOR SELECT USING (bucket_id = 'imagenes');
