export type TempleCategory =
  | "Angkor Wat Complex"
  | "Angkor Thom Complex"
  | "Roluos Group"
  | "Outer Temples";

export interface Temple {
  id: string;
  name: string;
  khmerName: string;
  category: TempleCategory;
  lat: number;
  lng: number;
  yearBuilt: string;
  king: string;
  description: string;
  visitDurationMinutes: number;
}

export interface GraphEdge {
  to: string;
  distanceKm: number;
}

export type TempleGraph = Record<string, GraphEdge[]>;
