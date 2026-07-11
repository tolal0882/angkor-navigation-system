import { Temple } from "../types/temple";
import { haversineKm } from "./distance";

export function nearbyTemples(temples: Temple[], lat: number, lng: number, radiusKm: number, maxResults = 20) {
  return temples
    .map((t) => ({ t, d: haversineKm(lat, lng, t.lat, t.lng) }))
    .filter((x) => x.d <= radiusKm)
    .sort((a, b) => a.d - b.d)
    .slice(0, maxResults)
    .map((x) => ({ temple: x.t, distanceKm: x.d }));
}

export default { nearbyTemples };
