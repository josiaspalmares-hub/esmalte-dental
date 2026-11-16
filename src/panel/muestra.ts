// Datos de muestra del panel. Se arman alrededor de la hora actual para que
// siempre haya alguien por llegar, sin importar a qué hora se abra.

import type { Solicitud } from '@/lib/solicitudes'

export type EstadoCita = 'por-llegar' | 'en-sala' | 'en-sillon' | 'atendida' | 'no-vino'

export type Cita = {
  id: string
  hora: number // minutos desde medianoche
  paciente: string
  telefono: string
  tratamiento: string
  dentista: 'Dr. Salcedo' | 'Dra. Rondón'
  monto: number
  estado: EstadoCita
  pagada: boolean
}

const BASE: Omit<Cita, 'id' | 'hora' | 'estado' | 'pagada'>[] = [
  { paciente: 'María Fernanda G.', telefono: '0414-0000001', tratamiento: 'Limpieza', dentista: 'Dra. Rondón', monto: 35 },
  { paciente: 'José Luis P.', telefono: '0424-0000002', tratamiento: 'Control de brackets', dentista: 'Dr. Salcedo', monto: 35 },
  { paciente: 'Carmen R.', telefono: '0412-0000003', tratamiento: 'Tratamiento de conducto', dentista: 'Dra. Rondón', monto: 150 },
  { paciente: 'Luis Alejandro M.', telefono: '0416-0000004', tratamiento: 'Evaluación con radiografía', dentista: 'Dr. Salcedo', monto: 25 },
  { paciente: 'Daniela S.', telefono: '0414-0000005', tratamiento: 'Blanqueamiento', dentista: 'Dra. Rondón', monto: 180 },
  { paciente: 'Andrés V.', telefono: '0426-0000006', tratamiento: 'Empaste de resina', dentista: 'Dr. Salcedo', monto: 40 },
  { paciente: 'Sofía (8 años) y su mamá', telefono: '0424-0000007', tratamiento: 'Consulta para niños', dentista: 'Dra. Rondón', monto: 25 },
  { paciente: 'Ricardo T.', telefono: '0412-0000008', tratamiento: 'Muela del juicio', dentista: 'Dr. Salcedo', monto: 120 },
]

export function citasDeHoy(ahora = new Date()): Cita[] {
  const minutos = ahora.getHours() * 60 + ahora.getMinutes()
  const inicio = Math.min(Math.max(Math.floor((minutos - 150) / 30) * 30, 8 * 60), 12 * 60) // la última cita termina antes de las 6:00 p. m.
  return BASE.map((c, i) => {
    const hora = inicio + i * 45
    const pasada = hora + 40 < minutos
    const estado: EstadoCita = pasada ? (i === 1 ? 'no-vino' : 'atendida') : hora <= minutos ? 'en-sillon' : 'por-llegar'
    return { ...c, id: `c${i}`, hora, estado, pagada: pasada && i !== 2 && i !== 1 }
  })
}

export function solicitudesDeMuestra(): Solicitud[] {
  const hace = (min: number) => new Date(Date.now() - min * 60000).toISOString()
  return [
    { id: 'm1', creada: hace(18), nombre: 'Gabriela N.', telefono: '0414-0000011', tratamiento: 'Evaluación con radiografía', dentista: 'Cualquiera', dia: 'mañana', hora: '9:00 a. m.', estado: 'nueva', muestra: true },
    { id: 'm2', creada: hace(95), nombre: 'Pedro A.', telefono: '0424-0000012', tratamiento: 'Limpieza', dentista: 'Dra. Valeria Rondón', dia: 'el sábado', hora: '10:00 a. m.', estado: 'nueva', muestra: true },
  ]
}

// Horas ocupadas por día de esta semana (de 9 posibles por dentista, 2 dentistas)
export const SEMANA = [
  { dia: 'Lun', ocupadas: 15 },
  { dia: 'Mar', ocupadas: 11 },
  { dia: 'Mié', ocupadas: 17 },
  { dia: 'Jue', ocupadas: 8 },
  { dia: 'Vie', ocupadas: 16 },
  { dia: 'Sáb', ocupadas: 6, capacidad: 10 },
]
export const CAPACIDAD_DIA = 18

export const horaTexto = (min: number) => {
  const h24 = Math.floor(min / 60)
  const m = String(((min % 60) + 60) % 60).padStart(2, '0')
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${m} ${h24 < 12 ? 'a. m.' : 'p. m.'}`
}
