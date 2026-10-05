# Current State

## What works

- Save/load structure is in place and serializes the game state cleanly.
- The university pack pattern is established and data-driven from /data/universities.
- Core stat engine includes clamping, delta application, and passive drain logic.
- The game start flow loads a university pack from JSON.
- The HUD and profile views read from the live game state.
- A basic campus map is visible and shows nearby locations.
- The project includes a clear architecture boundary: data in /data, logic in /engine, UI in components.
- The stat system is test-covered with a minimal node-based regression script.

## What is stubbed / not implemented yet

- Character creation flow and background/course/personality/accommodation choices do not exist yet.
- The mobile-friendly multi-step creation UI is not built.
- Dialogue trees, event modal flow, and choice resolution are not implemented.
- The phone app system (Chats, Feed, Wallet, Timetable, Tasks, Settings) is stubbed.
- NPC schedules and world-state logic are not fully integrated into movement or location actions.
- Academic timetable, CA/exam progression, attendance rules, and grade outcomes are not implemented.
- Economy flows, part-time jobs, hostel costs, debt, and delayed money events are not implemented.
- Relationship and gossip systems are not implemented.
- Sleep, day summary, semester goals, and endings are not implemented.
- Debug/dev tools are not implemented.
- Event JSON packages are present but not yet populated with starter campus events.

## Intended next milestone

The next target is to deliver the first playable progression loop: character creation, stat-driven state, a campus map with time and travel, and a working event system tied to the save file.
