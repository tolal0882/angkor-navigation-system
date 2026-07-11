"use client";

import { useMemo, useState } from "react";
import { Temple } from "@/types/temple";
import { CATEGORY_ORDER, CATEGORY_STYLES } from "@/lib/categoryStyles";
import { haversineKm } from "@/lib/distance";

interface SidebarProps {
  temples: Temple[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function Sidebar({
  temples,
  selectedId,
  onSelect,
}: SidebarProps) {
  const [query, setQuery] = useState("");

  const selectedTemple = useMemo(
    () => temples.find((t) => t.id === selectedId) ?? null,
    [temples, selectedId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return temples;
    return temples.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.king.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [temples, query]);

  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      temples: filtered.filter((t) => t.category === category),
    })).filter((group) => group.temples.length > 0);
  }, [filtered]);

  return (
    <aside className="w-full max-w-sm h-full flex flex-col bg-stone-ink text-ink-light border-r border-black/20">
      <header className="px-5 pt-6 pb-4 border-b border-white/10">
        <p className="font-mono text-[11px] tracking-[0.2em] text-laterite-soft uppercase">
          Angkor Archaeological Park
        </p>
        <h1 className="font-display text-2xl mt-1 leading-tight">
          Angkor Navigation System
        </h1>
        <p className="text-sm text-ink-light/60 mt-2">
          {temples.length} temples mapped across four zones
        </p>
      </header>

      <div className="px-5 py-3 border-b border-white/10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search temples, kings, zones..."
          className="w-full rounded-md bg-stone-ink-soft border border-white/10 px-3 py-2 text-sm placeholder:text-ink-light/40 focus:outline-none focus:ring-2 focus:ring-gold-leaf"
        />
      </div>

      {selectedTemple && (
        <div className="mx-5 mt-4 rounded-md border border-gold-leaf/40 bg-stone-ink-soft px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.15em] text-gold-leaf uppercase">
            Selected
          </p>
          <p className="font-display text-lg leading-tight mt-0.5">
            {selectedTemple.name}
          </p>
          <p className="text-xs text-ink-light/60 mt-1">
            {selectedTemple.king} &middot; {selectedTemple.yearBuilt}
          </p>
          <p className="text-xs text-ink-light/70 mt-2 leading-relaxed">
            {selectedTemple.description}
          </p>
          <p className="text-xs text-ink-light/50 mt-2 font-mono">
            ~{selectedTemple.visitDurationMinutes} min visit
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {grouped.map((group) => (
          <div key={group.category}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ background: CATEGORY_STYLES[group.category].color }}
              />
              <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink-light/60">
                {group.category}
              </p>
            </div>
            <ul className="space-y-1.5">
              {group.temples.map((temple) => {
                const isSelected = temple.id === selectedId;
                const distance = selectedTemple
                  ? haversineKm(
                      selectedTemple.lat,
                      selectedTemple.lng,
                      temple.lat,
                      temple.lng
                    )
                  : null;
                return (
                  <li key={temple.id}>
                    <button
                      onClick={() => onSelect(temple.id)}
                      className={`w-full text-left rounded-md px-3 py-2 border transition-colors ${
                        isSelected
                          ? "bg-laterite/20 border-laterite"
                          : "bg-transparent border-transparent hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium">
                          {temple.name}
                        </span>
                        {distance !== null && !isSelected && (
                          <span className="font-mono text-[10px] text-ink-light/40 flex-shrink-0">
                            {distance.toFixed(1)} km
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-ink-light/50">
                        {temple.khmerName}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {grouped.length === 0 && (
          <p className="text-sm text-ink-light/50">
            No temples match &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    </aside>
  );
}
