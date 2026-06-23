import type { LocalStats, UserPick, ChoiceStats } from "@/types/choice";

const STORAGE_KEY = "pick-one-stats-v1";
const SESSION_KEY = "pick-one-session-v1";

function emptyStats(): LocalStats {
  return {
    picks: [],
    stats: {},
    shownPairs: [],
    totalRoundsCompleted: 0,
    lastPlayed: "",
  };
}

// SSR-safe: returns empty stats on server
export function loadStats(): LocalStats {
  if (typeof window === "undefined") return emptyStats();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStats();
    const parsed = JSON.parse(raw) as Partial<LocalStats>;
    return {
      picks: parsed.picks ?? [],
      stats: parsed.stats ?? {},
      shownPairs: parsed.shownPairs ?? [],
      totalRoundsCompleted: parsed.totalRoundsCompleted ?? 0,
      lastPlayed: parsed.lastPlayed ?? "",
    };
  } catch {
    return emptyStats();
  }
}

export function saveStats(stats: LocalStats): void {
  if (typeof window === "undefined") return;
  try {
    stats.lastPlayed = new Date().toISOString();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // localStorage may be unavailable (private mode); fail silently
  }
}

export function resetStats(): LocalStats {
  const fresh = emptyStats();
  saveStats(fresh);
  return fresh;
}

// Canonical key for a pair: sorted IDs joined by "|"
export function pairKey(aId: string, bId: string): string {
  return [aId, bId].sort().join("|");
}

export function recordPick(
  stats: LocalStats,
  pick: UserPick
): LocalStats {
  const newStats: LocalStats = {
    picks: [...stats.picks, pick],
    stats: { ...stats.stats },
    shownPairs: [...stats.shownPairs],
    totalRoundsCompleted: stats.totalRoundsCompleted + 1,
    lastPlayed: new Date().toISOString(),
  };

  // Update shown count for both items
  for (const id of [pick.optionAId, pick.optionBId]) {
    const cur = newStats.stats[id] ?? { itemId: id, shown: 0, selected: 0 };
    newStats.stats[id] = { ...cur, shown: cur.shown + 1 };
  }

  // Update selected count for chosen item
  const sel = newStats.stats[pick.selectedId] ?? {
    itemId: pick.selectedId,
    shown: 0,
    selected: 0,
  };
  newStats.stats[pick.selectedId] = {
    ...sel,
    selected: sel.selected + 1,
  };

  // Mark pair as shown
  const key = pairKey(pick.optionAId, pick.optionBId);
  if (!newStats.shownPairs.includes(key)) {
    newStats.shownPairs.push(key);
  }

  return newStats;
}

// Light-weight session storage (current run only, optional)
export function loadSession(): { round: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as { round: number }) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: { round: number }): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// Helper to read all stats for a single item
export function getItemStats(
  stats: LocalStats,
  itemId: string
): ChoiceStats {
  return (
    stats.stats[itemId] ?? { itemId, shown: 0, selected: 0 }
  );
}
