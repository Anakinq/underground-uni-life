import type { StatKey } from '../stats'
import type { Weekday } from '../time/types'

/**
 * Effects are plain data describing a state change. They are applied by the
 * orchestrator, which routes each effect to the owning system. This keeps
 * event content (JSON) decoupled from engine internals.
 */
export type Effect =
  | { type: 'stat'; stat: StatKey; delta: number }
  | { type: 'cash'; delta: number }
  | { type: 'time'; minutes: number }
  | { type: 'relationship'; npcId: string; affinity?: number; trust?: number }
  | { type: 'reputation'; groupId: string; delta: number }
  | { type: 'item'; itemId: string; quantity: number }
  | { type: 'flag'; flag: string; value: boolean }
  | { type: 'move'; locationId: string }

/** Conditions gate when an event can fire or a choice is available. */
export type Condition =
  | { type: 'stat'; stat: StatKey; min?: number; max?: number }
  | { type: 'cash'; min?: number; max?: number }
  | { type: 'location'; locationId: string }
  | { type: 'hour'; from: number; to: number }
  | { type: 'weekday'; weekdays: Weekday[] }
  | { type: 'flag'; flag: string; value: boolean }
  | { type: 'relationship'; npcId: string; minAffinity?: number }

export interface Choice {
  id: string
  label: string
  /** Optional text shown after the choice is made. */
  outcome?: string
  conditions?: Condition[]
  effects: Effect[]
}

/** Named `GameEvent` to avoid clashing with the DOM `Event` type. */
export interface GameEvent {
  id: string
  title: string
  description: string
  tags: string[]
  /** Relative likelihood when multiple events are eligible. */
  weight: number
  /** If true, the event can only fire once per run. */
  once: boolean
  conditions: Condition[]
  choices: Choice[]
}

export interface EventState {
  /** IDs of `once` events that have already fired. */
  firedOnce: string[]
  /** Event currently awaiting a player choice, if any. */
  activeEventId: string | null
}

export function createEventState(): EventState {
  return { firedOnce: [], activeEventId: null }
}
