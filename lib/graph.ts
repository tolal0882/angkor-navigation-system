import { TempleGraph, GraphEdge } from "../types/temple";

type PathResult = { distanceKm: number; path: string[] } | null;

export class Graph {
  adj: TempleGraph;

  constructor(adj: TempleGraph = {}) {
    this.adj = { ...adj };
  }

  addNode(id: string) {
    if (!this.adj[id]) this.adj[id] = [];
  }

  // By default add undirected edge
  addEdge(a: string, b: string, distanceKm: number, undirected = true) {
    this.addNode(a);
    this.addNode(b);
    this.adj[a].push({ to: b, distanceKm });
    if (undirected) this.adj[b].push({ to: a, distanceKm });
  }

  neighbors(id: string): GraphEdge[] {
    return this.adj[id] ?? [];
  }

  // Dijkstra's algorithm (returns null when unreachable)
  shortestPath(start: string, target: string): PathResult {
    if (!this.adj[start] || !this.adj[target]) return null;

    const dist: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const Q = new Set<string>();

    for (const node of Object.keys(this.adj)) {
      dist[node] = Infinity;
      prev[node] = null;
      Q.add(node);
    }

    dist[start] = 0;

    while (Q.size > 0) {
      // extract-min (simple linear search)
      let u: string | null = null;
      let best = Infinity;
      for (const v of Q) {
        if (dist[v] < best) {
          best = dist[v];
          u = v;
        }
      }
      if (u === null) break;
      Q.delete(u);

      if (u === target) break;

      for (const e of this.neighbors(u)) {
        const alt = dist[u] + e.distanceKm;
        if (alt < dist[e.to]) {
          dist[e.to] = alt;
          prev[e.to] = u;
        }
      }
    }

    if (dist[target] === Infinity) return null;

    const path: string[] = [];
    let cur: string | null = target;
    while (cur) {
      path.push(cur);
      cur = prev[cur];
    }
    path.reverse();

    return { distanceKm: dist[target], path };
  }
}

export default Graph;
