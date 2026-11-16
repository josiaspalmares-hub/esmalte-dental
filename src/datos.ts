// Datos de la clínica (ficticia, para el portafolio)

export const CLINICA = {
  nombre: 'Esmalte',
  whatsapp: '584223243034',
  direccion: 'Av. Francisco de Miranda, Torre Ceiba, piso 3, El Rosal, Caracas',
  mapa: 'https://www.openstreetmap.org/?mlat=10.4917&mlon=-66.8574#map=17/10.4917/-66.8574',
  como_llegar: 'https://www.google.com/maps/search/?api=1&query=El+Rosal+Caracas',
}

export type Tratamiento = {
  id: string
  nombre: string
  grupo: 'Prevención' | 'Arreglar un diente' | 'Estética' | 'Ortodoncia' | 'Cirugía' | 'Niños'
  precio: number
  desde?: boolean
  detalle: string
  duracion: string
}

export const TRATAMIENTOS: Tratamiento[] = [
  { id: 'evaluacion', nombre: 'Evaluación con radiografía', grupo: 'Prevención', precio: 25, detalle: 'Revisión completa, radiografía panorámica y plan escrito con precios.', duracion: '40 min' },
  { id: 'limpieza', nombre: 'Limpieza', grupo: 'Prevención', precio: 35, detalle: 'Quita sarro y manchas de café o cigarro. Incluye flúor.', duracion: '45 min' },
  { id: 'resina', nombre: 'Empaste de resina', grupo: 'Arreglar un diente', precio: 40, desde: true, detalle: 'Para caries o un diente partido. Del color de tu diente.', duracion: '40 min' },
  { id: 'endodoncia', nombre: 'Tratamiento de conducto', grupo: 'Arreglar un diente', precio: 150, desde: true, detalle: 'Cuando la caries llegó al nervio y duele. Salva el diente.', duracion: '1 o 2 citas' },
  { id: 'corona', nombre: 'Corona de porcelana', grupo: 'Arreglar un diente', precio: 280, detalle: 'Cubre un diente muy dañado o tratado con conducto.', duracion: '2 citas' },
  { id: 'blanqueamiento', nombre: 'Blanqueamiento en consultorio', grupo: 'Estética', precio: 180, detalle: 'Entre 2 y 4 tonos más claro en una sola cita.', duracion: '90 min' },
  { id: 'carillas', nombre: 'Carilla de resina', grupo: 'Estética', precio: 90, desde: true, detalle: 'Por diente. Corrige forma, color o pequeños espacios.', duracion: '1 o 2 citas' },
  { id: 'brackets', nombre: 'Brackets metálicos', grupo: 'Ortodoncia', precio: 350, detalle: 'Instalación. Luego, control mensual de $35.', duracion: '12 a 24 meses' },
  { id: 'alineadores', nombre: 'Alineadores transparentes', grupo: 'Ortodoncia', precio: 1200, desde: true, detalle: 'Casi invisibles y se quitan para comer. Según tu caso.', duracion: '6 a 18 meses' },
  { id: 'extraccion', nombre: 'Extracción simple', grupo: 'Cirugía', precio: 40, detalle: 'Con anestesia local. Indicaciones por escrito para la casa.', duracion: '30 min' },
  { id: 'cordal', nombre: 'Muela del juicio', grupo: 'Cirugía', precio: 120, desde: true, detalle: 'Según la posición en la radiografía.', duracion: '45 a 60 min' },
  { id: 'ninos', nombre: 'Consulta para niños', grupo: 'Niños', precio: 25, detalle: 'Revisión, limpieza suave y consejos para cepillarse.', duracion: '30 min' },
  { id: 'sellantes', nombre: 'Sellantes', grupo: 'Niños', precio: 15, detalle: 'Por diente. Protege las muelas nuevas de las caries.', duracion: '15 min' },
]

export const tratamiento = (id: string) => {
  const t = TRATAMIENTOS.find((x) => x.id === id)
  if (!t) throw new Error(`No existe el tratamiento ${id}`)
  return t
}

// Guía "¿Qué te trae?": del problema al tratamiento
export type Motivo = {
  id: string
  titulo: string
  respuesta: string
  pasos: string[]
  tratamientos: string[]
  agendar: string
  urgente?: boolean
}

export const MOTIVOS: Motivo[] = [
  {
    id: 'dolor',
    titulo: 'Me duele una muela',
    respuesta: 'Casi siempre es una caries que llegó cerca del nervio. Te atendemos el mismo día o el siguiente.',
    pasos: ['Radiografía de la zona', 'Anestesia antes de tocar nada', 'Empaste si es pequeña; conducto si llegó al nervio'],
    tratamientos: ['evaluacion', 'resina', 'endodoncia'],
    agendar: 'evaluacion',
    urgente: true,
  },
  {
    id: 'limpieza',
    titulo: 'Quiero una limpieza',
    respuesta: 'Lo ideal es cada 6 meses. Si hace más de un año que no vienes, empezamos con una evaluación.',
    pasos: ['Revisión rápida de encías', 'Limpieza con ultrasonido', 'Pulido y flúor'],
    tratamientos: ['limpieza', 'evaluacion'],
    agendar: 'limpieza',
  },
  {
    id: 'blanco',
    titulo: 'Quiero los dientes más blancos',
    respuesta: 'Primero una limpieza: muchas manchas se van solo con eso. Luego el blanqueamiento aclara entre 2 y 4 tonos.',
    pasos: ['Limpieza', 'Protección de encías', 'Blanqueamiento de 90 minutos'],
    tratamientos: ['limpieza', 'blanqueamiento'],
    agendar: 'blanqueamiento',
  },
  {
    id: 'partido',
    titulo: 'Se me partió un diente',
    respuesta: 'Si es un pedacito, se arregla con resina en una cita. Si se partió mucho, puede necesitar una corona.',
    pasos: ['Radiografía', 'Resina del color de tu diente', 'Corona solo si no alcanza la resina'],
    tratamientos: ['resina', 'corona'],
    agendar: 'evaluacion',
  },
  {
    id: 'ortodoncia',
    titulo: 'Quiero enderezar mis dientes',
    respuesta: 'Con brackets o con alineadores transparentes. En la evaluación te decimos cuánto tiempo y cuánto cuesta tu caso.',
    pasos: ['Evaluación con radiografía', 'Plan con tiempo y precio total', 'Instalación y controles mensuales'],
    tratamientos: ['brackets', 'alineadores'],
    agendar: 'evaluacion',
  },
  {
    id: 'ninos',
    titulo: 'Es para mi hijo o hija',
    respuesta: 'Atendemos desde los 3 años. La primera cita es corta y sin pinchazos, para que se acostumbre.',
    pasos: ['Conocer el consultorio', 'Revisión y limpieza suave', 'Sellantes si hacen falta'],
    tratamientos: ['ninos', 'sellantes'],
    agendar: 'ninos',
  },
]

export const DENTISTAS = [
  {
    id: 'salcedo',
    nombre: 'Dr. Andrés Salcedo',
    rol: 'Ortodoncia y odontología general',
    foto: 'dr-salcedo',
    texto: 'Explica todo con un modelo en la mano antes de empezar. Lleva los casos de brackets y alineadores.',
  },
  {
    id: 'rondon',
    nombre: 'Dra. Valeria Rondón',
    rol: 'Conductos, estética y niños',
    foto: 'dra-rondon',
    texto: 'Atiende las urgencias por dolor y los blanqueamientos. Es con quien los niños pierden el miedo.',
  },
]

// Lunes a viernes 8:00 a. m. a 6:00 p. m.; sábado hasta la 1:00 p. m.
export const HORARIO = [
  { dias: 'Lunes a viernes', horas: '8:00 a. m. – 6:00 p. m.' },
  { dias: 'Sábado', horas: '8:00 a. m. – 1:00 p. m.' },
  { dias: 'Domingo', horas: 'Cerrado (urgencias por WhatsApp)' },
]

export const TURNOS = {
  semana: ['8:00 a. m.', '9:00 a. m.', '10:00 a. m.', '11:00 a. m.', '2:00 p. m.', '3:00 p. m.', '4:00 p. m.', '5:00 p. m.'],
  sabado: ['8:00 a. m.', '9:00 a. m.', '10:00 a. m.', '11:00 a. m.', '12:00 p. m.'],
}
