'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { messages } from '@/lib/content/messages'
import { getUniversityPack } from '@/lib/content/universities'
import { formatSavedAt } from '@/lib/format'
import { useGameStore } from '@/lib/store/game-store'

const t = messages.title

export function TitleScreen() {
  const saveInfo = useGameStore((s) => s.saveInfo)
  const newGame = useGameStore((s) => s.newGame)
  const continueGame = useGameStore((s) => s.continueGame)

  const hasSave = saveInfo.status === 'available'
  const savedCampus = hasSave ? getUniversityPack(saveInfo.universityId)?.meta.shortName : null

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-between px-6 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <Image
          src="/icons/icon-192.png"
          alt=""
          width={112}
          height={112}
          priority
          className="rounded-[1.75rem] shadow-lg shadow-primary/20"
        />
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-4xl leading-tight font-extrabold text-balance">
            {t.gameName}
          </h1>
          <p className="text-pretty text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button
          size="lg"
          className="h-12 w-full rounded-xl text-base font-semibold"
          disabled={!hasSave}
          onClick={continueGame}
        >
          {t.continue}
        </Button>
        <p className="min-h-5 text-center text-sm text-muted-foreground" aria-live="polite">
          {saveInfo.status === 'available' &&
            `${savedCampus ?? ''} · Day ${saveInfo.day} · ${formatSavedAt(saveInfo.savedAt)}`}
          {saveInfo.status === 'none' && t.noSave}
          {saveInfo.status === 'error' && <span className="text-destructive">{t.saveError}</span>}
        </p>

        <Button
          size="lg"
          variant={hasSave ? 'outline' : 'default'}
          className="h-12 w-full rounded-xl text-base font-semibold"
          onClick={newGame}
        >
          {t.newGame}
        </Button>
        {hasSave && <p className="text-center text-xs text-muted-foreground">{t.overwriteWarning}</p>}
      </div>
    </main>
  )
}
