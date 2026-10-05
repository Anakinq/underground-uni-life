/** Core survival/wellbeing stats. All values are clamped to 0..100 unless noted. */
export interface VitalStats {
  energy: number;
  health: number;
  hunger: number;
  satiety: number;
  stress: number;
  mood: number;
}

export interface AcademicStats {
  cgpa: number;
  attendance: number;
}

export interface SkillStats {
  study: number;
  communication: number;
  charisma: number;
  leadership: number;
  hustle: number;
  tech: number;
  creativity: number;
  streetSmarts: number;
  fitness: number;
}

export interface ResourceStats {
  money: number;
  dataBalance: number;
  airtime: number;
}

export interface ReputationStats {
  students: number;
  coursemates: number;
  lecturers: number;
  administration: number;
  clubs: number;
  underground: number;
}

export interface HiddenStats {
  luck: number;
  karma: number;
}

export type Stats = VitalStats &
  AcademicStats &
  SkillStats &
  ResourceStats &
  ReputationStats &
  HiddenStats;

export type StatKey = keyof Stats;

export const STAT_KEYS: readonly StatKey[] = [
  "energy",
  "health",
  "hunger",
  "satiety",
  "stress",
  "mood",
  "cgpa",
  "attendance",
  "study",
  "communication",
  "charisma",
  "leadership",
  "hustle",
  "tech",
  "creativity",
  "streetSmarts",
  "fitness",
  "money",
  "dataBalance",
  "airtime",
  "students",
  "coursemates",
  "lecturers",
  "administration",
  "clubs",
  "underground",
  "luck",
  "karma",
];

export const STAT_MIN = 0;
export const STAT_MAX = 100;

export const STAT_RANGES: Record<string, { min: number; max: number }> = {
  energy: { min: 0, max: 100 },
  health: { min: 0, max: 100 },
  hunger: { min: 0, max: 100 },
  satiety: { min: 0, max: 100 },
  stress: { min: 0, max: 100 },
  mood: { min: 0, max: 100 },
  cgpa: { min: 0, max: 5 },
  attendance: { min: 0, max: 100 },
  study: { min: 0, max: 100 },
  communication: { min: 0, max: 100 },
  charisma: { min: 0, max: 100 },
  leadership: { min: 0, max: 100 },
  hustle: { min: 0, max: 100 },
  tech: { min: 0, max: 100 },
  creativity: { min: 0, max: 100 },
  streetSmarts: { min: 0, max: 100 },
  fitness: { min: 0, max: 100 },
  money: { min: 0, max: Number.MAX_SAFE_INTEGER },
  dataBalance: { min: 0, max: Number.MAX_SAFE_INTEGER },
  airtime: { min: 0, max: Number.MAX_SAFE_INTEGER },
  students: { min: -100, max: 100 },
  coursemates: { min: -100, max: 100 },
  lecturers: { min: -100, max: 100 },
  administration: { min: -100, max: 100 },
  clubs: { min: -100, max: 100 },
  underground: { min: -100, max: 100 },
  luck: { min: 0, max: 100 },
  karma: { min: 0, max: 100 },
};

export function clampStat(value: number, key?: StatKey): number {
  if (!key) return Math.min(STAT_MAX, Math.max(STAT_MIN, Math.round(value)));
  const range = STAT_RANGES[key] ?? { min: STAT_MIN, max: STAT_MAX };
  return Math.min(range.max, Math.max(range.min, Math.round(value)));
}

export interface StatChange {
  key: StatKey;
  delta: number;
  reason: string;
}

export function createStats(initial: Partial<Stats> = {}): Stats {
  const safeInit: Partial<Stats> = {
    ...initial,
    energy: initial.energy ?? 80,
    health: initial.health ?? 90,
    hunger: initial.hunger ?? initial.satiety ?? 70,
    satiety: initial.satiety ?? initial.hunger ?? 70,
    stress: initial.stress ?? 20,
    mood: initial.mood ?? 65,
    cgpa: initial.cgpa ?? 0,
    attendance: initial.attendance ?? 80,
    study: initial.study ?? 50,
    communication: initial.communication ?? 50,
    charisma: initial.charisma ?? 50,
    leadership: initial.leadership ?? 40,
    hustle: initial.hustle ?? 40,
    tech: initial.tech ?? 45,
    creativity: initial.creativity ?? 50,
    streetSmarts: initial.streetSmarts ?? 45,
    fitness: initial.fitness ?? 50,
    money: initial.money ?? 0,
    dataBalance: initial.dataBalance ?? 0,
    airtime: initial.airtime ?? 0,
    students: initial.students ?? 0,
    coursemates: initial.coursemates ?? 0,
    lecturers: initial.lecturers ?? 0,
    administration: initial.administration ?? 0,
    clubs: initial.clubs ?? 0,
    underground: initial.underground ?? 0,
    luck: initial.luck ?? 50,
    karma: initial.karma ?? 50,
  };

  return {
    energy: clampStat(safeInit.energy ?? 80, "energy"),
    health: clampStat(safeInit.health ?? 90, "health"),
    hunger: clampStat(safeInit.hunger ?? 70, "hunger"),
    satiety: clampStat(safeInit.satiety ?? safeInit.hunger ?? 70, "satiety"),
    stress: clampStat(safeInit.stress ?? 20, "stress"),
    mood: clampStat(safeInit.mood ?? 65, "mood"),
    cgpa: clampStat(safeInit.cgpa ?? 0, "cgpa"),
    attendance: clampStat(safeInit.attendance ?? 80, "attendance"),
    study: clampStat(safeInit.study ?? 50, "study"),
    communication: clampStat(safeInit.communication ?? 50, "communication"),
    charisma: clampStat(safeInit.charisma ?? 50, "charisma"),
    leadership: clampStat(safeInit.leadership ?? 40, "leadership"),
    hustle: clampStat(safeInit.hustle ?? 40, "hustle"),
    tech: clampStat(safeInit.tech ?? 45, "tech"),
    creativity: clampStat(safeInit.creativity ?? 50, "creativity"),
    streetSmarts: clampStat(safeInit.streetSmarts ?? 45, "streetSmarts"),
    fitness: clampStat(safeInit.fitness ?? 50, "fitness"),
    money: Math.max(0, Math.round(safeInit.money ?? 0)),
    dataBalance: Math.max(0, Math.round(safeInit.dataBalance ?? 0)),
    airtime: Math.max(0, Math.round(safeInit.airtime ?? 0)),
    students: clampStat(safeInit.students ?? 0, "students"),
    coursemates: clampStat(safeInit.coursemates ?? 0, "coursemates"),
    lecturers: clampStat(safeInit.lecturers ?? 0, "lecturers"),
    administration: clampStat(safeInit.administration ?? 0, "administration"),
    clubs: clampStat(safeInit.clubs ?? 0, "clubs"),
    underground: clampStat(safeInit.underground ?? 0, "underground"),
    luck: clampStat(safeInit.luck ?? 50, "luck"),
    karma: clampStat(safeInit.karma ?? 50, "karma"),
  };
}

export function applyStatDelta(
  stats: Stats,
  changes: Partial<Stats> | StatChange[] | Record<string, number>,
): { stats: Stats; log: StatChange[] } {
  const entries: StatChange[] = Array.isArray(changes)
    ? changes
    : Object.entries(changes).map(([key, delta]) => ({
        key: key as StatKey,
        delta: Number(delta),
        reason: "system update",
      }));

  const next = { ...stats };
  const log: StatChange[] = [];

  for (const entry of entries) {
    const current = next[entry.key];
    const adjusted = clampStat(current + entry.delta, entry.key);
    next[entry.key] = adjusted;
    if (entry.key === "hunger" || entry.key === "satiety") {
      next.hunger = clampStat(next.hunger, "hunger");
      next.satiety = next.hunger;
    }
    if (entry.key === "satiety") {
      next.hunger = clampStat(next.satiety, "hunger");
    }
    if (
      entry.key === "energy" ||
      entry.key === "health" ||
      entry.key === "stress" ||
      entry.key === "mood"
    ) {
      next.energy = clampStat(next.energy, "energy");
      next.health = clampStat(next.health, "health");
      next.stress = clampStat(next.stress, "stress");
      next.mood = clampStat(next.mood, "mood");
    }
    if (entry.delta !== 0) {
      log.push({ ...entry, key: entry.key, delta: adjusted - current });
    }
  }

  return { stats: next, log };
}

export function createCharacterStats(initial: Partial<Stats> = {}): Stats {
  return createStats(initial);
}

export function tickPassiveDrains(
  stats: Stats,
  options: {
    hours?: number;
    activityLevel?: number;
    powerOutage?: boolean;
  } = {},
): Stats {
  const hours = Math.max(1, options.hours ?? 1);
  const activityLevel = Math.max(0, options.activityLevel ?? 1);
  const powerOutage = options.powerOutage ?? false;

  const next = { ...stats };
  next.hunger = clampStat(
    next.hunger + hours * 4 + Math.max(0, activityLevel - 1) * 5,
    "hunger",
  );
  next.energy = clampStat(
    next.energy - hours * (2 + activityLevel * 2),
    "energy",
  );
  next.stress = clampStat(
    next.stress + Math.max(0, 100 - next.energy) / 10 + (powerOutage ? 3 : 0),
    "stress",
  );
  if (next.energy < 25) next.stress = clampStat(next.stress + 6, "stress");
  if (next.hunger > 80) next.mood = clampStat(next.mood - 3, "mood");
  next.satiety = next.hunger;

  return next;
}

export function sleepAndRecover(
  stats: Stats,
  hours: number,
  accommodationQuality: number,
): Stats {
  const safeHours = Math.max(0, Math.min(12, hours));
  const quality = Math.max(0, Math.min(100, accommodationQuality));
  const recovered = Math.min(100, 25 + safeHours * 6 + quality / 4);

  const next = { ...stats };
  next.energy = clampStat(next.energy + recovered, "energy");
  next.stress = clampStat(
    next.stress - Math.max(0, safeHours * 4 - 1),
    "stress",
  );
  next.hunger = clampStat(next.hunger - safeHours * 2, "hunger");
  next.mood = clampStat(next.mood + Math.max(0, safeHours - 4) * 2, "mood");
  next.satiety = next.hunger;

  return next;
}
