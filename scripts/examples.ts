import temples from "../data/temples.json";
import { nearestNeighborTour, solveTspWithHeuristics } from "../lib/tsp";
import { recommend } from "../lib/recommend";
import { nearbyTemples } from "../lib/nearby";
import HashTable from "../lib/hashTable";
import Graph from "../lib/graph";

async function run() {
  console.log("Temples loaded:", temples.length);

  const ht = new HashTable();
  for (const t of temples) ht.set(t.id, t as any);

  console.log("Search for 'Angkor':", ht.searchByName("angkor").map((t) => t.name).slice(0, 5));

  const rec = recommend(temples as any, { lat: temples[0].lat, lng: temples[0].lng }, { categories: [temples[0].category], maxResults: 5 });
  console.log("Top recommendations:", rec.map((r) => r.name));

  const near = nearbyTemples(temples as any, temples[0].lat, temples[0].lng, 2);
  console.log("Nearby (2km):", near.map((n) => `${n.temple.name} (${n.distanceKm.toFixed(2)} km)`));

  const tour = solveTspWithHeuristics(temples as any, temples[0].id);
  console.log("Sample tour length (km):", tour.distance.toFixed(2), "stops:", tour.order.slice(0, 5).map((t) => t.name));

  // Small graph example
  const g = new Graph();
  if (temples.length >= 3) {
    g.addEdge(temples[0].id, temples[1].id, 1.0);
    g.addEdge(temples[1].id, temples[2].id, 1.2);
    const p = g.shortestPath(temples[0].id, temples[2].id);
    console.log("Graph shortest path sample:", p);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
