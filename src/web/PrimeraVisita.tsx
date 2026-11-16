const PASOS = [
  { min: '5 min', titulo: 'Llegas a la sala, no al sillón', texto: 'Llenas una hoja corta de salud mientras te ofrecemos agua o café.' },
  { min: '10 min', titulo: 'Conversamos', texto: 'Nos cuentas qué te molesta o qué te gustaría cambiar. Sin apuros.' },
  { min: '20 min', titulo: 'Revisión y radiografía', texto: 'Revisamos diente por diente. No hay agujas ni nada que duela en esta parte.' },
  { min: '5 min', titulo: 'Te llevas tu plan', texto: 'Por escrito: qué hace falta, en qué orden y cuánto cuesta cada paso. Tú decides si empiezas ese día.' },
]

export function PrimeraVisita() {
  return (
    <section id="primera-visita" className="bg-marfil-2 py-16 md:py-24" aria-labelledby="visita-titulo">
      <div className="contenedor grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <img
          src="/img/primera-visita-1200.webp"
          srcSet="/img/primera-visita-640.webp 640w, /img/primera-visita-1200.webp 1200w"
          sizes="(max-width: 1023px) 92vw, 46vw"
          width={1200}
          height={800}
          loading="lazy"
          alt="La dentista le muestra la radiografía en una pantalla a la paciente"
          className="aspect-[4/3] w-full rounded-[var(--radius-tarjeta)] object-cover lg:order-2"
        />
        <div>
          <h2 id="visita-titulo" className="titular text-4xl leading-tight md:text-5xl">Tu primera visita, minuto a minuto</h2>
          <p className="mt-4 max-w-lg text-salvia">Son 40 minutos. Lo contamos aquí para que llegues sabiendo qué va a pasar.</p>
          <ol className="mt-8 grid gap-6">
            {PASOS.map((p) => (
              <li key={p.titulo} className="grid grid-cols-[72px_1fr] gap-4">
                <span className="titular pt-0.5 text-xl text-coral-2">{p.min}</span>
                <span>
                  <span className="block text-lg font-semibold">{p.titulo}</span>
                  <span className="block text-salvia">{p.texto}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
