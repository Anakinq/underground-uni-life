import type { Course } from '../academics'
import type { PriceTable } from '../economy'
import type { GameEvent } from '../events'
import type { Item } from '../items'
import type { NPC } from '../npc'
import type { ReputationGroup } from '../reputation'
import type { Stats } from '../stats'
import type { CalendarConfig } from '../time/types'
import type { Location } from '../world'

/** Campus-specific rules that flavour events and economy. */
export interface CultureRules {
  /** Probability (0..1) per hour that power goes out. */
  powerOutageChancePerHour: number
  /** Hour after which hostel gates close (null = never). */
  hostelCurfewHour: number | null
  /** Free-form tags events can target, e.g. "strike_prone". */
  tags: string[]
}

export interface UniversityMeta {
  id: string
  name: string
  shortName: string
  city: string
  tagline: string
  calendar: CalendarConfig
  culture: CultureRules
  reputationGroups: ReputationGroup[]
  departments: string[]
  start: {
    locationId: string
    level: number
    cash: number
    bank: number
    stats: Partial<Stats>
    enrolledCourseIds: string[]
  }
}

/** A fully loaded university data pack: everything the engine needs to run a campus. */
export interface UniversityPack {
  meta: UniversityMeta
  locations: Location[]
  npcs: NPC[]
  courses: Course[]
  events: GameEvent[]
  prices: PriceTable
  items: Item[]
}
