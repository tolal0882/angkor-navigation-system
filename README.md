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

## Data structures (new)

Implemented in `lib/`:

- `lib/hashTable.ts`: a simple chained hash table for storing and searching `Temple` objects by key (`id` or any string). Useful for O(1) average lookup and partial name searches.
- `lib/categoryTree.ts`: a small tree structure that organizes temples by category (and can be extended to subgroups). Provides insertion, find, and traversal helpers.
- `lib/graph.ts`: adjacency-list `Graph` with Dijkstra's shortest-path implementation (returns path + total distance).

Quick usage examples (node/TS runtime):

```ts
import HashTable from './lib/hashTable'
import CategoryTree from './lib/categoryTree'
import Graph from './lib/graph'
import temples from './data/temples.json'

const ht = new HashTable()
for (const t of temples) ht.set(t.id, t)
console.log(ht.searchByName('angkor'))

const tree = CategoryTree.fromList(temples)
console.log(tree.traverse())

const g = new Graph()
// populate edges using distance.ts or custom connections
g.addEdge('temple-1', 'temple-2', 1.2)
const route = g.shortestPath('temple-1', 'temple-2')
console.log(route)
```

Files:

- [lib/hashTable.ts](lib/hashTable.ts)
- [lib/categoryTree.ts](lib/categoryTree.ts)
- [lib/graph.ts](lib/graph.ts)

