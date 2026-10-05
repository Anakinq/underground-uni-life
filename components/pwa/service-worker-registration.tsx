'use client'

import { useEffect } from 'react'

/** Registers the offline service worker in production only; it would fight HMR in dev. */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed', error)
    })
  }, [])

  return null
}
