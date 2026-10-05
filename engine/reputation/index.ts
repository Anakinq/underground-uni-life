/**
 * Reputation is tracked per group. The groups themselves come from the
 * university data pack (e.g. "students", "lecturers", "hostel"), so different
 * campuses can define different social circles.
 */
export interface ReputationGroup {
  id: string
  name: string
  description: string
}

/** groupId -> -100..100 */
export type ReputationState = Record<string, number>

export function createReputation(groups: readonly ReputationGroup[]): ReputationState {
  const state: ReputationState = {}
  for (const group of groups) state[group.id] = 0
  return state
}

export function adjustReputation(
  state: ReputationState,
  groupId: string,
  delta: number,
): ReputationState {
  const current = state[groupId] ?? 0
  return { ...state, [groupId]: Math.max(-100, Math.min(100, Math.round(current + delta))) }
}
