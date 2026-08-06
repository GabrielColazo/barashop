-- Agregar nombre y apellido del vendedor a la tabla anuncios
-- Ejecutar en SQL Editor de Supabase

ALTER TABLE anuncios ADD COLUMN nombre TEXT;
ALTER TABLE anuncios ADD COLUMN apellido TEXT;
