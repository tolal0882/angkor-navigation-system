"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Temple } from "@/types/temple";
import { CATEGORY_STYLES } from "@/lib/categoryStyles";

const ANGKOR_CENTER: [number, number] = [13.428, 103.865];

function buildPinIcon(temple: Temple, isSelected: boolean) {
  const style = CATEGORY_STYLES[temple.category];
  return L.divIcon({
    className: "",
    html: `<div class="temple-pin${isSelected ? " is-selected" : ""}" style="width:${
      isSelected ? 34 : 26
    }px;height:${isSelected ? 34 : 26}px;background:${style.color};">
      <span>${style.short}</span>
    </div>`,
    iconSize: [isSelected ? 34 : 26, isSelected ? 34 : 26],
    iconAnchor: [isSelected ? 17 : 13, isSelected ? 34 : 26],
    popupAnchor: [0, -28],
  });
}

function FlyToSelection({ temple }: { temple: Temple | null }) {
  const map = useMap();

  useEffect(() => {
    if (temple) {
      map.flyTo([temple.lat, temple.lng], 16, { duration: 0.9 });
    }
  }, [temple, map]);

  return null;
}

interface TempleMapProps {
  temples: Temple[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function TempleMap({
  temples,
  selectedId,
  onSelect,
}: TempleMapProps) {
  const selectedTemple = useMemo(
    () => temples.find((t) => t.id === selectedId) ?? null,
    [temples, selectedId]
  );

  return (
    <MapContainer
      center={ANGKOR_CENTER}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {temples.map((temple) => (
        <Marker
          key={temple.id}
          position={[temple.lat, temple.lng]}
          icon={buildPinIcon(temple, temple.id === selectedId)}
          eventHandlers={{
            click: () => onSelect(temple.id),
          }}
        >
          <Popup>
            <p className="font-display text-base leading-tight">
              {temple.name}
            </p>
            <p className="text-xs text-gold-leaf mb-1">{temple.khmerName}</p>
            <p className="text-xs opacity-80">
              {temple.king} &middot; {temple.yearBuilt}
            </p>
          </Popup>
        </Marker>
      ))}
      <FlyToSelection temple={selectedTemple} />
    </MapContainer>
  );
}
