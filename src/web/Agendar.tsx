import { useMemo, useState, type FormEvent } from 'react'
import { CLINICA, DENTISTAS, TRATAMIENTOS, TURNOS, tratamiento } from '@/datos'
import { agregarSolicitud, telefonoValido, type Solicitud } from '@/lib/solicitudes'
import { cn } from '@/lib/utils'

const DIAS_A_MOSTRAR = 12
const fmtDia = new Intl.DateTimeFormat('es-VE', { weekday: 'short', day: 'numeric', month: 'short' })
const fmtLargo = new Intl.DateTimeFormat('es-VE', { weekday: 'long', day: 'numeric', month: 'long' })

// Próximos días hábiles (sin domingos)
function proximosDias(): Date[] {
  const dias: Date[] = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  while (dias.length < DIAS_A_MOSTRAR) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) dias.push(new Date(d))
  }
  return dias
}

type Errores = Partial<Record<'nombre' | 'telefono' | 'dia' | 'hora', string>>

export function Agendar({ tratamientoId, alCambiarTratamiento }: { tratamientoId: string; alCambiarTratamiento: (id: string) => void }) {
  const dias = useMemo(proximosDias, [])
  const [dentista, setDentista] = useState('cualquiera')
  const [dia, setDia] = useState<string>('')
  const [hora, setHora] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [errores, setErrores] = useState<Errores>({})
  const [enviada, setEnviada] = useState<Solicitud | null>(null)

  const fechaElegida = dias.find((d) => d.toISOString() === dia)
  const horas = fechaElegida?.getDay() === 6 ? TURNOS.sabado : TURNOS.semana
  const grupos = [...new Set(TRATAMIENTOS.map((t) => t.grupo))]

  function validar(): Errores {
    const e: Errores = {}
    if (nombre.trim().length < 2) e.nombre = 'Escribe tu nombre.'
    if (!telefonoValido(telefono)) e.telefono = 'Escribe un teléfono como 0414-1234567.'
    if (!fechaElegida) e.dia = 'Elige un día.'
    if (!hora) e.hora = 'Elige una hora.'
    return e
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const e = validar()
    setErrores(e)
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>(`[data-campo="${Object.keys(e)[0]}"]`)?.focus()
      return
    }
    const t = tratamiento(tratamientoId)
    const quien = DENTISTAS.find((d) => d.id === dentista)?.nombre ?? 'Cualquiera'
    const cuando = fmtLargo.format(fechaElegida!)
    const solicitud = agregarSolicitud({ nombre: nombre.trim(), telefono: telefono.trim(), tratamiento: t.nombre, dentista: quien, dia: cuando, hora })
    const texto = `Hola Esmalte, quiero pedir una cita.\n\nTratamiento: ${t.nombre}\nCon: ${quien}\nDía: ${cuando}\nHora: ${hora}\nNombre: ${solicitud.nombre}\nTeléfono: ${solicitud.telefono}`
    window.open(`https://wa.me/${CLINICA.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
    setEnviada(solicitud)
  }

  if (enviada) {
    return (
      <section id="agendar" className="bg-marfil-2 py-16 md:py-24" aria-labelledby="agendar-titulo">
        <div className="contenedor max-w-2xl" role="status">
          <h2 id="agendar-titulo" className="titular text-4xl leading-tight md:text-5xl">Listo, {enviada.nombre}.</h2>
          <p className="mt-4 text-lg text-salvia">
            Te abrimos WhatsApp con tu pedido de cita para <strong className="text-pino">{enviada.tratamiento.toLowerCase()}</strong> el {enviada.dia} a las {enviada.hora}. Envía el mensaje y te confirmamos en horario de consulta.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="boton boton--pino" href="/panel.html">Ver cómo le llega a la clínica</a>
            <button type="button" className="boton boton--borde" onClick={() => { setEnviada(null); setHora(''); setDia('') }}>Pedir otra cita</button>
          </div>
          <p className="mt-4 text-sm text-salvia">El panel es de muestra: tu pedido se ve ahí porque quedó guardado solo en este navegador.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="agendar" className="bg-marfil-2 py-16 md:py-24" aria-labelledby="agendar-titulo">
      <div className="contenedor grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <h2 id="agendar-titulo" className="titular text-4xl leading-tight md:text-5xl">Pide tu cita</h2>
          <p className="mt-4 max-w-sm text-salvia">Elige qué necesitas y cuándo te queda bien. Te confirmamos por WhatsApp, normalmente en menos de una hora en horario de consulta.</p>
          <p className="mt-6 max-w-sm text-sm text-salvia">
            Tu nombre y teléfono solo se usan para confirmar la cita. <a className="underline underline-offset-2" href="/privacidad.html">Privacidad</a>
          </p>
        </div>

        <form noValidate onSubmit={enviar} className="grid min-w-0 gap-7 rounded-[var(--radius-tarjeta)] bg-papel p-5 md:p-8">
          <label className="campo">
            <span>Tratamiento</span>
            <select value={tratamientoId} onChange={(e) => alCambiarTratamiento(e.target.value)}>
              {grupos.map((g) => (
                <optgroup key={g} label={g}>
                  {TRATAMIENTOS.filter((t) => t.grupo === g).map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </optgroup>
              ))}
            </select>
          </label>

          <fieldset className="grid min-w-0 gap-2">
            <legend className="mb-2 font-semibold">Con quién</legend>
            <div className="flex flex-wrap gap-2">
              {[{ id: 'cualquiera', nombre: 'Quien tenga la hora más pronto' }, ...DENTISTAS].map((d) => (
                <label key={d.id} className={cn('relative cursor-pointer rounded-full border px-4 py-2.5 text-[0.95rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-coral', dentista === d.id ? 'border-pino bg-pino text-marfil' : 'border-linea hover:border-pino')}>
                  <input type="radio" name="dentista" value={d.id} checked={dentista === d.id} onChange={() => setDentista(d.id)} className="sr-only" />
                  {d.nombre}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="mb-3 font-semibold">Día</legend>
            <div data-campo="dia" tabIndex={-1} className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 outline-none">
              {dias.map((d) => {
                const valor = d.toISOString()
                return (
                  <label key={valor} className={cn('relative min-w-[86px] shrink-0 cursor-pointer snap-start rounded-[var(--radius-campo)] border px-3 py-2.5 text-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-coral', dia === valor ? 'border-pino bg-pino text-marfil' : 'border-linea hover:border-pino')}>
                    <input type="radio" name="dia" value={valor} checked={dia === valor} onChange={() => { setDia(valor); setHora(''); setErrores((x) => ({ ...x, dia: undefined })) }} className="sr-only" />
                    <span className="block text-sm capitalize">{fmtDia.format(d).split(' ')[0].replace('.', '')}</span>
                    <span className="block font-semibold">{fmtDia.format(d).split(' ').slice(1).join(' ')}</span>
                  </label>
                )
              })}
            </div>
            {errores.dia && <p className="mt-2 text-sm font-semibold text-alerta">{errores.dia}</p>}
          </fieldset>

          <fieldset disabled={!fechaElegida} className="min-w-0">
            <legend className="mb-3 font-semibold">Hora</legend>
            {!fechaElegida ? (
              <p className="text-salvia">Primero elige el día.</p>
            ) : (
              <div data-campo="hora" tabIndex={-1} className="grid grid-cols-3 gap-2 outline-none sm:grid-cols-4">
                {horas.map((h) => (
                  <label key={h} className={cn('relative cursor-pointer rounded-[var(--radius-campo)] border px-2 py-3 text-center text-[0.95rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-coral', hora === h ? 'border-pino bg-pino text-marfil' : 'border-linea hover:border-pino')}>
                    <input type="radio" name="hora" value={h} checked={hora === h} onChange={() => { setHora(h); setErrores((x) => ({ ...x, hora: undefined })) }} className="sr-only" />
                    {h}
                  </label>
                ))}
              </div>
            )}
            {errores.hora && <p className="mt-2 text-sm font-semibold text-alerta">{errores.hora}</p>}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="campo">
              <span>Nombre</span>
              <input data-campo="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40} autoComplete="given-name" aria-invalid={!!errores.nombre} aria-describedby="error-nombre" />
              {errores.nombre && <span id="error-nombre" className="text-sm font-semibold text-alerta">{errores.nombre}</span>}
            </label>
            <label className="campo">
              <span>Teléfono (WhatsApp)</span>
              <input data-campo="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} type="tel" inputMode="tel" placeholder="0414-1234567" maxLength={14} autoComplete="tel-national" aria-invalid={!!errores.telefono} aria-describedby="error-telefono" />
              {errores.telefono && <span id="error-telefono" className="text-sm font-semibold text-alerta">{errores.telefono}</span>}
            </label>
          </div>

          <button type="submit" className="boton boton--principal w-full sm:w-auto sm:justify-self-start">Enviar por WhatsApp</button>
        </form>
      </div>
    </section>
  )
}
