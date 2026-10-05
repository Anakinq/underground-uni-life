import { cn } from '@/lib/utils'

interface StatMeterProps {
  label: string
  value: number
  /** For stats where high is bad (e.g. stress). */
  inverted?: boolean
}

function toneFor(value: number, inverted: boolean): string {
  const goodness = inverted ? 100 - value : value
  if (goodness >= 60) return 'bg-chart-2'
  if (goodness >= 30) return 'bg-chart-3'
  return 'bg-destructive'
}

export function StatMeter({ label, value, inverted = false }: StatMeterProps) {
  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between text-[0.6875rem]">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn('h-full rounded-full transition-all', toneFor(value, inverted))}
          style={{ width: `${value}%` }}
        />
      </div>
    </li>
  )
}
