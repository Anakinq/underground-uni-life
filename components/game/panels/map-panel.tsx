'use client'

import { Footprints } from 'lucide-react'
import { isLocationOpen } from '@/engine/world'
import { messages } from '@/lib/content/messages'
import { useGameStore } from '@/lib/store/game-store'
import { cn } from '@/lib/utils'
import { PanelRow, PanelSection } from './panel-section'

const t = messages.panels.map

export function MapPanel() {
  const game = useGameStore((s) => s.game)
  const pack = useGameStore((s) => s.pack)
  if (!game || !pack) return null

  const here = pack.locations.find((l) => l.id === game.player.locationId)
  if (!here) return null
  const nearby = here.connections
    .map((id) => pack.locations.find((l) => l.id === id))
    .filter((l) => l !== undefined)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold">{pack.meta.name}</h1>
        <p className="text-sm text-muted-foreground">{pack.meta.tagline}</p>
      </div>

      <section aria-label={t.youAreHere} className="rounded-2xl bg-primary p-4 text-primary-foreground">
        <p className="text-xs font-semibold tracking-wide uppercase opacity-80">{t.youAreHere}</p>
        <p className="mt-1 font-heading text-xl font-bold">{here.name}</p>
        <p className="mt-2 text-sm text-pretty opacity-90">{here.description}</p>
      </section>

      <PanelSection title="Nearby">
        {nearby.map((location) => {
          const open = isLocationOpen(location, game.time.hour)
          return (
            <PanelRow key={location.id}>
              <div className="min-w-0">
                <p className="truncate font-medium">{location.name}</p>
                <p className={cn('text-xs', open ? 'text-muted-foreground' : 'text-destructive')}>
                  {open ? location.kind : t.closed}
                </p>
              </div>
              <p className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground tabular-nums">
                <Footprints className="size-4" aria-hidden="true" />
                {here.travelMinutes[location.id] ?? '?'} min
              </p>
            </PanelRow>
          )
        })}
      </PanelSection>
    </div>
  )
}
