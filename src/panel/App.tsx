import { useEffect, useMemo, useState } from 'react'
import { AnimatedList } from '@/components/ui/animated-list'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Logo } from '@/components/Marca'
import { CLINICA } from '@/datos'
import { guardarSolicitudes, leerSolicitudes, type Solicitud } from '@/lib/solicitudes'
import { cn } from '@/lib/utils'
import { CAPACIDAD_DIA, SEMANA, citasDeHoy, horaTexto, solicitudesDeMuestra, type Cita, type EstadoCita } from './muestra'

const CLAVE_CITAS = 'esmalte:citas-hoy'
const fmtHoy = new Intl.DateTimeFormat('es-VE', { weekday: 'long', day: 'numeric', month: 'long' })
const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)
const wa = (telefono: string, texto: string) => `https://wa.me/58${telefono.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(texto)}`

const ETIQUETA: Record<EstadoCita, string> = {
  'por-llegar': 'Por llegar',
  'en-sala': 'En la sala',
  'en-sillon': 'En el sillón',
  atendida: 'Atendida',
  'no-vino': 'No vino',
}
const SIGUIENTE: Partial<Record<EstadoCita, { a: EstadoCita; texto: string }>> = {
  'por-llegar': { a: 'en-sala', texto: 'Llegó' },
  'en-sala': { a: 'en-sillon', texto: 'Pasar al sillón' },
  'en-sillon': { a: 'atendida', texto: 'Terminó' },
}

function leerCitas(): Cita[] {
  const crudo = sessionStorage.getItem(CLAVE_CITAS)
  return crudo ? (JSON.parse(crudo) as Cita[]) : citasDeHoy()
}

export function App() {
  const [citas, setCitas] = useState<Cita[]>(leerCitas)
  const [propias, setPropias] = useState<Solicitud[]>(leerSolicitudes)
  const [muestra, setMuestra] = useState<Solicitud[]>(solicitudesDeMuestra)
  const [ahora, setAhora] = useState(() => new Date())

  useEffect(() => { sessionStorage.setItem(CLAVE_CITAS, JSON.stringify(citas)) }, [citas])
  useEffect(() => {
    const reloj = setInterval(() => setAhora(new Date()), 30000)
    const alVolver = () => setPropias(leerSolicitudes())
    window.addEventListener('focus', alVolver)
    return () => { clearInterval(reloj); window.removeEventListener('focus', alVolver) }
  }, [])

  const minutos = ahora.getHours() * 60 + ahora.getMinutes()
  const proxima = citas.find((c) => c.estado === 'por-llegar' || c.estado === 'en-sala')
  const enSillon = citas.filter((c) => c.estado === 'en-sillon')
  const porCobrar = citas.filter((c) => c.estado === 'atendida' && !c.pagada)
  const totalPorCobrar = porCobrar.reduce((s, c) => s + c.monto, 0)
  const pendientes = useMemo(() => [...propias, ...muestra].filter((s) => s.estado === 'nueva'), [propias, muestra])

  const cambiar = (id: string, cambios: Partial<Cita>) => setCitas((cs) => cs.map((c) => (c.id === id ? { ...c, ...cambios } : c)))

  function responder(s: Solicitud, estado: Solicitud['estado']) {
    if (s.muestra) setMuestra((l) => l.map((x) => (x.id === s.id ? { ...x, estado } : x)))
    else {
      const lista = propias.map((x) => (x.id === s.id ? { ...x, estado } : x))
      setPropias(lista)
      guardarSolicitudes(lista)
    }
  }

  function reiniciar() {
    sessionStorage.removeItem(CLAVE_CITAS)
    setCitas(citasDeHoy())
    setMuestra(solicitudesDeMuestra())
    const lista = propias.map((x) => ({ ...x, estado: 'nueva' as const }))
    setPropias(lista)
    guardarSolicitudes(lista)
  }

  return (
    <div className="min-h-dvh bg-marfil">
      <aside aria-label="Aviso de muestra" className="border-b border-coral/30 bg-[#f7e7df] text-[0.92rem]">
        <div className="contenedor flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2.5">
          <p>
            <strong>Panel de muestra.</strong> Pacientes y montos son de ejemplo; tus pedidos desde la web aparecen aquí porque se guardan solo en este navegador. En una clínica real este panel pide iniciar sesión.
          </p>
          <button type="button" onClick={reiniciar} className="font-semibold underline underline-offset-4">Reiniciar la muestra</button>
        </div>
      </aside>

      <header className="contenedor flex flex-wrap items-end justify-between gap-4 pt-8 pb-6">
        <div>
          <a href="/" className="text-salvia hover:text-pino"><Logo /></a>
          <h1 className="titular mt-4 text-4xl md:text-5xl">Recepción</h1>
          <p className="mt-1 text-salvia">{mayuscula(fmtHoy.format(ahora))} · {horaTexto(minutos)}</p>
        </div>
        <a href="/" className="boton boton--borde min-h-[44px]">Ver la web de la clínica</a>
      </header>

      <main className="contenedor grid gap-6 pb-16 lg:grid-cols-[1.35fr_1fr]">
        <div className="grid content-start gap-6">
          <Proxima cita={proxima} minutos={minutos} enSillon={enSillon} alCambiar={cambiar} />
          <Agenda citas={citas} alCambiar={cambiar} />
        </div>

        <div className="grid content-start gap-6">
          <Pedidos pendientes={pendientes} alResponder={responder} />
          <PorCobrar citas={porCobrar} total={totalPorCobrar} alCobrar={(id) => cambiar(id, { pagada: true })} />
          <Semana />
        </div>
      </main>
    </div>
  )
}

function Proxima({ cita, minutos, enSillon, alCambiar }: { cita?: Cita; minutos: number; enSillon: Cita[]; alCambiar: (id: string, c: Partial<Cita>) => void }) {
  if (!cita) {
    return (
      <section className="rounded-[var(--radius-tarjeta)] border border-linea bg-papel p-6" aria-labelledby="proxima-titulo">
        <h2 id="proxima-titulo" className="text-sm font-semibold text-salvia">Siguiente paciente</h2>
        <p className="titular mt-2 text-3xl">No queda nadie por llegar hoy.</p>
        <p className="mt-2 text-salvia">Revisa los pedidos de la web a la derecha para llenar los huecos de mañana.</p>
      </section>
    )
  }
  const falta = cita.hora - minutos
  const cuando = falta > 1 ? `en ${falta} min` : falta >= -10 ? 'ahora' : `con ${-falta} min de retraso`
  const paso = SIGUIENTE[cita.estado]
  const recordatorio = `Hola ${cita.paciente.split(' ')[0]}, te escribimos de Esmalte para recordarte tu cita de hoy a las ${horaTexto(cita.hora)} (${cita.tratamiento.toLowerCase()}). ¡Te esperamos!`
  return (
    <section className="relative overflow-hidden rounded-[var(--radius-tarjeta)] bg-pino p-6 text-marfil md:p-8" aria-labelledby="proxima-titulo">
      <h2 id="proxima-titulo" className="text-sm font-semibold text-marfil/75">Siguiente paciente · {cuando}</h2>
      <p className="titular mt-2 text-4xl leading-tight md:text-5xl">{cita.paciente}</p>
      <p className="mt-2 text-lg text-marfil/90">{horaTexto(cita.hora)} · {cita.tratamiento} · {cita.dentista}</p>
      <p className="mt-1 text-marfil/75">{ETIQUETA[cita.estado]}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {paso && <button type="button" className="boton boton--principal" onClick={() => alCambiar(cita.id, { estado: paso.a })}>{paso.texto}</button>}
        {cita.estado === 'por-llegar' && (
          <>
            <a className="boton border border-marfil/40 text-marfil hover:bg-marfil hover:text-pino" href={wa(cita.telefono, recordatorio)} target="_blank" rel="noopener">Recordarle por WhatsApp</a>
            <button type="button" className="px-2 text-marfil/80 underline underline-offset-4 hover:text-marfil" onClick={() => alCambiar(cita.id, { estado: 'no-vino' })}>No vino</button>
          </>
        )}
      </div>
      {enSillon.length > 0 && (
        <p className="mt-6 border-t border-marfil/15 pt-4 text-[0.95rem] text-marfil/80">
          En el sillón ahora: {enSillon.map((c) => `${c.paciente} con ${c.dentista}`).join(' · ')}
        </p>
      )}
    </section>
  )
}

function Agenda({ citas, alCambiar }: { citas: Cita[]; alCambiar: (id: string, c: Partial<Cita>) => void }) {
  return (
    <section className="rounded-[var(--radius-tarjeta)] border border-linea bg-papel p-5 md:p-6" aria-labelledby="agenda-titulo">
      <h2 id="agenda-titulo" className="titular text-2xl">Agenda de hoy</h2>
      <ol className="mt-4 divide-y divide-linea">
        {citas.map((c) => {
          const paso = SIGUIENTE[c.estado]
          const terminada = c.estado === 'atendida' || c.estado === 'no-vino'
          return (
            <li key={c.id} className={cn('grid grid-cols-[84px_1fr] gap-x-4 gap-y-2 py-3.5 sm:grid-cols-[92px_1fr_auto] sm:items-center', terminada && 'text-salvia')}>
              <span className="font-semibold tabular-nums">{horaTexto(c.hora)}</span>
              <span>
                <span className={cn('block font-semibold', c.estado === 'no-vino' && 'line-through decoration-1')}>{c.paciente}</span>
                <span className="block text-sm text-salvia">{c.tratamiento} · {c.dentista}</span>
              </span>
              <span className="col-start-2 flex items-center gap-3 sm:col-start-auto sm:justify-end">
                <span className={cn('text-sm', c.estado === 'en-sillon' || c.estado === 'en-sala' ? 'font-semibold text-ok' : c.estado === 'no-vino' ? 'text-alerta' : 'text-salvia')}>
                  {ETIQUETA[c.estado]}
                </span>
                {paso && (
                  <button type="button" onClick={() => alCambiar(c.id, { estado: paso.a })} className="min-h-[38px] rounded-full border border-pino px-3.5 text-sm font-semibold hover:bg-pino hover:text-marfil">
                    {paso.texto}
                  </button>
                )}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function Pedidos({ pendientes, alResponder }: { pendientes: Solicitud[]; alResponder: (s: Solicitud, e: Solicitud['estado']) => void }) {
  return (
    <section className="rounded-[var(--radius-tarjeta)] border border-linea bg-papel p-5 md:p-6" aria-labelledby="pedidos-titulo">
      <h2 id="pedidos-titulo" className="titular text-2xl">Pedidos desde la web</h2>
      <p className="mt-1 text-sm text-salvia">Confírmalos por WhatsApp para que la persona no reserve en otro lado.</p>
      {pendientes.length === 0 ? (
        <p className="mt-5 text-salvia">
          No hay pedidos sin responder. Pide una cita en <a className="font-semibold text-pino underline underline-offset-2" href="/#agendar">la web de la clínica</a> y vuelve aquí: aparece arriba.
        </p>
      ) : (
        <AnimatedList delay={250} className="mt-4 items-stretch gap-3">
          {pendientes.map((s) => (
            <article key={s.id} className="rounded-[var(--radius-campo)] border border-linea bg-marfil p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-semibold">{s.nombre}</p>
                <p className="shrink-0 text-sm text-salvia">{s.muestra ? 'muestra' : 'desde tu navegador'}</p>
              </div>
              <p className="mt-1 text-[0.95rem]">{s.tratamiento}</p>
              <p className="text-sm text-salvia">{s.dia}, {s.hora} · {s.dentista}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  className="min-h-[40px] content-center rounded-full bg-pino px-4 text-sm font-semibold text-marfil hover:bg-pino-2"
                  href={wa(s.telefono, `Hola ${s.nombre}, te confirmamos tu cita en Esmalte el ${s.dia} a las ${s.hora}: ${s.tratamiento.toLowerCase()}. Estamos en ${CLINICA.direccion}.`)}
                  target="_blank"
                  rel="noopener"
                  onClick={() => alResponder(s, 'confirmada')}
                >
                  Confirmar
                </a>
                <a
                  className="min-h-[40px] content-center rounded-full border border-pino px-4 text-sm font-semibold hover:bg-pino hover:text-marfil"
                  href={wa(s.telefono, `Hola ${s.nombre}, te escribimos de Esmalte. Esa hora ya está tomada; ¿te sirve otra el mismo día?`)}
                  target="_blank"
                  rel="noopener"
                  onClick={() => alResponder(s, 'otra-hora')}
                >
                  Proponer otra hora
                </a>
              </div>
            </article>
          ))}
        </AnimatedList>
      )}
    </section>
  )
}

function PorCobrar({ citas, total, alCobrar }: { citas: Cita[]; total: number; alCobrar: (id: string) => void }) {
  return (
    <section className="rounded-[var(--radius-tarjeta)] border border-linea bg-papel p-5 md:p-6" aria-labelledby="cobrar-titulo">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="cobrar-titulo" className="titular text-2xl">Por cobrar hoy</h2>
        <p className="titular text-3xl tabular-nums">$<NumberTicker value={total} className="text-pino" /></p>
      </div>
      {citas.length === 0 ? (
        <p className="mt-3 text-salvia">Todo lo atendido hoy está cobrado.</p>
      ) : (
        <ul className="mt-3 divide-y divide-linea">
          {citas.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-4 py-3">
              <span>
                <span className="block font-semibold">{c.paciente}</span>
                <span className="block text-sm text-salvia">{c.tratamiento} · ${c.monto}</span>
              </span>
              <button type="button" onClick={() => alCobrar(c.id)} className="min-h-[38px] shrink-0 rounded-full border border-pino px-3.5 text-sm font-semibold hover:bg-pino hover:text-marfil">
                Ya pagó
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Semana() {
  return (
    <section className="rounded-[var(--radius-tarjeta)] border border-linea bg-papel p-5 md:p-6" aria-labelledby="semana-titulo">
      <h2 id="semana-titulo" className="titular text-2xl">¿Qué días tienen huecos esta semana?</h2>
      <p className="mt-1 text-sm text-salvia">Horas ocupadas de las que hay entre los dos dentistas. Ofrece primero los días más vacíos.</p>
      <ul className="mt-5 grid gap-2.5">
        {SEMANA.map((d) => {
          const capacidad = d.capacidad ?? CAPACIDAD_DIA
          const libres = capacidad - d.ocupadas
          return (
            <li key={d.dia} className="grid grid-cols-[40px_1fr_92px] items-center gap-3 text-[0.95rem]">
              <span className="font-semibold">{d.dia}</span>
              <span className="h-3 overflow-hidden rounded-full bg-marfil-2" aria-hidden="true">
                <span className={cn('block h-full rounded-full', libres >= 6 ? 'bg-coral' : 'bg-pino')} style={{ width: `${(d.ocupadas / capacidad) * 100}%` }} />
              </span>
              <span className={cn('text-right', libres >= 6 ? 'font-semibold text-coral' : 'text-salvia')}>{libres} {libres === 1 ? 'libre' : 'libres'}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
