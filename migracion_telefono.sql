-- Agregar campo teléfono a anuncios
ALTER TABLE anuncios ADD COLUMN telefono TEXT NOT NULL DEFAULT '';
