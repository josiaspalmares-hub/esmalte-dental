import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MOTIVOS, tratamiento } from '@/datos'
import type { EstadoTasa } from '@/lib/moneda'
import { Precio } from '@/components/Precio'
import { cn } from '@/lib/utils'

const urgencia = encodeURIComponent('Hola, Clínica Dental El Rosal. Tengo una urgencia: me duele mucho y tengo hinchazón.')

export function Guia({ tasa, alAgendar }: { tasa: EstadoTasa; alAgendar: (tratamientoId: string) => void }) {
  const [elegido, setElegido] = useState(MOTIVOS[0].id)
  const reducir = useReducedMotion()
  const respuesta = useRef<HTMLDivElement>(null)

  // En el teléfono la respuesta queda debajo de la lista: se lleva a la vista
  function elegir(id: string) {
    setElegido(id)
    if (matchMedia('(max-width: 1023px)').matches) {
      requestAnimationFrame(() => respuesta.current?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' }))
    }
  }
  const motivo = MOTIVOS.find((m) => m.id === elegido) ?? MOTIVOS[0]
  const agendar = tratamiento(motivo.agendar)

  return (
    <section id="guia" className="bg-pino py-16 text-marfil md:py-24" aria-labelledby="guia-titulo">
      <div className="contenedor grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 id="guia-titulo" className="titular text-4xl leading-tight md:text-5xl">¿Qué te trae por aquí?</h2>
          <p className="mt-4 max-w-md text-marfil/80">Elige lo que te pasa y te decimos qué se hace, cuánto tarda y cuánto cuesta.</p>
          <div className="mt-8 grid gap-2" role="group" aria-label="Motivo de la consulta">
            {MOTIVOS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={m.id === elegido}
                onClick={() => elegir(m.id)}
                className={cn(
                  'flex min-h-[52px] items-center justify-between rounded-[var(--radius-campo)] border px-4 text-left text-[1.02rem] transition-colors',
                  m.id === elegido ? 'border-marfil bg-marfil text-pino' : 'border-marfil/25 hover:border-marfil/60',
                )}
              >
                {m.titulo}
                <span aria-hidden="true" className={cn('text-xl transition-transform', m.id === elegido && 'translate-x-1')}>›</span>
              </button>
            ))}
          </div>
        </div>

        <div ref={respuesta} aria-live="polite" className="scroll-mt-20 lg:pt-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={motivo.id}
              initial={reducir ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducir ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[var(--radius-tarjeta)] bg-pino-2 p-6 md:p-9"
            >
              <h3 className="titular text-3xl">{motivo.titulo}</h3>
              <p className="mt-4 text-lg leading-relaxed text-marfil/90">{motivo.respuesta}</p>

              <ol className="mt-7 grid gap-3">
                {motivo.pasos.map((paso, i) => (
                  <li key={paso} className="flex gap-4">
                    <span className="titular w-6 shrink-0 text-xl text-marfil/60">{i + 1}</span>
                    <span>{paso}</span>
                  </li>
                ))}
              </ol>

              <ul className="mt-8 divide-y divide-marfil/15 border-y border-marfil/15">
                {motivo.tratamientos.map((id) => {
                  const t = tratamiento(id)
                  return (
                    <li key={id} className="flex items-center justify-between gap-6 py-3">
                      <span>
                        <span className="block font-semibold">{t.nombre}</span>
                        <span className="text-sm text-marfil/75">{t.duracion}</span>
                      </span>
                      <Precio monto={t.precio} desde={t.desde} tasa={tasa} claro />
                    </li>
                  )
                })}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <button type="button" className="boton boton--principal" onClick={() => alAgendar(agendar.id)}>
                  Pedir cita: {agendar.nombre.toLowerCase()}
                </button>
                {motivo.urgente && (
                  <a className="text-marfil underline underline-offset-4" href={`https://wa.me/?text=${urgencia}`} target="_blank" rel="noopener">
                    ¿Hinchazón o fiebre? Escríbenos ya
                  </a>
                )}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
