const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

;(async () => {
  const fechaLimite = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data: anuncios, error } = await supabase
    .from('anuncios')
    .select('id, created_at, renovado_at')

  if (error) {
    console.error('Error al consultar anuncios:', error.message)
    process.exit(1)
  }

  const anunciosVencidos = (anuncios || []).filter(a => {
    const fechaBase = a.renovado_at || a.created_at
    return fechaBase < fechaLimite
  })

  if (anunciosVencidos.length === 0) {
    console.log('No hay anuncios vencidos hoy')
    process.exit(0)
  }

  console.log(`Se encontraron ${anunciosVencidos.length} anuncio(s) vencido(s)`)

  let totalImagenesBorradas = 0
  let totalAnunciosBorrados = 0

  for (const anuncio of anunciosVencidos) {
    try {
      const { data: imagenes, error: errImgs } = await supabase
        .from('anuncio_imagenes')
        .select('url')
        .eq('anuncio_id', anuncio.id)

      if (errImgs) {
        console.error(`Error al obtener imágenes del anuncio ${anuncio.id}:`, errImgs.message)
        continue
      }

      if (imagenes && imagenes.length > 0) {
        const filenames = imagenes.map(img => {
          const partes = img.url.split('/')
          return partes[partes.length - 1]
        })

        const { error: errStorage } = await supabase.storage
          .from('imagenes')
          .remove(filenames)

        if (errStorage) {
          console.error(`Error al borrar imágenes del storage para anuncio ${anuncio.id}:`, errStorage.message)
        } else {
          totalImagenesBorradas += filenames.length
        }
      }

      const { error: errDelete } = await supabase
        .from('anuncios')
        .delete()
        .eq('id', anuncio.id)

      if (errDelete) {
        console.error(`Error al borrar anuncio ${anuncio.id}:`, errDelete.message)
        continue
      }

      totalAnunciosBorrados++
    } catch (err) {
      console.error(`Error inesperado con anuncio ${anuncio.id}:`, err.message)
    }
  }

  console.log(`Resumen: ${totalAnunciosBorrados} anuncio(s) borrado(s), ${totalImagenesBorradas} imagen(es) borrada(s)`)
})()
