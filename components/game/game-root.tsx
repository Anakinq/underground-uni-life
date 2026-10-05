'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store/game-store'
import { GameShell } from './game-shell'
import { TitleScreen } from './title-screen'

export function GameRoot() {
  const screen = useGameStore((s) => s.screen)
  const refreshSaveInfo = useGameStore((s) => s.refreshSaveInfo)

  // localStorage only exists in the browser, so the save check runs after mount.
  useEffect(() => {
    refreshSaveInfo()
  }, [refreshSaveInfo])

  return screen === 'game' ? <GameShell /> : <TitleScreen />
}
