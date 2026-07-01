-- Tabla para múltiples imágenes por anuncio (máx 3)
CREATE TABLE anuncio_imagenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anuncio_id UUID REFERENCES anuncios(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  orden INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE anuncio_imagenes ENABLE ROW LEVEL SECURITY;

-- Imágenes: cualquiera puede ver
CREATE POLICY "Imágenes visibles para todos" ON anuncio_imagenes
  FOR SELECT USING (true);

-- Imágenes: usuarios autenticados pueden insertar
CREATE POLICY "Usuarios autenticados pueden subir imágenes" ON anuncio_imagenes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Imágenes: propietario puede eliminar
CREATE POLICY "Propietario puede eliminar imágenes" ON anuncio_imagenes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM anuncios WHERE anuncios.id = anuncio_imagenes.anuncio_id AND anuncios.usuario_id = auth.uid())
  );
