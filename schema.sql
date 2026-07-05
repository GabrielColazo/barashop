-- Crear tabla de categorías
CREATE TABLE categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  icono TEXT NOT NULL DEFAULT '📦',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Crear tabla de anuncios
CREATE TABLE anuncios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  precio NUMERIC(10,2) DEFAULT 0,
  telefono TEXT NOT NULL DEFAULT '',
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  imagen_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla para múltiples imágenes por anuncio (máx 3)
CREATE TABLE anuncio_imagenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anuncio_id UUID REFERENCES anuncios(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  orden INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activar RLS
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncio_imagenes ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Categorias visibles para todos" ON categorias
  FOR SELECT USING (true);

CREATE POLICY "Anuncios visibles para todos" ON anuncios
  FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden publicar" ON anuncios
  FOR INSERT TO authenticated
  WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Propietario puede editar su anuncio" ON anuncios
  FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Propietario puede eliminar su anuncio" ON anuncios
  FOR DELETE USING (auth.uid() = usuario_id);

-- Imágenes: cualquier puede ver
CREATE POLICY "Imágenes visibles para todos" ON anuncio_imagenes
  FOR SELECT USING (true);

-- Imágenes: usuarios autenticados pueden insertar
CREATE POLICY "Usuarios autenticados pueden subir imágenes" ON anuncio_imagenes
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Imágenes: propietario puede eliminar
CREATE POLICY "Propietario puede eliminar imágenes" ON anuncio_imagenes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM anuncios WHERE anuncios.id = anuncio_imagenes.anuncio_id AND anuncios.usuario_id = auth.uid())
  );

-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre, icono) VALUES
  ('Vehículos', '🚗'),
  ('Inmuebles', '🏠'),
  ('Electrónica', '📱'),
  ('Muebles', '🪑'),
  ('Ropa y Accesorios', '👕'),
  ('Deportes', '⚽'),
  ('Mascotas', '🐾'),
  ('Servicios', '🔧'),
  ('Empleos', '💼'),
  ('Otros', '📦');
