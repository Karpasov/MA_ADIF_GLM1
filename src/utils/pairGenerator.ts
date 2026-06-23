import type { ChoiceItem, Pair } from "@/types/choice";
import { pairKey } from "./storage";

// Fisher-Yates shuffle (returns a new array)
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick a pair of items that:
 *  - haven't been shown together recently (per shownPairs)
 *  - aren't the same item
 *  - prefer items that have been shown less often
 *
 * Strategy:
 *  1. Filter out inactive items.
 *  2. Try N random draws to find a pair not in shownPairs.
 *  3. If all pairs exhausted, fall back to least-shown items.
 *  4. Returns null if fewer than 2 items available.
 */
export function generatePair(
  items: ChoiceItem[],
  shownPairs: string[],
  options?: { maxAttempts?: number; avoidIds?: string[] }
): Pair | null {
  const active = items.filter((i) => i.active);
  if (active.length < 2) return null;

  const maxAttempts = options?.maxAttempts ?? 40;
  const avoidIds = new Set(options?.avoidIds ?? []);

  // Build a lookup for shown count to bias selection
  const shownCount = new Map<string, number>();
  for (const pair of shownPairs) {
    const [a, b] = pair.split("|");
    shownCount.set(a, (shownCount.get(a) ?? 0) + 1);
    shownCount.set(b, (shownCount.get(b) ?? 0) + 1);
  }

  // Try random pairs first
  for (let i = 0; i < maxAttempts; i++) {
    const [a, b] = shuffle(active).slice(0, 2);
    if (a.id === b.id) continue;
    if (avoidIds.has(a.id) && avoidIds.has(b.id)) continue;
    const key = pairKey(a.id, b.id);
    if (!shownPairs.includes(key)) {
      return [a, b];
    }
  }

  // Fallback: pick two least-shown items
  const sorted = [...active].sort(
    (a, b) =>
      (shownCount.get(a.id) ?? 0) - (shownCount.get(b.id) ?? 0) ||
      Math.random() - 0.5
  );
  const a = sorted[0];
  let b = sorted[1];
  // If b equals a (shouldn't), find next
  let idx = 1;
  while (b.id === a.id && idx < sorted.length - 1) {
    idx++;
    b = sorted[idx];
  }
  if (a.id === b.id) return null;
  return [a, b];
}

/**
 * Generate several pairs in advance for smoother UX. Returns unique pairs.
 */
export function generatePairQueue(
  items: ChoiceItem[],
  shownPairs: string[],
  count: number
): Pair[] {
  const queue: Pair[] = [];
  const localShown = [...shownPairs];

  for (let i = 0; i < count; i++) {
    const pair = generatePair(items, localShown, {
      avoidIds: queue[queue.length - 1]
        ? [queue[queue.length - 1][0].id, queue[queue.length - 1][1].id]
        : [],
    });
    if (!pair) break;
    queue.push(pair);
    localShown.push(pairKey(pair[0].id, pair[1].id));
  }

  return queue;
}

/**
 * Have we shown every possible pair? (n * (n-1) / 2)
 */
export function allPairsShown(
  items: ChoiceItem[],
  shownPairs: string[]
): boolean {
  const active = items.filter((i) => i.active);
  const totalPairs = (active.length * (active.length - 1)) / 2;
  return shownPairs.length >= totalPairs;
}
