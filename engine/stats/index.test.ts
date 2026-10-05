import assert from "node:assert/strict";
import test from "node:test";

import {
  applyStatDelta,
  clampStat,
  createCharacterStats,
  tickPassiveDrains,
} from "./index.ts";

test("clampStat keeps every vital within the safe range", () => {
  assert.equal(clampStat(-5), 0);
  assert.equal(clampStat(150), 100);
  assert.equal(clampStat(42), 42);
});

test("applyStatDelta respects clamping and updates multiple stats", () => {
  const { stats: next } = applyStatDelta(
    createCharacterStats({ energy: 30, stress: 80, mood: 10 }),
    { energy: 30, stress: -90, mood: 25 },
  );

  assert.equal(next.energy, 60);
  assert.equal(next.stress, 0);
  assert.equal(next.mood, 35);
});

test("passive drains rise hunger and stress under sustained pressure", () => {
  const next = tickPassiveDrains(
    createCharacterStats({ energy: 15, hunger: 85, stress: 55, mood: 45 }),
    { hours: 3, activityLevel: 1.2, powerOutage: false },
  );

  assert.ok(next.hunger >= 85);
  assert.ok(next.stress >= 55);
  assert.ok(next.energy <= 15);
});
