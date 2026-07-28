-- ============================================================
-- Migración RLS: fix política UPDATE en anuncios
-- ============================================================
-- Problema: faltaba WITH CHECK, lo que permitía en teoría cambiar
-- el usuario_id de un anuncio al editarlo (transferir la propiedad).
-- Fix: agregar WITH CHECK para bloquear ese cambio.
-- ============================================================

DROP POLICY IF EXISTS "Propietario puede editar su anuncio" ON anuncios;

CREATE POLICY "Propietario puede editar su anuncio" ON anuncios
  FOR UPDATE
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);
