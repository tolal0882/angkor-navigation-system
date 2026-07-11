import { Temple } from "../types/temple";
import { haversineKm } from "./distance";

export type Preference = {
  maxDistanceKm?: number; // from current location
  categories?: string[]; // preferred categories
  maxVisitMinutes?: number; // prefer shorter visits
  maxResults?: number;
};

export function scoreTemple(temple: Temple, userLoc?: { lat: number; lng: number }, prefs?: Preference) {
  let score = 0;
  if (prefs?.categories && prefs.categories.length > 0) {
    if (prefs.categories.includes(temple.category)) score += 30;
  }
  if (userLoc) {
    const d = haversineKm(userLoc.lat, userLoc.lng, temple.lat, temple.lng);
    // closer temples get higher score
    score += Math.max(0, 30 - d);
    if (prefs?.maxDistanceKm && d > prefs.maxDistanceKm) score -= 1000; // filter out
  }
  if (prefs?.maxVisitMinutes) {
    if (temple.visitDurationMinutes <= prefs.maxVisitMinutes) score += 10;
  }
  // older temples could be prioritized (example: earlier years)
  // fallback: prefer short descriptions (as a proxy for more notable?)
  return score;
}

export function recommend(temples: Temple[], userLoc?: { lat: number; lng: number }, prefs?: Preference) {
  const scored = temples
    .map((t) => ({ t, s: scoreTemple(t, userLoc, prefs) }))
    .filter((x) => x.s > -500)
    .sort((a, b) => b.s - a.s)
    .slice(0, prefs?.maxResults ?? 10)
    .map((x) => x.t);
  return scored;
}

export default { recommend };
