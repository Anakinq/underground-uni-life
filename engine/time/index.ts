import {
  WEEKDAYS,
  type CalendarConfig,
  type GameTime,
  type TimeAdvanceResult,
} from './types'

export * from './types'

export const MINUTES_PER_HOUR = 60
export const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR
export const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY

export function fromTotalMinutes(totalMinutes: number, calendar: CalendarConfig): GameTime {
  const safeTotal = Math.max(0, Math.floor(totalMinutes))
  const dayIndex = Math.floor(safeTotal / MINUTES_PER_DAY)
  const minuteOfDay = safeTotal % MINUTES_PER_DAY
  const weekIndex = Math.floor(dayIndex / 7)
  const weeksPerSemester = Math.max(1, calendar.weeksPerSemester)
  const startOffset = WEEKDAYS.indexOf(calendar.startWeekday)

  return {
    totalMinutes: safeTotal,
    day: dayIndex + 1,
    hour: Math.floor(minuteOfDay / MINUTES_PER_HOUR),
    minute: minuteOfDay % MINUTES_PER_HOUR,
    weekday: WEEKDAYS[(startOffset + dayIndex) % 7],
    semester: Math.floor(weekIndex / weeksPerSemester) + 1,
    semesterWeek: (weekIndex % weeksPerSemester) + 1,
  }
}

export function createGameTime(calendar: CalendarConfig): GameTime {
  return fromTotalMinutes(calendar.startHour * MINUTES_PER_HOUR, calendar)
}

/**
 * Advances the clock by N minutes and reports which boundaries were crossed,
 * so the orchestrator can emit `time:*` events without systems polling.
 */
export function advanceTime(
  time: GameTime,
  minutes: number,
  calendar: CalendarConfig,
): TimeAdvanceResult {
  const delta = Math.max(0, Math.floor(minutes))
  const next = fromTotalMinutes(time.totalMinutes + delta, calendar)
  const weeksPerSemester = Math.max(1, calendar.weeksPerSemester)

  const hourIndex = (t: number) => Math.floor(t / MINUTES_PER_HOUR)
  const dayIndex = (t: number) => Math.floor(t / MINUTES_PER_DAY)
  const weekIndex = (t: number) => Math.floor(t / MINUTES_PER_WEEK)
  const semesterIndex = (t: number) => Math.floor(weekIndex(t) / weeksPerSemester)

  return {
    time: next,
    hoursStarted: hourIndex(next.totalMinutes) - hourIndex(time.totalMinutes),
    daysStarted: dayIndex(next.totalMinutes) - dayIndex(time.totalMinutes),
    weeksStarted: weekIndex(next.totalMinutes) - weekIndex(time.totalMinutes),
    semestersStarted: semesterIndex(next.totalMinutes) - semesterIndex(time.totalMinutes),
  }
}

export function formatClock(time: Pick<GameTime, 'hour' | 'minute'>): string {
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`
}
