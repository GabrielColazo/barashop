async function registrar(email, password) {
  const { data, error } = await sb.auth.signUp({ email, password })
  if (error) throw error
  return data
}

async function iniciarSesion(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

async function cerrarSesion() {
  const { error } = await sb.auth.signOut()
  if (error) throw error
}

function obtenerSesion() {
  return sb.auth.getSession()
}

function escucharAuth(callback) {
  sb.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}
