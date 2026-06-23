"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  onStart: () => void;
  hasPreviousStats: boolean;
  previousRounds?: number;
};

const FLOATING_PREVIEWS = [
  { title: "תפוז", emoji: "🍊", grad: "card-ember", side: "right" },
  { title: "בננה", emoji: "🍌", grad: "card-volt", side: "left" },
  { title: "פיצה", emoji: "🍕", grad: "card-rose", side: "right" },
  { title: "קפה", emoji: "☕", grad: "card-acid", side: "left" },
];

export function StartScreen({ onStart, hasPreviousStats, previousRounds }: Props) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <motion.div
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
    >
      {/* Floating preview cards — desktop only (clutter on mobile) */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        {FLOATING_PREVIEWS.map((card, i) => {
          const isRight = card.side === "right";
          return (
            <motion.div
              key={i}
              className={`absolute top-1/2 ${
                isRight ? "right-[8%]" : "left-[8%]"
              } -translate-y-1/2 w-44 h-56 sm:w-52 sm:h-64 rounded-3xl ${card.grad} card-depth ${
                isRight ? "cast-ember" : "cast-volt"
              } ${card.side === "left" && i === 1 ? "cast-rose" : ""} ${
                card.side === "left" && i === 3 ? "glow-acid" : ""
              } overflow-hidden flex flex-col items-center justify-center gap-3 text-center p-4`}
              style={{
                transform: `translateY(-50%) translate(${mouse.x * 14 * (isRight ? -1 : 1)}px, ${
                  mouse.y * 8 * (i % 2 === 0 ? -1 : 1)
                }px) rotate(${isRight ? -6 : 6}deg)`,
              }}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 0.9, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 120 }}
            >
              <div className="text-6xl drop-shadow-2xl relative z-10">{card.emoji}</div>
              <div className="text-white font-bold text-lg relative z-10">
                {card.title}
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-semibold relative z-10">
                {isRight ? "A" : "B"}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Top badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 sm:mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-acid opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-acid"></span>
          </span>
          <span className="text-xs sm:text-sm font-semibold text-cream/80">
            Pick One · משחק הבחירות
          </span>
        </motion.div>

        {/* Massive title */}
        <motion.h1
          className="display-text text-[clamp(4rem,18vw,9rem)] mb-3 sm:mb-4"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 140, damping: 14 }}
        >
          <span className="gradient-text">מה עדיף?</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-2xl text-cream/85 font-medium mb-1.5 max-w-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          משחק הבחירות הכי מהיר, מצחיק וממכר שיש.
        </motion.p>
        <motion.p
          className="text-sm sm:text-base text-cream/50 mb-10 sm:mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          בחרו מהר. אל תחשבו יותר מדי.
        </motion.p>

        {/* CTA */}
        <motion.button
          onClick={onStart}
          className="group relative cta-acid font-display font-extrabold text-xl sm:text-2xl px-10 sm:px-14 py-5 sm:py-6 rounded-full overflow-hidden transition-transform"
          initial={{ y: 30, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 180, damping: 14 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96, y: 0 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-ink-2/30" strokeWidth={2.5} />
            יאללה, מתחילים
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
          </span>
        </motion.button>

        {/* Hint chips */}
        <motion.div
          className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-2.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {[
            { icon: "⚡", text: "10 בחירות" },
            { icon: "🎯", text: "מותאם אישית" },
            { icon: "📱", text: "מובייל first" },
          ].map((chip) => (
            <span
              key={chip.text}
              className="px-3.5 py-1.5 rounded-full glass text-cream/75 text-xs sm:text-sm font-medium flex items-center gap-1.5"
            >
              <span>{chip.icon}</span>
              {chip.text}
            </span>
          ))}
        </motion.div>

        {/* Returning user hint */}
        {hasPreviousStats && previousRounds != null && previousRounds > 0 && (
          <motion.div
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium"
            style={{
              background: "oklch(0.91 0.22 124 / 0.12)",
              border: "1px solid oklch(0.91 0.22 124 / 0.4)",
              color: "var(--acid)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            שיחקתם כבר {previousRounds} סבבים. רוצים לשבור את השיא?
          </motion.div>
        )}
      </div>

      {/* Bottom signature */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cream/30 text-[10px] font-medium tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        כל הבחירות נשמרות רק אצלכם · בואו לגלות את הטעם שלכם
      </motion.div>
    </motion.div>
  );
}
