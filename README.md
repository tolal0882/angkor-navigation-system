# Angkor Navigation System

An interactive map and route-planning tool for the Angkor Archaeological Park,
built as a data structures & algorithms course project (RUPP, Faculty of
Engineering). This repo grows in phases — this commit covers **Phase 1: Map
Foundation**.

## Status

**Phase 1 — Map Foundation (done)**
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- React Leaflet map centered on the Angkor Archaeological Park
- 20 real temples across 4 zones (Angkor Wat Complex, Angkor Thom Complex,
  Outer Temples, Roluos Group), with coordinates, king, year built, and a
  short description each — see `data/temples.json`
- Sidebar: search, category grouping, click-to-select, distance-from-selected
  hint per temple
- Map ↔ sidebar are synced: selecting a temple in either place flies the map
  to it and highlights it

**Phase 2 — Data Structures & Algorithms (next)**
- Graph representation of the temple network (`types/temple.ts` already
  defines `TempleGraph`/`GraphEdge` for this)
- Dijkstra's algorithm for shortest path between two temples
- BFS / DFS for reachability and traversal order
- A hash table and a tree structure (for the course's DSA requirements —
  exact use TBD, e.g. hash table for O(1) temple lookup by id, tree for the
  category hierarchy)

**Phase 3 — Features (planned)**
- Route planning UI (pick start + end, or "visit all" — a TSP-flavored
  route through every temple)
- Step-by-step algorithm visualization for the defense/demo

**Phase 4 — Deployment (planned)**
- Push to GitHub, deploy to Vercel, final README + demo script

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> Note: the build fetches `Spectral`, `Inter`, and `IBM Plex Mono` from
> Google Fonts via `next/font/google`. That requires normal internet access
> (works on your machine and on Vercel).

## Project structure

```
app/
  layout.tsx        # fonts + global shell
  page.tsx           # composes Sidebar + TempleMap, holds selection state
  globals.css         # design tokens (palette, marker styling)
components/
  TempleMap.tsx       # Leaflet map, custom markers, fly-to-selection
  Sidebar.tsx          # search, category groups, temple list
data/
  temples.json         # the 20-temple dataset
lib/
  categoryStyles.ts    # per-zone color/label used by map + sidebar
  distance.ts            # haversine distance (also the base for Phase 2 edge weights)
types/
  temple.ts             # Temple, GraphEdge, TempleGraph types
```

## Design notes

Palette and type choices are documented in `app/globals.css` (`@theme`
block): laterite red-brown, sandstone cream, moss green, and gold-leaf accent,
paired with a `Spectral` display serif and `Inter` body text — meant to read
like carved stone and gilt rather than a generic dashboard.
