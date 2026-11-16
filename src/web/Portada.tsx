import { BlurFade } from '@/components/ui/blur-fade'
import { CLINICA } from '@/datos'

const mensaje = encodeURIComponent('Hola Esmalte, quiero información para una cita.')

export function Portada() {
  return (
    <section className="contenedor grid items-center gap-10 pt-8 pb-16 md:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24">
      <div>
        <BlurFade delay={0.05}>
          <p className="text-salvia">Clínica dental en El Rosal, Caracas</p>
        </BlurFade>
        <BlurFade delay={0.12}>
          <h1 className="titular mt-4 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem]">
            Sabes cuánto cuesta antes de sentarte en el sillón.
          </h1>
        </BlurFade>
        <BlurFade delay={0.2}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-salvia">
            La evaluación con radiografía cuesta <strong className="text-pino">$25</strong>. Ese mismo día te decimos qué necesitas, cuánto cuesta cada paso y cuánto tarda, por escrito.
          </p>
        </BlurFade>
        <BlurFade delay={0.28}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="boton boton--principal" href="#agendar">Pedir mi cita</a>
            <a className="boton boton--borde" href={`https://wa.me/${CLINICA.whatsapp}?text=${mensaje}`} target="_blank" rel="noopener">
              Escribir por WhatsApp
            </a>
          </div>
        </BlurFade>
        <dl className="mt-10 grid max-w-xl grid-cols-1 gap-x-8 gap-y-3 border-t border-linea pt-6 text-[0.95rem] sm:grid-cols-3">
          <div><dt className="text-salvia">Horario</dt><dd className="font-semibold">Lunes a sábado</dd></div>
          <div><dt className="text-salvia">Si te duele</dt><dd className="font-semibold">Te vemos hoy o mañana</dd></div>
          <div><dt className="text-salvia">Pagos</dt><dd className="font-semibold">Pago móvil, Zelle, efectivo</dd></div>
        </dl>
      </div>

      <figure className="relative">
        <img
          src="/img/consulta-1200.webp"
          srcSet="/img/consulta-640.webp 640w, /img/consulta-1200.webp 1200w"
          sizes="(max-width: 1023px) 92vw, 48vw"
          width={1200}
          height={800}
          alt="El Dr. Salcedo le explica a un paciente con un modelo de dientes antes de empezar"
          fetchPriority="high"
          className="aspect-[4/3] w-full rounded-[var(--radius-tarjeta)] object-cover object-[70%_center] lg:aspect-[4/5]"
        />
        <figcaption className="mt-3 text-sm text-salvia">
          Antes de empezar, te explicamos con un modelo qué vamos a hacer.
        </figcaption>
      </figure>
    </section>
  )
}
