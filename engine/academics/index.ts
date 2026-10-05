import type { Weekday } from '../time/types'

export interface CourseSession {
  weekday: Weekday
  /** 24h start hour. */
  startHour: number
  durationMinutes: number
  locationId: string
}

/** Static course definition from /data/universities/<id>/courses.json. */
export interface Course {
  id: string
  code: string
  title: string
  units: number
  level: number
  /** Semester within the academic year (1 or 2). */
  semester: number
  lecturerNpcId?: string
  schedule: CourseSession[]
}

/** Runtime progress for one enrolled course. */
export interface CourseProgress {
  courseId: string
  attended: number
  missed: number
  /** 0..100 rough understanding of the material. */
  mastery: number
}

export interface AcademicState {
  /** 100, 200, ... */
  level: number
  courses: Record<string, CourseProgress>
}

export function createAcademicState(level: number, courseIds: string[]): AcademicState {
  const courses: Record<string, CourseProgress> = {}
  for (const courseId of courseIds) {
    courses[courseId] = { courseId, attended: 0, missed: 0, mastery: 0 }
  }
  return { level, courses }
}
