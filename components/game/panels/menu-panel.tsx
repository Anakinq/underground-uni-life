'use client'

import { LogOut, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { messages } from '@/lib/content/messages'
import { formatSavedAt } from '@/lib/format'
import { useGameStore } from '@/lib/store/game-store'
import { PanelRow, PanelSection } from './panel-section'
import { ThemeSelect } from './theme-select'

const t = messages.panels.menu

const TIME_SKIPS = [
  { label: '+30 min', minutes: 30 },
  { label: '+1 hr', minutes: 60 },
  { label: '+1 day', minutes: 24 * 60 },
]

export function MenuPanel() {
  const saveGame = useGameStore((s) => s.saveGame)
  const quitToTitle = useGameStore((s) => s.quitToTitle)
  const advanceMinutes = useGameStore((s) => s.advanceMinutes)
  const lastSavedAt = useGameStore((s) => s.lastSavedAt)

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-heading text-2xl font-bold">{t.title}</h1>

      <PanelSection title="Progress">
        <PanelRow>
          <div>
            <p className="font-medium">{t.save}</p>
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {lastSavedAt ? `${t.saved} ${formatSavedAt(lastSavedAt)}` : 'Not saved yet'}
            </p>
          </div>
          <Button size="sm" onClick={saveGame}>
            <Save aria-hidden="true" />
            Save
          </Button>
        </PanelRow>
      </PanelSection>

      <PanelSection title={t.theme}>
        <PanelRow>
          <ThemeSelect />
        </PanelRow>
      </PanelSection>

      {process.env.NODE_ENV !== 'production' && (
        <PanelSection title={t.devTools}>
          <PanelRow>
            <span className="text-sm">Advance time</span>
            <div className="flex gap-2">
              {TIME_SKIPS.map(({ label, minutes }) => (
                <Button key={minutes} size="sm" variant="outline" onClick={() => advanceMinutes(minutes)}>
                  {label}
                </Button>
              ))}
            </div>
          </PanelRow>
        </PanelSection>
      )}

      <Button variant="outline" className="h-11 rounded-xl" onClick={quitToTitle}>
        <LogOut aria-hidden="true" />
        {t.quit}
      </Button>
    </div>
  )
}
