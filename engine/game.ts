/**
 * Composition root of the engine. This is the ONLY module allowed to import
 * multiple systems. Systems talk to each other through the event bus.
 */

import { createAcademicState } from './academics'
import type { EventBus } from './bus'
import { createWallet } from './economy'
import { createEventState } from './events'
import { createNPCState, type NPCState } from './npc'
import { createRelationship, type RelationshipState } from './relationships'
import { createReputation } from './reputation'
import { createRng } from './rng'
import type { GameState } from './state'
import { createStats } from './stats'
import { advanceTime, createGameTime } from './time'
import type { UniversityPack } from './university'

export interface NewGameOptions {
  seed: number | string
  playerName: string
  department: string
}

export function createNewGame(pack: UniversityPack, options: NewGameOptions): GameState {
  const { meta } = pack

  const npcs: Record<string, NPCState> = {}
  const relationships: RelationshipState = {}
  for (const npc of pack.npcs) {
    npcs[npc.id] = createNPCState(npc)
    relationships[npc.id] = createRelationship(npc.id)
  }

  return {
    universityId: meta.id,
    rng: createRng(options.seed),
    time: createGameTime(meta.calendar),
    player: {
      name: options.playerName,
      department: options.department,
      stats: createStats(meta.start.stats),
      wallet: createWallet({ cash: meta.start.cash, bank: meta.start.bank }),
      inventory: {},
      locationId: meta.start.locationId,
    },
    academics: createAcademicState(meta.start.level, meta.start.enrolledCourseIds),
    npcs,
    relationships,
    reputation: createReputation(meta.reputationGroups),
    events: createEventState(),
    flags: {},
  }
}

/**
 * Advances the clock and emits boundary events. Returns a new GameState; the
 * input is never mutated.
 */
export function advanceGameTime(
  state: GameState,
  minutes: number,
  pack: UniversityPack,
  bus: EventBus,
): GameState {
  const result = advanceTime(state.time, minutes, pack.meta.calendar)
  const next: GameState = { ...state, time: result.time }

  bus.emit('time:advanced', { from: state.time, to: result.time, minutes })
  if (result.hoursStarted > 0) bus.emit('time:hourStarted', { time: result.time })
  if (result.daysStarted > 0) bus.emit('time:dayStarted', { time: result.time })
  if (result.weeksStarted > 0) bus.emit('time:weekStarted', { time: result.time })
  if (result.semestersStarted > 0) bus.emit('time:semesterStarted', { time: result.time })

  return next
}
