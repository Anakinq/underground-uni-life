export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export type Weekday = (typeof WEEKDAYS)[number]

/**
 * The game clock. `totalMinutes` is the single source of truth; every other
 * field is derived from it (via `fromTotalMinutes`) and stored for convenient
 * reading by the UI and other systems.
 */
export interface GameTime {
  /** Minutes elapsed since day 1, 00:00. */
  totalMinutes: number
  /** 1-based day counter since the run started. */
  day: number
  hour: number
  minute: number
  weekday: Weekday
  /** 1-based semester counter. */
  semester: number
  /** 1-based week within the current semester. */
  semesterWeek: number
}

/** Calendar rules supplied by the university data pack. */
export interface CalendarConfig {
  /** Weekday of day 1. */
  startWeekday: Weekday
  /** Hour of day the run begins on day 1 (0-23). */
  startHour: number
  /** Number of weeks in a semester before rolling over. */
  weeksPerSemester: number
}

export interface TimeAdvanceResult {
  time: GameTime
  hoursStarted: number
  daysStarted: number
  weeksStarted: number
  semestersStarted: number
}
