/**
 * Seeded, serializable PRNG (mulberry32).
 *
 * The RNG is purely functional: every call takes an `RngState` and returns the
 * value plus the next state. The state lives inside `GameState`, so saving and
 * reloading a game reproduces the exact same sequence of rolls.
 */

export interface RngState {
  /** The seed the run started with. Never changes; useful for sharing runs. */
  seed: number
  /** Current internal state. Advances on every roll. */
  state: number
}

export interface RngResult<T> {
  value: T
  rng: RngState
}

export function hashSeed(input: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function createRng(seed: number | string): RngState {
  const numeric = typeof seed === 'string' ? hashSeed(seed) : seed >>> 0
  return { seed: numeric, state: numeric }
}

/** Returns a float in [0, 1). */
export function nextFloat(rng: RngState): RngResult<number> {
  let t = (rng.state + 0x6d2b79f5) >>> 0
  const nextState = t
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296
  return { value, rng: { seed: rng.seed, state: nextState } }
}

/** Returns an integer in [min, max] (inclusive). */
export function nextInt(rng: RngState, min: number, max: number): RngResult<number> {
  const { value, rng: next } = nextFloat(rng)
  return { value: Math.floor(value * (max - min + 1)) + min, rng: next }
}

/** Returns true with the given probability (0..1). */
export function chance(rng: RngState, probability: number): RngResult<boolean> {
  const { value, rng: next } = nextFloat(rng)
  return { value: value < probability, rng: next }
}

export function pick<T>(rng: RngState, items: readonly T[]): RngResult<T> {
  if (items.length === 0) throw new Error('rng.pick called with an empty array')
  const { value: index, rng: next } = nextInt(rng, 0, items.length - 1)
  return { value: items[index], rng: next }
}

/** Picks an item using relative weights. */
export function pickWeighted<T>(
  rng: RngState,
  items: readonly { item: T; weight: number }[],
): RngResult<T> {
  const total = items.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0)
  if (total <= 0) throw new Error('rng.pickWeighted called with no positive weights')
  const { value, rng: next } = nextFloat(rng)
  let roll = value * total
  for (const entry of items) {
    roll -= Math.max(0, entry.weight)
    if (roll < 0) return { value: entry.item, rng: next }
  }
  return { value: items[items.length - 1].item, rng: next }
}

/** Generates a fresh seed from the environment. Only used when starting a new run. */
export function randomSeed(): number {
  return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0
}
