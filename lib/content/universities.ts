import commonItems from "@/data/common/items.json";
import halcyonCourses from "@/data/universities/halcyon/courses.json";
import halcyonEvents from "@/data/universities/halcyon/events.json";
import halcyonLocations from "@/data/universities/halcyon/locations.json";
import halcyonNpcs from "@/data/universities/halcyon/npcs.json";
import halcyonPrices from "@/data/universities/halcyon/prices.json";
import halcyonMeta from "@/data/universities/halcyon/university.json";
import type { Course } from "@/engine/academics";
import type { PriceTable } from "@/engine/economy";
import type { GameEvent } from "@/engine/events";
import type { Item } from "@/engine/items";
import type { NPC } from "@/engine/npc";
import type { UniversityMeta, UniversityPack } from "@/engine/university";
import type { Location } from "@/engine/world";

/*
 * JSON imports widen string literals (e.g. "monday" -> string), so each file is
 * cast to its engine type here, at the single boundary where content enters
 * the engine. Add a runtime validator here if packs ever come from user mods.
 */
const items = commonItems as unknown as Item[];

const halcyon: UniversityPack = {
  meta: halcyonMeta as unknown as UniversityMeta,
  locations: halcyonLocations as unknown as Location[],
  npcs: halcyonNpcs as unknown as NPC[],
  courses: halcyonCourses as unknown as Course[],
  events: halcyonEvents as unknown as GameEvent[],
  prices: halcyonPrices as PriceTable,
  items,
};

const UNIVERSITIES: Record<string, UniversityPack> = {
  [halcyon.meta.id]: halcyon,
};

export const DEFAULT_UNIVERSITY_ID = halcyon.meta.id;

export function getUniversityPack(id: string): UniversityPack | null {
  return UNIVERSITIES[id] ?? null;
}

export function listUniversities(): UniversityMeta[] {
  return Object.values(UNIVERSITIES).map((pack) => pack.meta);
}
