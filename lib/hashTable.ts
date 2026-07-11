import { Temple } from "../types/temple";

type BucketItem = { key: string; value: Temple };

export class HashTable {
  private buckets: BucketItem[][];
  private capacity: number;

  constructor(capacity = 1024) {
    this.capacity = capacity;
    this.buckets = Array.from({ length: capacity }, () => []);
  }

  private hash(key: string) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return h % this.capacity;
  }

  set(key: string, value: Temple) {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const existing = bucket.find((b) => b.key === key);
    if (existing) {
      existing.value = value;
    } else {
      bucket.push({ key, value });
    }
  }

  get(key: string): Temple | undefined {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const item = bucket.find((b) => b.key === key);
    return item?.value;
  }

  has(key: string): boolean {
    return !!this.get(key);
  }

  delete(key: string): boolean {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const i = bucket.findIndex((b) => b.key === key);
    if (i >= 0) {
      bucket.splice(i, 1);
      return true;
    }
    return false;
  }

  // Return all stored temples
  values(): Temple[] {
    const out: Temple[] = [];
    for (const bucket of this.buckets) {
      for (const item of bucket) out.push(item.value);
    }
    return out;
  }

  // Case-insensitive partial name search
  searchByName(query: string): Temple[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return this.values().filter((t) => t.name.toLowerCase().includes(q) || t.khmerName.toLowerCase().includes(q));
  }

  // Human-readable display for debug
  displayAll(): string {
    return this.values()
      .map((t) => `${t.id} — ${t.name} (${t.category}) @ ${t.lat.toFixed(6)},${t.lng.toFixed(6)}`)
      .join("\n");
  }
}

export default HashTable;
