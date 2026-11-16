import { useState } from 'react'
import { Logo } from '@/components/Marca'
import { useTasa } from '@/lib/moneda'
import { Portada } from './Portada'
import { Guia } from './Guia'
import { Precios } from './Precios'
import { PrimeraVisita } from './PrimeraVisita'
import { Equipo } from './Equipo'
import { Agendar } from './Agendar'
import { Pie, Preguntas, Ubicacion } from './Final'

const ENLACES = [
  { href: '#guia', texto: '¿Qué te pasa?' },
  { href: '#precios', texto: 'Precios' },
  { href: '#equipo', texto: 'Equipo' },
  { href: '#ubicacion', texto: 'Ubicación' },
]

export function App() {
  const tasa = useTasa()
  const [tratamientoId, setTratamientoId] = useState('evaluacion')

  function agendar(id: string) {
    setTratamientoId(id)
    document.getElementById('agendar')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  return (
    <>
      <a href="#contenido" className="solo-lector focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-pino focus:p-3 focus:text-marfil">Saltar al contenido</a>
      <header className="sticky top-0 z-30 border-b border-linea bg-marfil/95">
        <div className="contenedor flex h-16 items-center justify-between gap-6">
          <a href="#" aria-label="Esmalte, inicio"><Logo dibujar /></a>
          <nav aria-label="Secciones" className="hidden gap-7 md:flex">
            {ENLACES.map((e) => <a key={e.href} href={e.href} className="text-[0.97rem] text-salvia hover:text-pino">{e.texto}</a>)}
          </nav>
          <a href="#agendar" className="boton boton--principal min-h-[42px] px-5 text-[0.95rem]">Pedir cita</a>
        </div>
      </header>
      <main id="contenido">
        <Portada />
        <Guia tasa={tasa} alAgendar={agendar} />
        <Precios tasa={tasa} />
        <PrimeraVisita />
        <Equipo />
        <Agendar tratamientoId={tratamientoId} alCambiarTratamiento={setTratamientoId} />
        <Ubicacion />
        <Preguntas />
      </main>
      <Pie />
    </>
  )
}
