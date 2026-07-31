-- Migración: agregar columna renovado_at para funcionalidad de renovar aviso
-- Ejecutar manualmente en el SQL Editor de Supabase

ALTER TABLE anuncios ADD COLUMN renovado_at TIMESTAMPTZ DEFAULT NULL;
