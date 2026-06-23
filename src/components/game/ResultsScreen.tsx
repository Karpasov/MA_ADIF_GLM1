"use client";

import { motion } from "framer-motion";
import {
  RotateCcw,
  Share2,
  Play,
  Trophy,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ChoiceItem, LocalStats } from "@/types/choice";
import { computeTasteProfile, buildShareText } from "@/utils/scoring";

type Props = {
  items: ChoiceItem[];
  stats: LocalStats;
  onContinue: () => void;
  onRestart: () => void;
};

// Count-up hook
function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now() + delay;
    let raf = 0;
    const tick = (now: number) => {
      if (now < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return value;
}

export function ResultsScreen({ items, stats, onContinue, onRestart }: Props) {
  const profile = useMemo(() => computeTasteProfile(items, stats), [items, stats]);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">("idle");

  const animatedPicks = useCountUp(profile.totalPicks, 1000, 400);
  const animatedTopPct = useCountUp(
    profile.totalPicks > 0
      ? Math.round((profile.topChoiceCount / profile.totalPicks) * 100)
      : 0,
    1200,
    700
  );

  const topItems = useMemo(() => {
    const itemMap = new Map<string, ChoiceItem>();
    for (const it of items) itemMap.set(it.id, it);

    return Object.values(stats.stats)
      .map((s) => ({
        item: itemMap.get(s.itemId),
        selected: s.selected,
        shown: s.shown,
        rate: s.shown > 0 ? s.selected / s.shown : 0,
      }))
      .filter((x) => x.item && x.selected > 0)
      .sort((a, b) => b.selected - a.selected || b.rate - a.rate)
      .slice(0, 3);
  }, [items, stats]);

  async function handleShare() {
    const text = buildShareText(profile);
    const shareData: ShareData = {
      title: "מה עדיף? — התוצאה שלי",
      text,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        setShareStatus("shared");
      } catch {
        await copyToClipboard(text);
      }
    } else {
      await copyToClipboard(text);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("copied");
      window.setTimeout(() => setShareStatus("idle"), 2200);
    } catch {
      // ignore
    }
  }

  // Confetti dots
  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 1.8 + Math.random() * 1.6,
        color: ["#f59e0b", "#ec4899", "#a855f7", "#84cc16", "#06b6d4"][i % 5],
        size: 6 + Math.random() * 10,
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <motion.div
      className="relative min-h-[100dvh] px-4 sm:px-6 py-8 sm:py-12 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Confetti layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            className="absolute top-0 rounded-sm"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 0.6,
              background: c.color,
              borderRadius: c.id % 3 === 0 ? "9999px" : "2px",
            }}
            initial={{ y: -50, opacity: 0, rotate: 0 }}
            animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 720 + c.rotate }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              ease: "easeIn",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Header badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-5"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Trophy className="w-4 h-4 text-acid" />
          <span className="text-sm font-bold text-cream/90">התוצאות מוכנות</span>
        </motion.div>

        {/* Big title */}
        <motion.h1
          className="font-display font-black text-[clamp(3rem,10vw,5.5rem)] tracking-tight text-center mb-3"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <span className="gradient-text">זה הטעם שלך</span>
        </motion.h1>

        {/* Picks count */}
        <motion.div
          className="flex items-baseline gap-2 mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-cream/70 text-base sm:text-lg">בחרתם</span>
          <span className="font-display font-black text-3xl sm:text-4xl gradient-text-acid tabular">
            {animatedPicks}
          </span>
          <span className="text-cream/70 text-base sm:text-lg">פעמים</span>
        </motion.div>

        {/* Top pick hero card */}
        {profile.topPick && (
          <motion.div
            className="w-full mt-6 mb-6 p-6 sm:p-7 rounded-[1.75rem] card-depth card-acid card-rim-acid relative overflow-hidden"
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 160, damping: 18 }}
            style={{
              boxShadow:
                "inset 0 1px 0 0 oklch(1 0 0 / 0.35), 0 0 0 2px oklch(0.91 0.22 124 / 0.5), 0 24px 60px -16px oklch(0.6 0.22 140 / 0.45), 0 8px 20px -6px oklch(0.91 0.22 124 / 0.3)",
            }}
          >
            {/* Big pct in background */}
            <div className="absolute top-4 left-5 font-display font-black text-7xl sm:text-8xl text-ink-2/15 leading-none pointer-events-none select-none">
              {animatedTopPct}%
            </div>

            <div className="relative z-10 flex items-center gap-2 mb-2 text-ink-2/70 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              הבחירה המובילה שלך
            </div>
            <div className="relative z-10 font-display font-black text-4xl sm:text-5xl text-ink-2 mb-2 leading-none">
              {profile.topPick.title}
            </div>
            {profile.topPick.description && (
              <p className="relative z-10 text-ink-2/70 text-sm sm:text-base font-medium">
                {profile.topPick.description}
              </p>
            )}
            <div className="relative z-10 mt-4 flex items-center gap-2 text-ink-2 text-xs font-semibold">
              <span
                className="px-2.5 py-1 rounded-full"
                style={{ background: "oklch(0.18 0.04 290 / 0.15)" }}
              >
                {profile.topChoiceCount} בחירות · {animatedTopPct}%
              </span>
              {profile.topCategory && (
                <span
                  className="px-2.5 py-1 rounded-full"
                  style={{ background: "oklch(0.18 0.04 290 / 0.15)" }}
                >
                  {profile.topCategory}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          className="w-full p-4 sm:p-5 rounded-2xl glass mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.72 0.24 8 / 0.2)" }}
            >
              <TrendingUp className="w-5 h-5 text-rose" />
            </div>
            <p className="text-cream/90 leading-relaxed font-medium pt-1.5 text-sm sm:text-base">
              {profile.description}
            </p>
          </div>
        </motion.div>

        {/* Top 3 ranking */}
        {topItems.length > 0 && (
          <motion.div
            className="w-full mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.85 }}
          >
            <h3 className="text-cream/80 font-display font-bold mb-3 text-sm uppercase tracking-wider">
              דירוג שלושת המובילים
            </h3>
            <div className="space-y-2">
              {topItems.map((entry, i) => (
                <motion.div
                  key={entry.item!.id}
                  className="flex items-center gap-3 p-3 rounded-2xl glass"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.95 + i * 0.1, type: "spring", stiffness: 200 }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm ${
                      i === 0
                        ? "text-ink-2"
                        : i === 1
                        ? "text-cream"
                        : "text-cream"
                    }`}
                    style={{
                      background:
                        i === 0
                          ? "var(--acid)"
                          : i === 1
                          ? "oklch(0.7 0.05 60)"
                          : "oklch(0.5 0.04 30)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-display font-bold text-cream">
                      {entry.item!.title}
                    </div>
                    {entry.item!.category && (
                      <div className="text-xs text-cream/50">{entry.item!.category}</div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-display font-bold text-cream tabular">
                      {entry.selected}
                    </div>
                    <div className="text-xs text-cream/50">
                      {Math.round(entry.rate * 100)}% ניצחונות
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Category breakdown */}
        {profile.categoryBreakdown.length > 1 && (
          <motion.div
            className="w-full mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-cream/80 font-display font-bold mb-3 text-sm uppercase tracking-wider">
              פילוח לפי קטגוריה
            </h3>
            <div className="space-y-2">
              {profile.categoryBreakdown.map((c, i) => (
                <div
                  key={c.category}
                  className="flex items-center gap-3 p-3 rounded-2xl glass"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-cream text-sm">
                      {c.category}
                    </div>
                    <div className="mt-1.5 h-2 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 0.08)" }}>
                      <motion.div
                        className="h-full progress-fill rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${c.share * 100}%` }}
                        transition={{ delay: 1.1 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-display font-bold text-cream tabular min-w-[44px] text-left">
                    {Math.round(c.share * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="w-full flex flex-col sm:flex-row gap-3 mt-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.15 }}
        >
          <motion.button
            onClick={onContinue}
            className="flex-1 px-5 py-4 rounded-full cta-acid font-display font-extrabold text-base sm:text-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play className="w-4 h-4 fill-ink-2/40" strokeWidth={2.5} />
            המשך לשחק
          </motion.button>
          <motion.button
            onClick={onRestart}
            className="flex-1 px-5 py-4 rounded-full cta-ghost font-display font-bold text-base sm:text-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
            התחל מחדש
          </motion.button>
        </motion.div>

        {/* Share button */}
        <motion.button
          onClick={handleShare}
          className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
          style={{
            background: "oklch(0.72 0.24 8 / 0.15)",
            border: "1px solid oklch(0.72 0.24 8 / 0.4)",
            color: "var(--rose)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <Share2 className="w-4 h-4" />
          {shareStatus === "copied"
            ? "הועתק ללוח ✓"
            : shareStatus === "shared"
            ? "שותף ✓"
            : "שתף את התוצאה"}
        </motion.button>
      </div>
    </motion.div>
  );
}
