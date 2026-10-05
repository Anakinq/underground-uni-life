# Underground Uni Life Architecture

## Core principles

- Logic lives in /engine.
- Content lives in /data and is JSON-driven.
- Components should not hard-code story, NPCs, locations, or event text.
- Every saved run is plain JSON so it can be loaded, migrated, and inspected easily.

## Runtime structure

- `/engine/state.ts` defines the serializable `GameState`.
- `/engine/game.ts` is the composition root: it assembles a fresh run and advances time.
- `/engine/stats/index.ts` contains stat definitions, clamping helpers, and passive drain logic.
- `/engine/time/index.ts` provides the in-game clock and date transitions.
- `/engine/university/index.ts` defines the university data contract.
- `/data/universities/<id>/` holds all campus-specific packs.

## Data-driven university pack

A university pack is composed of:

- `university.json`: metadata, calendar, culture, and start state
- `locations.json`: 10+ locations with hours and travel graph
- `npcs.json`: data for students, lecturers, vendors, and staff
- `courses.json`: academic schedule and professor mapping
- `events.json`: event JSON (starter content and runtime triggers)
- `prices.json`: economy data

## Event JSON schema

Each event has this shape:

```json
{
  "id": "power-cut-study",
  "title": "Light don finish",
  "description": "The generator konked out while you were studying.",
  "category": "academic",
  "trigger": {
    "time": { "hour": 19, "weekday": "monday" },
    "location": "hostel-block-a",
    "stats": { "energy": { "min": 20 } },
    "flags": ["power-outage"],
    "relationships": [{ "npcId": "roommate", "minAffinity": 10 }]
  },
  "weight": 2,
  "cooldown": 3,
  "once": false,
  "choices": [
    {
      "id": "study-with-phone-flashlight",
      "label": "Use your phone flashlight and keep reading",
      "effects": [
        { "type": "stat", "stat": "energy", "delta": -8 },
        { "type": "stat", "stat": "stress", "delta": 7 },
        { "type": "flag", "flag": "flashlight-study", "value": true }
      ]
    }
  ]
}
```

## Current state

This repo is now a playable skeleton for the beginning of the game loop: the engine has typed save and time systems, a core stat model, a data-driven multi-campus architecture, and a live campus pack for Halcyon State University. The remaining work is mostly game systems such as dialogue, phone apps, academics, and full event logic.
