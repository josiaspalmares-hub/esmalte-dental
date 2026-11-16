import { TRATAMIENTOS, type Tratamiento } from '@/datos'
import type { EstadoTasa } from '@/lib/moneda'
import { Precio } from '@/components/Precio'

const grupos = [...new Set(TRATAMIENTOS.map((t) => t.grupo))]
const deGrupo = (g: Tratamiento['grupo']) => TRATAMIENTOS.filter((t) => t.grupo === g)

export function Precios({ tasa }: { tasa: EstadoTasa }) {
  return (
    <section id="precios" className="contenedor grid gap-10 py-16 md:py-24 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16" aria-labelledby="precios-titulo">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <h2 id="precios-titulo" className="titular text-4xl leading-tight md:text-5xl">Lo que cuesta cada tratamiento</h2>
        <p className="mt-4 max-w-md text-salvia">
          Son precios de referencia. El precio exacto de tu caso te lo damos por escrito en la evaluación, antes de empezar nada.
        </p>
        <p className="mt-3 text-sm text-salvia">
          {tasa.tasa ? 'Los bolívares se calculan con la tasa oficial del BCV de hoy.' : tasa.fallo ? 'No pudimos cargar la tasa del BCV: se cobra a la tasa del día.' : 'Cargando la tasa del BCV…'}
        </p>
        <img
          src="/img/sonrisa-640.webp"
          srcSet="/img/sonrisa-640.webp 640w, /img/sonrisa-1200.webp 1200w"
          sizes="(max-width: 1023px) 92vw, 34vw"
          width={640}
          height={427}
          loading="lazy"
          alt="Una paciente sonríe después de un blanqueamiento"
          className="mt-8 hidden aspect-[4/3] w-full rounded-[var(--radius-tarjeta)] object-cover lg:block"
        />
      </div>

      <div className="grid gap-12">
        {grupos.map((g) => (
          <div key={g}>
            <h3 className="border-b border-pino pb-2 text-sm font-semibold tracking-wide text-salvia uppercase">{g}</h3>
            <ul>
              {deGrupo(g).map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-6 border-b border-linea py-4">
                  <span>
                    <span className="block text-lg font-semibold">{t.nombre}</span>
                    <span className="block max-w-md text-[0.95rem] text-salvia">{t.detalle}</span>
                    <span className="mt-1 block text-sm text-salvia">{t.duracion}</span>
                  </span>
                  <Precio monto={t.precio} desde={t.desde} tasa={tasa} className="text-lg" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
