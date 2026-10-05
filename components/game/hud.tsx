'use client'

import { MapPin } from 'lucide-react'
import { formatClock } from '@/engine/time'
import { formatNaira, formatWeekday } from '@/lib/format'
import { useGameStore } from '@/lib/store/game-store'
import { StatMeter } from './stat-meter'

export function Hud() {
  const game = useGameStore((s) => s.game)
  const pack = useGameStore((s) => s.pack)
  if (!game || !pack) return null

  const { time, player } = game
  const location = pack.locations.find((l) => l.id === player.locationId)

  return (
    <header className="border-b bg-card px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <p className="font-heading text-2xl leading-none font-bold tabular-nums">
            <time aria-label="Current time">{formatClock(time)}</time>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatWeekday(time.weekday)} · Day {time.day} · Sem {time.semester}, Wk{' '}
            {time.semesterWeek}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <p className="font-heading text-lg leading-none font-bold tabular-nums">
            <span className="sr-only">Cash: </span>
            {formatNaira(player.wallet.cash)}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" aria-hidden="true" />
            <span className="max-w-36 truncate">{location?.name ?? player.locationId}</span>
          </p>
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-5 gap-2" aria-label="Your condition">
        <StatMeter label="Energy" value={player.stats.energy} />
        <StatMeter label="Food" value={player.stats.satiety} />
        <StatMeter label="Mood" value={player.stats.mood} />
        <StatMeter label="Health" value={player.stats.health} />
        <StatMeter label="Stress" value={player.stats.stress} inverted />
      </ul>
    </header>
  )
}
