import type { StorageAdapter } from '@/engine/save'

export const SAVE_KEY = 'uul:save:slot1'

/**
 * localStorage-backed adapter. Every call is guarded because storage can be
 * unavailable (SSR, private browsing, quota exceeded).
 */
export const localStorageAdapter: StorageAdapter = {
  read(key) {
    try {
      return typeof window === 'undefined' ? null : window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  write(key, value) {
    try {
      window.localStorage.setItem(key, value)
    } catch (error) {
      console.error('Failed to write save', error)
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* storage unavailable; nothing to remove */
    }
  },
}
