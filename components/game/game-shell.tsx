'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/lib/store/game-store'
import { BottomNav, type TabId } from './bottom-nav'
import { Hud } from './hud'
import { MapPanel } from './panels/map-panel'
import { MenuPanel } from './panels/menu-panel'
import { PhonePanel } from './panels/phone-panel'
import { ProfilePanel } from './panels/profile-panel'

const PANELS: Record<TabId, () => React.ReactNode> = {
  map: MapPanel,
  phone: PhonePanel,
  profile: ProfilePanel,
  menu: MenuPanel,
}

export function GameShell() {
  const [tab, setTab] = useState<TabId>('map')
  const saveGame = useGameStore((s) => s.saveGame)
  const Panel = PANELS[tab]

  // Autosave when the app is backgrounded or closed so mobile users never lose progress.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') saveGame()
    }
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', saveGame)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', saveGame)
    }
  }, [saveGame])

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col bg-background">
      <Hud />
      <main id={`panel-${tab}`} className="flex-1 overflow-y-auto px-4 py-4">
        <Panel />
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
