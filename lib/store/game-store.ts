'use client'

import { create } from 'zustand'
import { DEFAULT_UNIVERSITY_ID, getUniversityPack } from '@/lib/content/universities'
import { messages } from '@/lib/content/messages'
import { SAVE_KEY, localStorageAdapter } from '@/lib/storage'
import { createEventBus } from '@/engine/bus'
import { advanceGameTime, createNewGame } from '@/engine/game'
import { randomSeed } from '@/engine/rng'
import {
  createSaveFile,
  readSave,
  writeSave,
  type LoadResult,
} from '@/engine/save'
import type { GameState } from '@/engine/state'
import type { UniversityPack } from '@/engine/university'

/** Runtime-only bus shared by the whole client. Never serialized. */
export const gameBus = createEventBus()

export type Screen = 'title' | 'game'

export type SaveInfo =
  | { status: 'unknown' }
  | { status: 'none' }
  | { status: 'available'; savedAt: string; universityId: string; day: number }
  | { status: 'error'; reason: Exclude<LoadResult, { ok: true }>['reason'] }

interface GameStore {
  screen: Screen
  game: GameState | null
  /** Static content for the current run. Derived from `game.universityId`, not saved. */
  pack: UniversityPack | null
  saveInfo: SaveInfo
  lastSavedAt: string | null

  refreshSaveInfo: () => void
  newGame: () => void
  continueGame: () => void
  saveGame: () => void
  quitToTitle: () => void
  advanceMinutes: (minutes: number) => void
}

function describeSave(result: LoadResult): SaveInfo {
  if (result.ok) {
    return {
      status: 'available',
      savedAt: result.save.savedAt,
      universityId: result.save.game.universityId,
      day: result.save.game.time.day,
    }
  }
  if (result.reason === 'empty') return { status: 'none' }
  return { status: 'error', reason: result.reason }
}

export const useGameStore = create<GameStore>()((set, get) => ({
  screen: 'title',
  game: null,
  pack: null,
  saveInfo: { status: 'unknown' },
  lastSavedAt: null,

  refreshSaveInfo() {
    set({ saveInfo: describeSave(readSave(localStorageAdapter, SAVE_KEY)) })
  },

  newGame() {
    const pack = getUniversityPack(DEFAULT_UNIVERSITY_ID)
    if (!pack) throw new Error(`Unknown university: ${DEFAULT_UNIVERSITY_ID}`)

    const game = createNewGame(pack, {
      seed: randomSeed(),
      playerName: messages.defaultPlayer.name,
      department: messages.defaultPlayer.department,
    })
    const save = createSaveFile(game)
    writeSave(localStorageAdapter, SAVE_KEY, save)

    set({ screen: 'game', game, pack, lastSavedAt: save.savedAt })
    gameBus.emit('game:started', { universityId: game.universityId, seed: game.rng.seed })
  },

  continueGame() {
    const result = readSave(localStorageAdapter, SAVE_KEY)
    if (!result.ok) {
      set({ saveInfo: describeSave(result) })
      return
    }
    const { game, savedAt } = result.save
    const pack = getUniversityPack(game.universityId)
    if (!pack) {
      set({ saveInfo: { status: 'error', reason: 'invalid' } })
      return
    }

    set({ screen: 'game', game, pack, lastSavedAt: savedAt })
    gameBus.emit('game:loaded', { universityId: game.universityId, savedAt })
  },

  saveGame() {
    const { game } = get()
    if (!game) return
    const save = createSaveFile(game)
    writeSave(localStorageAdapter, SAVE_KEY, save)
    set({ lastSavedAt: save.savedAt })
  },

  quitToTitle() {
    get().saveGame()
    set({ screen: 'title', game: null, pack: null })
    get().refreshSaveInfo()
  },

  advanceMinutes(minutes) {
    const { game, pack } = get()
    if (!game || !pack) return
    set({ game: advanceGameTime(game, minutes, pack, gameBus) })
  },
}))
