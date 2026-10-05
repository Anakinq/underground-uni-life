import type { Weekday } from '@/engine/time/types'

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount)
}

export function formatWeekday(weekday: Weekday, short = false): string {
  const label = weekday.charAt(0).toUpperCase() + weekday.slice(1)
  return short ? label.slice(0, 3) : label
}

export function formatSavedAt(iso: string): string {
  return new Date(iso).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
