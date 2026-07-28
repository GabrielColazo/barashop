-- ============================================================
-- Migración RLS: fix política INSERT en anuncio_imagenes
-- ============================================================
-- Problema: WITH CHECK (true) permitía a cualquier usuario
-- autenticado insertar imágenes en anuncios ajenos.
-- Fix: validar que el anuncio pertenece al usuario autenticado.
-- ============================================================

-- 1. Borrar política vieja
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes" ON anuncio_imagenes;

-- 2. Crear nueva política con chequeo de propiedad
CREATE POLICY "Usuarios autenticados pueden subir imágenes" ON anuncio_imagenes
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM anuncios
      WHERE anuncios.id = anuncio_imagenes.anuncio_id
        AND anuncios.usuario_id = auth.uid()
    )
  );
