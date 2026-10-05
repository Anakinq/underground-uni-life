import type { Effect } from '../events'

export type ItemCategory = 'food' | 'drink' | 'academic' | 'gadget' | 'clothing' | 'misc'

/** Static item definition from /data/common/items.json. */
export interface Item {
  id: string
  name: string
  category: ItemCategory
  description: string
  /** Default price in naira. Universities can override it in prices.json. */
  basePrice: number
  consumable: boolean
  /** Effects applied when the item is used/consumed. */
  useEffects: Effect[]
}

/** itemId -> quantity */
export type Inventory = Record<string, number>

export function addItem(inventory: Inventory, itemId: string, quantity: number): Inventory {
  const next = { ...inventory }
  const amount = (next[itemId] ?? 0) + quantity
  if (amount <= 0) delete next[itemId]
  else next[itemId] = amount
  return next
}
