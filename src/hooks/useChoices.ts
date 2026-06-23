"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChoiceItem } from "@/types/choice";
import { loadItems, type LoadResult } from "@/data/googleSheets";

export type UseChoicesState = {
  items: ChoiceItem[];
  loading: boolean;
  error: string | null;
  source: LoadResult["source"] | null;
  reload: () => void;
};

export function useChoices(): UseChoicesState {
  const [items, setItems] = useState<ChoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<LoadResult["source"] | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    loadItems(controller.signal)
      .then((result) => {
        setItems(result.items);
        setSource(result.ok ? result.source : "fallback");
        if (!result.ok) {
          setError(result.error);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message ?? "שגיאה לא צפויה");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [reloadToken]);

  return { items, loading, error, source, reload };
}
