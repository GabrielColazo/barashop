const MAX_IMAGENES = 3
const MAX_PESO_MB = 5

async function obtenerAnuncios(filtro = {}) {
  let query = sb.from('anuncios')
    .select('*, categorias(*)')
    .order('created_at', { ascending: false })

  if (filtro.categoria_id) {
    query = query.eq('categoria_id', filtro.categoria_id)
  }
  if (filtro.busqueda) {
    query = query.ilike('titulo', `%${filtro.busqueda}%`)
  }

  const { data, error } = await query
  if (error) throw error

  const anunciosConImagenes = await Promise.all(data.map(async (a) => {
    const imagenes = await obtenerImagenesAnuncio(a.id)
    return { ...a, imagenes }
  }))

  return anunciosConImagenes
}

async function obtenerAnuncio(id) {
  const { data, error } = await sb.from('anuncios')
    .select('*, categorias(*)')
    .eq('id', id)
    .single()
  if (error) throw error

  const imagenes = await obtenerImagenesAnuncio(id)
  return { ...data, imagenes }
}

async function obtenerImagenesAnuncio(anuncioId) {
  const { data, error } = await sb.from('anuncio_imagenes')
    .select('*')
    .eq('anuncio_id', anuncioId)
    .order('orden', { ascending: true })
  if (error) throw error
  return data || []
}

async function publicarAnuncio(anuncio) {
  const sesion = await obtenerSesion()
  if (!sesion.data.session) throw new Error('Debes iniciar sesión')

  const { data, error } = await sb.from('anuncios').insert({
    titulo: anuncio.titulo,
    descripcion: anuncio.descripcion,
    precio: anuncio.precio,
    telefono: anuncio.telefono,
    categoria_id: anuncio.categoria_id,
    usuario_id: sesion.data.session.user.id
  }).select().single()

  if (error) throw error
  return data
}

async function subirImagenes(files) {
  const urls = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (file.size > MAX_PESO_MB * 1024 * 1024) {
      throw new Error(`"${file.name}" supera los ${MAX_PESO_MB}MB`)
    }

    const ext = file.name.split('.').pop().toLowerCase()
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      throw new Error(`"${file.name}" no es un formato válido. Usá JPG, PNG o WEBP`)
    }

    const nombre = `${Date.now()}-${i}.${ext}`
    const { data, error } = await sb.storage.from('imagenes').upload(nombre, file)
    if (error) throw error

    const { data: { publicUrl } } = sb.storage.from('imagenes').getPublicUrl(nombre)
    urls.push(publicUrl)
  }
  return urls
}

async function guardarImagenesAnuncio(anuncioId, urls) {
  if (urls.length === 0) return

  const inserts = urls.map((url, i) => ({
    anuncio_id: anuncioId,
    url,
    orden: i
  }))

  const { error } = await sb.from('anuncio_imagenes').insert(inserts)
  if (error) throw error
}

async function eliminarAnuncio(id) {
  const { error } = await sb.from('anuncios').delete().eq('id', id)
  if (error) throw error
}

async function obtenerCategorias() {
  const { data, error } = await sb.from('categorias').select('*').order('nombre')
  if (error) throw error
  return data
}
