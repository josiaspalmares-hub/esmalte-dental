// Solicitudes de cita que salen de la web. Se guardan solo en este navegador
// para que el panel de muestra pueda mostrarlas; la cita real va por WhatsApp.

export type Solicitud = {
  id: string
  creada: string
  nombre: string
  telefono: string
  tratamiento: string
  dentista: string
  dia: string
  hora: string
  estado: 'nueva' | 'confirmada' | 'otra-hora'
  muestra?: boolean
}

const CLAVE = 'esmalte:solicitudes'

export function leerSolicitudes(): Solicitud[] {
  const crudo = localStorage.getItem(CLAVE)
  if (!crudo) return []
  try {
    const datos = JSON.parse(crudo)
    return Array.isArray(datos) ? datos : []
  } catch (error) {
    if (error instanceof SyntaxError) {
      localStorage.removeItem(CLAVE)
      return []
    }
    throw error
  }
}

export function guardarSolicitudes(lista: Solicitud[]) {
  localStorage.setItem(CLAVE, JSON.stringify(lista))
}

export function agregarSolicitud(s: Omit<Solicitud, 'id' | 'creada' | 'estado'>): Solicitud {
  const nueva: Solicitud = { ...s, id: crypto.randomUUID(), creada: new Date().toISOString(), estado: 'nueva' }
  guardarSolicitudes([nueva, ...leerSolicitudes()].slice(0, 30))
  return nueva
}

// Teléfono venezolano: 0412, 0414, 0416, 0422, 0424, 0426 + 7 dígitos
export function telefonoValido(t: string) {
  return /^0?4(12|14|16|22|24|26)\d{7}$/.test(t.replace(/[\s-]/g, ''))
}
