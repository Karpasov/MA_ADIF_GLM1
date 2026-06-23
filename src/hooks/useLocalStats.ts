"use client";

import { useCallback, useEffect, useState } from "react";
import type { LocalStats, UserPick } from "@/types/choice";
import {
  loadStats,
  saveStats,
  resetStats,
  recordPick as recordPickUtil,
} from "@/utils/storage";

export type UseLocalStatsState = {
  stats: LocalStats;
  recordPick: (pick: UserPick) => void;
  reset: () => void;
  ready: boolean;
};

const EMPTY: LocalStats = {
  picks: [],
  stats: {},
  shownPairs: [],
  totalRoundsCompleted: 0,
  lastPlayed: "",
};

export function useLocalStats(): UseLocalStatsState {
  const [stats, setStats] = useState<LocalStats>(EMPTY);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(loadStats());
    setReady(true);
  }, []);

  const recordPick = useCallback((pick: UserPick) => {
    setStats((prev) => {
      const next = recordPickUtil(prev, pick);
      saveStats(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const fresh = resetStats();
    setStats(fresh);
  }, []);

  return { stats, recordPick, reset, ready };
}
