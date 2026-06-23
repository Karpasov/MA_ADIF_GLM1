"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import type {
  ChoiceItem,
  GamePhase,
  Pair,
  UserPick,
} from "@/types/choice";
import { useChoices } from "@/hooks/useChoices";
import { useLocalStats } from "@/hooks/useLocalStats";
import { generatePair } from "@/utils/pairGenerator";
import { pairKey } from "@/utils/storage";
import { StartScreen } from "@/components/game/StartScreen";
import { ChoiceScreen } from "@/components/game/ChoiceScreen";
import { ResultsScreen } from "@/components/game/ResultsScreen";
import { LoadingState } from "@/components/game/LoadingState";
import { ErrorState } from "@/components/game/ErrorState";

const ROUNDS_PER_SESSION = 10;

export default function Home() {
  const { items, loading, error, reload } = useChoices();
  const { stats, recordPick, reset, ready } = useLocalStats();

  const [phase, setPhase] = useState<GamePhase>("start");
  const [currentPair, setCurrentPair] = useState<Pair | null>(null);
  const [round, setRound] = useState(1);

  // Generate a fresh pair from items + shown history.
  // Used as a pure helper (not in useEffect) to avoid infinite loops.
  const makePair = useCallback(
    (extraShownPairs: string[] = [], avoidIds: string[] = []): Pair | null => {
      if (items.length < 2) return null;
      return generatePair(items, [...stats.shownPairs, ...extraShownPairs], {
        avoidIds: avoidIds.length ? avoidIds : undefined,
      });
    },
    [items, stats.shownPairs]
  );

  const handleStart = useCallback(() => {
    if (items.length < 2) {
      setPhase("error");
      return;
    }
    // Show loading briefly so the transition feels intentional
    setPhase("loading");
    window.setTimeout(() => {
      const initialPair = makePair();
      if (!initialPair) {
        setPhase("error");
        return;
      }
      setCurrentPair(initialPair);
      setRound(1);
      setPhase("playing");
    }, 350);
  }, [items.length, makePair]);

  const handlePick = useCallback(
    (selected: ChoiceItem, pair: Pair) => {
      const pick: UserPick = {
        round: stats.totalRoundsCompleted + 1,
        optionAId: pair[0].id,
        optionBId: pair[1].id,
        selectedId: selected.id,
        timestamp: new Date().toISOString(),
      };
      recordPick(pick);

      // End of session → go to results
      if (round >= ROUNDS_PER_SESSION) {
        setPhase("results");
        return;
      }

      // Otherwise, advance to the next pair immediately.
      // We add the just-shown pair key to the avoid list manually
      // because stats.shownPairs hasn't propagated yet (setState is async).
      const justShownKey = pairKey(pair[0].id, pair[1].id);
      const nextPair = makePair([justShownKey], [pair[0].id, pair[1].id]);
      if (nextPair) {
        setCurrentPair(nextPair);
      }
      setRound((r) => r + 1);
    },
    [recordPick, round, stats.totalRoundsCompleted, makePair]
  );

  const handleContinue = useCallback(() => {
    // Continue for another 10 rounds
    const nextPair = makePair();
    if (!nextPair) {
      setPhase("error");
      return;
    }
    setCurrentPair(nextPair);
    setRound(1);
    setPhase("playing");
  }, [makePair]);

  const handleRestart = useCallback(() => {
    reset();
    setCurrentPair(null);
    setRound(1);
    setPhase("start");
  }, [reset]);

  const handleQuit = useCallback(() => {
    setCurrentPair(null);
    setRound(1);
    setPhase("start");
  }, []);

  const handleRetry = useCallback(() => {
    reload();
    setPhase("start");
  }, [reload]);

  const hasPreviousStats = ready && stats.totalRoundsCompleted > 0;

  return (
    <main className="relative min-h-[100dvh]">
      <AnimatePresence mode="wait">
        {phase === "start" && (
          <StartScreen
            key="start"
            onStart={handleStart}
            hasPreviousStats={hasPreviousStats}
            previousRounds={stats.totalRoundsCompleted}
          />
        )}

        {phase === "loading" && (
          <div key="loading">
            <LoadingState />
          </div>
        )}

        {phase === "playing" && currentPair && (
          <ChoiceScreen
            key={`choice-${round}-${currentPair[0].id}-${currentPair[1].id}`}
            pair={currentPair}
            round={round}
            totalRounds={ROUNDS_PER_SESSION}
            onPick={handlePick}
            onQuit={handleQuit}
          />
        )}

        {phase === "results" && (
          <ResultsScreen
            key="results"
            items={items}
            stats={stats}
            onContinue={handleContinue}
            onRestart={handleRestart}
          />
        )}

        {phase === "error" && (
          <ErrorState
            key="error"
            message={error ?? "אין מספיק אפשרויות למשחק. נסו לרענן."}
            onRetry={handleRetry}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
