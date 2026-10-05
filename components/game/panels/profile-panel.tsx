'use client'

import { formatNaira } from '@/lib/format'
import { useGameStore } from '@/lib/store/game-store'
import { PanelRow, PanelSection } from './panel-section'

export function ProfilePanel() {
  const game = useGameStore((s) => s.game)
  const pack = useGameStore((s) => s.pack)
  if (!game || !pack) return null

  const { player, academics, reputation } = game
  const enrolled = Object.values(academics.courses)
    .map((progress) => ({ progress, course: pack.courses.find((c) => c.id === progress.courseId) }))
    .filter((entry) => entry.course !== undefined)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-2xl bg-primary font-heading text-xl font-bold text-primary-foreground"
        >
          {player.name.charAt(0)}
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold">{player.name}</h1>
          <p className="text-sm text-muted-foreground">
            {player.department} · {academics.level} Level · {pack.meta.shortName}
          </p>
        </div>
      </div>

      <PanelSection title="Money">
        <PanelRow>
          <span>Cash</span>
          <span className="font-heading font-semibold tabular-nums">{formatNaira(player.wallet.cash)}</span>
        </PanelRow>
        <PanelRow>
          <span>Bank</span>
          <span className="font-heading font-semibold tabular-nums">{formatNaira(player.wallet.bank)}</span>
        </PanelRow>
      </PanelSection>

      <PanelSection title="Reputation">
        {pack.meta.reputationGroups.map((group) => (
          <PanelRow key={group.id}>
            <div className="min-w-0">
              <p className="font-medium">{group.name}</p>
              <p className="text-xs text-pretty text-muted-foreground">{group.description}</p>
            </div>
            <span className="shrink-0 font-semibold tabular-nums">{reputation[group.id] ?? 0}</span>
          </PanelRow>
        ))}
      </PanelSection>

      <PanelSection title="Courses">
        {enrolled.map(({ course, progress }) => (
          <PanelRow key={progress.courseId}>
            <div className="min-w-0">
              <p className="font-medium">{course?.code}</p>
              <p className="truncate text-xs text-muted-foreground">{course?.title}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {progress.attended} attended · {progress.missed} missed
            </span>
          </PanelRow>
        ))}
      </PanelSection>
    </div>
  )
}
