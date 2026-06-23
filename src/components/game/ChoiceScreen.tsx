"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import { useState } from "react";
import type { ChoiceItem, Pair } from "@/types/choice";
import { ChoiceCard } from "./ChoiceCard";

type Props = {
  pair: Pair;
  round: number;
  totalRounds: number;
  onPick: (selected: ChoiceItem, pair: Pair) => void;
  onQuit: () => void;
};

type Phase = "idle" | "revealing" | "done";

export function ChoiceScreen({
  pair,
  round,
  totalRounds,
  onPick,
  onQuit,
}: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [winner, setWinner] = useState<ChoiceItem | null>(null);

  const [a, b] = pair;
  const pct = Math.min(100, (round / totalRounds) * 100);

  function handlePick(item: ChoiceItem) {
    if (phase !== "idle") return;
    setWinner(item);
    setPhase("revealing");
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
    window.setTimeout(() => {
      setPhase("done");
      onPick(item, pair);
    }, 800);
  }

  return (
    <motion.div
      className="relative flex flex-col min-h-[100dvh] px-4 sm:px-6 py-5 sm:py-7"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top bar: progress + quit */}
      <div className="flex items-center gap-3 mb-5 sm:mb-7">
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 0.08)" }}>
            <motion.div
              className="h-full rounded-full progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />
          </div>
          <div className="font-display font-bold text-sm tabular text-cream/80 min-w-[60px] text-left">
            {round}/{totalRounds}
          </div>
        </div>
        <button
          onClick={onQuit}
          className="w-9 h-9 rounded-full glass flex items-center justify-center text-cream/60 hover:text-cream hover:bg-white/10 transition-colors"
          aria-label="יציאה"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Question */}
      <div className="text-center mb-5 sm:mb-7">
        <motion.h2
          key={`q-${round}`}
          className="font-display font-black text-4xl sm:text-5xl tracking-tight gradient-text mb-1"
          initial={{ y: 12, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          מה עדיף?
        </motion.h2>
        <motion.p
          key={`s-${round}`}
          className="text-xs sm:text-sm text-cream/50 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
        >
          בחירה מספר {round} מתוך {totalRounds} · אל תחשבו יותר מדי
        </motion.p>
      </div>

      {/* Cards + VS */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-5">
          <div className="flex-1 max-w-sm mx-auto w-full">
            <AnimatePresence mode="wait">
              <ChoiceCard
                key={`a-${a.id}-${round}`}
                item={a}
                index={0}
                side="right"
                state={
                  winner ? (winner.id === a.id ? "winner" : "loser") : "idle"
                }
                disabled={phase !== "idle"}
                onPick={handlePick}
              />
            </AnimatePresence>
          </div>

          {/* VS badge */}
          <div className="flex items-center justify-center my-1 sm:my-0">
            <motion.div
              className="vs-badge w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-display font-black text-lg sm:text-xl text-white shadow-2xl"
              style={{ boxShadow: "0 8px 24px -6px oklch(0 0 0 / 0.5)" }}
              animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              VS
            </motion.div>
          </div>

          <div className="flex-1 max-w-sm mx-auto w-full">
            <AnimatePresence mode="wait">
              <ChoiceCard
                key={`b-${b.id}-${round}`}
                item={b}
                index={1}
                side="left"
                state={
                  winner ? (winner.id === b.id ? "winner" : "loser") : "idle"
                }
                disabled={phase !== "idle"}
                onPick={handlePick}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="text-center mt-4 sm:mt-6">
        <p className="text-xs text-cream/40 font-medium flex items-center justify-center gap-1.5">
          <Zap className="w-3 h-3" />
          לחצו על הכרטיס שאתם מעדיפים · אל תחשבו יותר מדי
        </p>
      </div>
    </motion.div>
  );
}
