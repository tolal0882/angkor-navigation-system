import { Temple } from "../types/temple";
import { haversineKm } from "./distance";

export type DistanceFn = (a: Temple, b: Temple) => number;

export function euclideanDistance(a: Temple, b: Temple) {
  return haversineKm(a.lat, a.lng, b.lat, b.lng);
}

// Nearest-neighbor heuristic starting from startId (falls back to first temple)
export function nearestNeighborTour(temples: Temple[], startId?: string, distFn: DistanceFn = euclideanDistance) {
  if (temples.length === 0) return { order: [], distance: 0 };
  const map = new Map(temples.map((t) => [t.id, t]));
  const start = startId ? map.get(startId) ?? temples[0] : temples[0];

  const remaining = new Set(temples.map((t) => t.id));
  const order: Temple[] = [];
  let cur = start;
  order.push(cur);
  remaining.delete(cur.id);

  while (remaining.size > 0) {
    let next: Temple | null = null;
    let best = Infinity;
    for (const id of remaining) {
      const cand = map.get(id)!;
      const d = distFn(cur, cand);
      if (d < best) {
        best = d;
        next = cand;
      }
    }
    if (!next) break;
    order.push(next);
    remaining.delete(next.id);
    cur = next;
  }

  const total = tourDistance(order, distFn);
  return { order, distance: total };
}

export function tourDistance(order: Temple[], distFn: DistanceFn = euclideanDistance) {
  let d = 0;
  for (let i = 0; i < order.length - 1; i++) d += distFn(order[i], order[i + 1]);
  return d;
}

// 2-opt improvement (for path without returning to start). If you want a cycle, append start.
export function twoOptImprove(order: Temple[], distFn: DistanceFn = euclideanDistance, maxIter = 1000) {
  if (order.length < 3) return { order, distance: tourDistance(order, distFn) };
  let improved = true;
  let it = 0;
  let bestOrder = order.slice();
  let bestDist = tourDistance(bestOrder, distFn);

  while (improved && it++ < maxIter) {
    improved = false;
    for (let i = 0; i < bestOrder.length - 2; i++) {
      for (let k = i + 2; k < bestOrder.length; k++) {
        const newOrder = bestOrder.slice(0, i + 1).concat(bestOrder.slice(i + 1, k + 1).reverse()).concat(bestOrder.slice(k + 1));
        const nd = tourDistance(newOrder, distFn);
        if (nd < bestDist - 1e-6) {
          bestDist = nd;
          bestOrder = newOrder;
          improved = true;
        }
      }
      if (improved) break;
    }
  }

  return { order: bestOrder, distance: bestDist };
}

export function solveTspWithHeuristics(temples: Temple[], startId?: string, distFn: DistanceFn = euclideanDistance) {
  const nn = nearestNeighborTour(temples, startId, distFn);
  const improved = twoOptImprove(nn.order, distFn);
  return improved;
}

export default {
  nearestNeighborTour,
  twoOptImprove,
  solveTspWithHeuristics,
};
