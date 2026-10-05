/**
 * Minimal typed publish/subscribe bus.
 *
 * Systems never import each other. Instead, the orchestrator (`engine/game.ts`)
 * emits signals like `time:dayStarted`, and any system that cares subscribes.
 * The bus is runtime-only and is NOT part of the save file.
 */

import type { GameTime } from '../time/types'

export interface EngineEventMap {
  'game:started': { universityId: string; seed: number }
  'game:loaded': { universityId: string; savedAt: string }
  'time:advanced': { from: GameTime; to: GameTime; minutes: number }
  'time:hourStarted': { time: GameTime }
  'time:dayStarted': { time: GameTime }
  'time:weekStarted': { time: GameTime }
  'time:semesterStarted': { time: GameTime }
}

export type EngineEventName = keyof EngineEventMap
export type EngineListener<K extends EngineEventName> = (payload: EngineEventMap[K]) => void

export interface EventBus {
  on<K extends EngineEventName>(event: K, listener: EngineListener<K>): () => void
  off<K extends EngineEventName>(event: K, listener: EngineListener<K>): void
  emit<K extends EngineEventName>(event: K, payload: EngineEventMap[K]): void
  clear(): void
}

export function createEventBus(): EventBus {
  const listeners = new Map<EngineEventName, Set<EngineListener<EngineEventName>>>()

  return {
    on(event, listener) {
      let set = listeners.get(event)
      if (!set) {
        set = new Set()
        listeners.set(event, set)
      }
      set.add(listener as EngineListener<EngineEventName>)
      return () => this.off(event, listener)
    },
    off(event, listener) {
      listeners.get(event)?.delete(listener as EngineListener<EngineEventName>)
    },
    emit(event, payload) {
      const set = listeners.get(event)
      if (!set) return
      for (const listener of [...set]) listener(payload)
    },
    clear() {
      listeners.clear()
    },
  }
}
