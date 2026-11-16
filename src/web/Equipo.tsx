import { DENTISTAS } from '@/datos'

export function Equipo() {
  return (
    <section id="equipo" className="contenedor py-16 md:py-24" aria-labelledby="equipo-titulo">
      <div className="max-w-2xl">
        <h2 id="equipo-titulo" className="titular text-4xl leading-tight md:text-5xl">Quién te va a atender</h2>
        <p className="mt-4 text-salvia">Somos dos. Siempre sabes de antemano con quién es tu cita.</p>
      </div>
      <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8">
        {DENTISTAS.map((d, i) => (
          <article key={d.id} className={i === 1 ? 'md:mt-20' : undefined}>
            <img
              src={`/img/${d.foto}-640.webp`}
              srcSet={`/img/${d.foto}-640.webp 640w, /img/${d.foto}-1200.webp 1200w`}
              sizes="(max-width: 767px) 92vw, 45vw"
              width={640}
              height={800}
              loading="lazy"
              alt={`Retrato de ${d.nombre}`}
              className="aspect-[4/5] w-full rounded-[var(--radius-tarjeta)] object-cover object-top"
            />
            <h3 className="titular mt-5 text-3xl">{d.nombre}</h3>
            <p className="mt-1 font-semibold text-coral">{d.rol}</p>
            <p className="mt-3 max-w-md text-salvia">{d.texto}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
