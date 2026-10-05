import type { Weekday } from '../time/types'

export interface NPCScheduleEntry {
  weekdays: Weekday[]
  fromHour: number
  toHour: number
  locationId: string
}

/** Static NPC definition from /data/universities/<id>/npcs.json. */
export interface NPC {
  id: string
  name: string
  nickname?: string
  role: 'student' | 'lecturer' | 'staff' | 'vendor' | 'other'
  bio: string
  /** Personality traits used later by dialogue/event conditions. */
  traits: string[]
  homeLocationId: string
  schedule: NPCScheduleEntry[]
}

/** Runtime NPC state stored in the save file. */
export interface NPCState {
  npcId: string
  met: boolean
  currentLocationId: string
}

export function createNPCState(npc: NPC): NPCState {
  return { npcId: npc.id, met: false, currentLocationId: npc.homeLocationId }
}
