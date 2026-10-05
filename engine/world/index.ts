export type LocationKind =
  | 'hostel'
  | 'academic'
  | 'food'
  | 'social'
  | 'service'
  | 'transport'
  | 'religious'
  | 'offcampus'

/** Static location definition from /data/universities/<id>/locations.json. */
export interface Location {
  id: string
  name: string
  kind: LocationKind
  description: string
  /** IDs of locations reachable directly from here. */
  connections: string[]
  /** Walking time in minutes to each connected location (locationId -> minutes). */
  travelMinutes: Record<string, number>
  /** Opening hours, or null if always open. */
  hours: { open: number; close: number } | null
}

export function isLocationOpen(location: Location, hour: number): boolean {
  if (!location.hours) return true
  const { open, close } = location.hours
  return open <= close ? hour >= open && hour < close : hour >= open || hour < close
}
