import type { GameState } from '../state'

/**
 * Bump this whenever `GameState` changes shape, and add a migration from the
 * previous version to `MIGRATIONS`.
 */
export const CURRENT_SAVE_VERSION = 1

export interface SaveFile {
  version: number
  /** ISO timestamp. */
  savedAt: string
  game: GameState
}

/**
 * Migrations upgrade a save from version N to N+1. Each receives the raw
 * parsed save (shape of version N) and returns the shape of version N+1.
 * Example for a future v2:
 *   1: (save) => ({ ...save, version: 2, game: { ...save.game, newField: [] } })
 */
type Migration = (save: Record<string, unknown>) => Record<string, unknown>
const MIGRATIONS: Record<number, Migration> = {}

/** Storage is injected so the engine stays platform-agnostic (browser, tests, native). */
export interface StorageAdapter {
  read(key: string): string | null
  write(key: string, value: string): void
  remove(key: string): void
}

export type LoadResult =
  | { ok: true; save: SaveFile }
  | { ok: false; reason: 'empty' | 'corrupt' | 'too_new' | 'invalid' }

export function createSaveFile(game: GameState, now: Date = new Date()): SaveFile {
  return { version: CURRENT_SAVE_VERSION, savedAt: now.toISOString(), game }
}

export function serializeSave(save: SaveFile): string {
  return JSON.stringify(save)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function looksLikeGameState(value: unknown): value is GameState {
  if (!isRecord(value)) return false
  return (
    typeof value.universityId === 'string' &&
    isRecord(value.rng) &&
    isRecord(value.time) &&
    isRecord(value.player) &&
    isRecord(value.academics)
  )
}

export function deserializeSave(raw: string | null): LoadResult {
  if (!raw) return { ok: false, reason: 'empty' }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, reason: 'corrupt' }
  }
  if (!isRecord(parsed) || typeof parsed.version !== 'number') {
    return { ok: false, reason: 'invalid' }
  }
  if (parsed.version > CURRENT_SAVE_VERSION) return { ok: false, reason: 'too_new' }

  let current: Record<string, unknown> = parsed
  while ((current.version as number) < CURRENT_SAVE_VERSION) {
    const migrate = MIGRATIONS[current.version as number]
    if (!migrate) return { ok: false, reason: 'invalid' }
    current = migrate(current)
  }

  if (typeof current.savedAt !== 'string' || !looksLikeGameState(current.game)) {
    return { ok: false, reason: 'invalid' }
  }
  return {
    ok: true,
    save: { version: CURRENT_SAVE_VERSION, savedAt: current.savedAt, game: current.game },
  }
}

export function writeSave(storage: StorageAdapter, key: string, save: SaveFile): void {
  storage.write(key, serializeSave(save))
}

export function readSave(storage: StorageAdapter, key: string): LoadResult {
  return deserializeSave(storage.read(key))
}

export function deleteSave(storage: StorageAdapter, key: string): void {
  storage.remove(key)
}
