import { bolivares, dolares, type EstadoTasa } from '@/lib/moneda'
import { cn } from '@/lib/utils'

export function Precio({ monto, desde, tasa, className, claro = false }: { monto: number; desde?: boolean; tasa: EstadoTasa; className?: string; claro?: boolean }) {
  return (
    <span className={cn('inline-grid justify-items-end text-right', className)}>
      <span className="font-semibold tabular-nums">
        {desde && <span className={cn('mr-1 text-sm font-normal', claro ? 'text-marfil/75' : 'text-salvia')}>desde</span>}
        {dolares(monto)}
      </span>
      <span className={cn('text-sm whitespace-nowrap tabular-nums', claro ? 'text-marfil/75' : 'text-salvia')}>
        {tasa.tasa ? bolivares(monto, tasa.tasa) : tasa.fallo ? 'Bs a la tasa BCV' : '…'}
      </span>
    </span>
  )
}
