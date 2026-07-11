"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import templesData from "@/data/temples.json";
import { Temple } from "@/types/temple";

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

  return (
    <main className="flex flex-1 h-screen w-full overflow-hidden">
      <Sidebar
        temples={temples}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <div className="flex-1 h-full">
        <TempleMap
          temples={temples}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </main>
  );
}
