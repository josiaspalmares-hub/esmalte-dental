import { cn } from '@/lib/utils'

// Muela dibujada con una sola línea: es el logo y la firma de la marca
export function Muela({ className, dibujar = false }: { className?: string; dibujar?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path
        pathLength={1}
        className={cn(dibujar && 'muela-trazo')}
        d="M9.5 4C5.6 4 3.6 7 4.1 11c.4 3 2 5 2.4 9 .5 5 1.6 8 3 8s2.1-3 2.5-6c.4-2.2 1.5-3.2 4-3.2s3.6 1 4 3.2c.4 3 1.1 6 2.5 6s2.5-3 3-8c.4-4 2-6 2.4-9 .5-4-1.5-7-5.4-7-2.6 0-4 1.3-6.5 1.3S12.1 4 9.5 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Logo({ dibujar = false, className }: { dibujar?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <Muela className="size-7" dibujar={dibujar} />
      <span className="grid leading-none">
        <span className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase">Clínica Dental</span>
        <span className="titular text-2xl">El Rosal</span>
      </span>
    </span>
  )
}
