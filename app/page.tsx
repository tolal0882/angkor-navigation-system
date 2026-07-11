"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import templesData from "@/data/temples.json";
import { Temple } from "@/types/temple";
import { solveTspWithHeuristics } from "@/lib/tsp";
import { recommend } from "@/lib/recommend";
import { nearbyTemples } from "@/lib/nearby";

const TempleMap = dynamic(() => import("@/components/TempleMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-sandstone-dim">
      <p className="font-mono text-xs tracking-widest uppercase text-stone-ink/50">
        Loading map...
      </p>
    </div>
  ),
});

const temples = templesData as Temple[];

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(temples[0].id);
  const [mode, setMode] = useState<string>("visit_all");
  const [useCurrentLocation, setUseCurrentLocation] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [startId, setStartId] = useState<string | null>(null);
  const [endId, setEndId] = useState<string | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    if (useCurrentLocation && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCurrentLocation(null)
      );
    }
  }, [useCurrentLocation]);

  return (
    <main className="flex flex-1 h-screen w-full overflow-hidden">
      <Sidebar
        temples={temples}
        selectedId={selectedId}
        onSelect={setSelectedId}
        mode={mode}
        onModeChange={setMode}
        useCurrentLocation={useCurrentLocation}
        onUseCurrentLocationChange={setUseCurrentLocation}
        startId={startId}
        onStartChange={setStartId}
        endId={endId}
        onEndChange={setEndId}
        onRunRoute={() => {
          // compute route based on mode
          const templeList = temples;
          if (mode === "visit_all") {
            // if using current location, pick nearest temple as start
            let startTempleId = startId ?? selectedId ?? templeList[0].id;
            if (useCurrentLocation && currentLocation) {
              // find nearest temple
              let best = templeList[0];
              let bestD = Infinity;
              for (const t of templeList) {
                const d = Math.hypot(t.lat - currentLocation.lat, t.lng - currentLocation.lng);
                if (d < bestD) {
                  bestD = d;
                  best = t;
                }
              }
              startTempleId = best.id;
            }
            const sol = solveTspWithHeuristics(templeList, startTempleId);
            setRouteCoords(sol.order.map((t) => [t.lat, t.lng]));
          } else if (mode === "recommend") {
            const recs = recommend(templeList as any, useCurrentLocation ? currentLocation ?? { lat: templeList[0].lat, lng: templeList[0].lng } : { lat: templeList[0].lat, lng: templeList[0].lng }, { maxResults: 6 });
            setRouteCoords(recs.map((t) => [t.lat, t.lng]));
          } else if (mode === "shortest") {
            // start: current or selected/startId, end: endId or selected
            const s = useCurrentLocation && currentLocation ? { coord: [currentLocation.lat, currentLocation.lng] } : { temple: templeList.find((t) => t.id === (startId ?? selectedId)) };
            const eTemple = templeList.find((t) => t.id === endId) ?? templeList.find((t) => t.id === selectedId);
            if (!eTemple) return;
            if (s.temple) {
              setRouteCoords([ [s.temple.lat, s.temple.lng], [eTemple.lat, eTemple.lng] ]);
            } else if (s.coord) {
              setRouteCoords([ [s.coord[0], s.coord[1]], [eTemple.lat, eTemple.lng] ]);
            }
          } else if (mode === "nearby") {
            const center = useCurrentLocation && currentLocation ? currentLocation : temples.find((t) => t.id === (startId ?? selectedId)) ?? { lat: temples[0].lat, lng: temples[0].lng };
            const near = nearbyTemples(templeList as any, center.lat, center.lng, 2);
            setRouteCoords(near.map((n) => [n.temple.lat, n.temple.lng]));
          } else if (mode === "custom") {
            // for now, behave like visit_all but limited to selected category/group (not implemented) — fallback to visit_all
            const sol = solveTspWithHeuristics(templeList, startId ?? selectedId ?? templeList[0].id);
            setRouteCoords(sol.order.map((t) => [t.lat, t.lng]));
          }
        }}
      />
      <div className="flex-1 h-full">
        <TempleMap
          temples={temples}
          selectedId={selectedId}
          onSelect={setSelectedId}
          routeCoords={routeCoords}
        />
      </div>
    </main>
  );
}
