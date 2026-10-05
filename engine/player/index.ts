import type { Wallet } from '../economy'
import type { Inventory } from '../items'
import type { Stats } from '../stats'

export interface Player {
  name: string
  /** Department / course of study, e.g. "Computer Science". */
  department: string
  stats: Stats
  wallet: Wallet
  inventory: Inventory
  locationId: string
}
