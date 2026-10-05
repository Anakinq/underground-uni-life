'use client'

import { Map, Menu, Smartphone, User, type LucideIcon } from 'lucide-react'
import { messages } from '@/lib/content/messages'
import { cn } from '@/lib/utils'

export type TabId = 'map' | 'phone' | 'profile' | 'menu'

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'map', label: messages.panels.map.title, icon: Map },
  { id: 'phone', label: messages.panels.phone.title, icon: Smartphone },
  { id: 'profile', label: messages.panels.profile.title, icon: User },
  { id: 'menu', label: messages.panels.menu.title, icon: Menu },
]

interface BottomNavProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      aria-label="Game sections"
      className="border-t bg-card pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-4">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                aria-controls={`panel-${id}`}
                className={cn(
                  'flex h-16 w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors outline-none focus-visible:bg-muted',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-12 items-center justify-center rounded-full transition-colors',
                    isActive && 'bg-primary/12',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
