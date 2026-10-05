/** How the player and one NPC feel about each other. */
export interface Relationship {
  npcId: string
  /** -100 (enemy) .. 100 (ride or die). */
  affinity: number
  /** 0..100 how much they trust the player. */
  trust: number
  /** Free-form narrative flags, e.g. "lent_money". */
  flags: string[]
}

export type RelationshipState = Record<string, Relationship>

export function createRelationship(npcId: string, affinity = 0, trust = 20): Relationship {
  return { npcId, affinity, trust, flags: [] }
}

export function adjustAffinity(rel: Relationship, delta: number): Relationship {
  return { ...rel, affinity: Math.max(-100, Math.min(100, Math.round(rel.affinity + delta))) }
}
