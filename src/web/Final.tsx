import { CLINICA, HORARIO } from '@/datos'
import { Logo } from '@/components/Marca'

const PREGUNTAS = [
  { p: '¿Duele?', r: 'La evaluación no duele: no hay agujas. Para empastes, conductos o extracciones usamos anestesia local antes de empezar, y paramos cuando levantes la mano.' },
  { p: '¿Atienden urgencias?', r: 'Sí. Si te duele, te vemos el mismo día o el siguiente. Si tienes hinchazón o fiebre, escríbenos por WhatsApp aunque sea domingo.' },
  { p: '¿Cómo puedo pagar?', r: 'Pago móvil, transferencia, Zelle o efectivo. En bolívares, a la tasa del BCV del día. Los tratamientos largos, como la ortodoncia, se pagan por partes.' },
  { p: '¿Aceptan seguros?', r: 'Te damos factura e informe para que tu seguro te reembolse. Pregúntanos por tu seguro antes de la cita.' },
  { p: '¿Desde qué edad atienden niños?', r: 'Desde los 3 años. La primera cita es corta y sin pinchazos, para que conozca el consultorio.' },
  { p: '¿Cuánto dura el blanqueamiento?', r: 'Entre 1 y 3 años, según lo que comas y bebas. Café, té, vino y cigarro lo acortan.' },
]

const bbox = '-66.8625,10.4885,-66.8523,10.4949'

export function Ubicacion() {
  return (
    <section id="ubicacion" className="contenedor grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16" aria-labelledby="ubicacion-titulo">
      <div>
        <h2 id="ubicacion-titulo" className="titular text-4xl leading-tight md:text-5xl">Dónde estamos</h2>
        <p className="mt-4 text-lg">{CLINICA.direccion}</p>
        <p className="mt-2 text-salvia">A 4 cuadras del metro de Chacao. Estacionamiento en el edificio.</p>
        <table className="mt-8 w-full max-w-md text-left">
          <caption className="solo-lector">Horario</caption>
          <tbody>
            {HORARIO.map((h) => (
              <tr key={h.dias} className="border-b border-linea">
                <th scope="row" className="py-3 pr-6 font-semibold">{h.dias}</th>
                <td className="py-3 text-salvia">{h.horas}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a className="boton boton--borde mt-8" href={CLINICA.como_llegar} target="_blank" rel="noopener">Cómo llegar</a>
      </div>
      <iframe
        title="Mapa de la ubicación de la Clínica Dental El Rosal"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=10.4917,-66.8574`}
        loading="lazy"
        className="aspect-[4/3] w-full rounded-[var(--radius-tarjeta)] border border-linea lg:aspect-auto lg:h-full lg:min-h-[420px]"
      />
    </section>
  )
}

export function Preguntas() {
  return (
    <section id="preguntas" className="contenedor grid gap-8 pb-16 md:pb-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16" aria-labelledby="preguntas-titulo">
      <h2 id="preguntas-titulo" className="titular text-4xl leading-tight md:text-5xl">Lo que más nos preguntan</h2>
      <div className="border-t border-pino">
        {PREGUNTAS.map((x) => (
          <details key={x.p} className="group border-b border-linea">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {x.p}
              <span aria-hidden="true" className="text-2xl leading-none text-coral transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="max-w-2xl pb-5 text-salvia">{x.r}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function Pie() {
  return (
    <footer className="bg-pino text-marfil">
      <div className="contenedor grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Logo />
          <p className="mt-4 max-w-xl text-marfil/80">
            <strong className="text-marfil">Proyecto de muestra.</strong> La Clínica Dental El Rosal es una clínica ficticia hecha por{' '}
            <a className="underline underline-offset-2" href="https://josias-palmares.vercel.app" target="_blank" rel="noopener">Josías Palmares</a>{' '}
            para su portafolio. Nombres, precios y dirección son de ejemplo.
          </p>
          <p className="mt-3 text-sm text-marfil/70">
            Fotos: <a className="underline" href="https://www.pexels.com" target="_blank" rel="noopener">Pexels</a> · Mapa: <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · Tasa: <a className="underline" href="https://ve.dolarapi.com" target="_blank" rel="noopener">DolarApi</a>
          </p>
        </div>
        <nav aria-label="Enlaces del pie" className="flex flex-wrap gap-x-6 gap-y-2">
          <a className="underline-offset-4 hover:underline" href="/privacidad.html">Privacidad</a>
          <a className="underline-offset-4 hover:underline" href="/panel.html">Panel de la clínica</a>
        </nav>
      </div>
    </footer>
  )
}
