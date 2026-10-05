import { cn } from '@/lib/utils'

interface PanelSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function PanelSection({ title, children, className }: PanelSectionProps) {
  return (
    <section className={cn('flex flex-col gap-2', className)} aria-label={title}>
      <h2 className="px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl border bg-card">{children}</div>
    </section>
  )
}

export function PanelRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0', className)}>
      {children}
    </div>
  )
}
