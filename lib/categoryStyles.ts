import { TempleCategory } from "@/types/temple";

export const CATEGORY_ORDER: TempleCategory[] = [
  "Angkor Wat Complex",
  "Angkor Thom Complex",
  "Outer Temples",
  "Roluos Group",
];

export const CATEGORY_STYLES: Record<
  TempleCategory,
  { color: string; short: string; description: string }
> = {
  "Angkor Wat Complex": {
    color: "#c6a15b",
    short: "AW",
    description: "The central sanctuary and its hilltop approach",
  },
  "Angkor Thom Complex": {
    color: "#a8532e",
    short: "AT",
    description: "The walled royal city and its monuments",
  },
  "Outer Temples": {
    color: "#3d5a45",
    short: "OT",
    description: "Monastic and satellite temples beyond the city walls",
  },
  "Roluos Group": {
    color: "#5b6f9c",
    short: "RG",
    description: "The earliest capital, south of the main park",
  },
};
