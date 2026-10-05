import type { AcademicState } from './academics'
import type { EventState } from './events'
import type { NPCState } from './npc'
import type { Player } from './player'
import type { RelationshipState } from './relationships'
import type { ReputationState } from './reputation'
import type { RngState } from './rng'
import type { GameTime } from './time/types'

/**
 * The complete, serializable state of one run. Everything here must be plain
 * JSON (no classes, functions, Maps, Sets or Dates) so it round-trips through
 * the save file unchanged.
 */
export interface GameState {
  universityId: string
  rng: RngState
  time: GameTime
  player: Player
  academics: AcademicState
  npcs: Record<string, NPCState>
  relationships: RelationshipState
  reputation: ReputationState
  events: EventState
  /** Global narrative flags. */
  flags: Record<string, boolean>
}
