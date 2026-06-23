"use client";

import { motion } from "framer-motion";
import { Check, ImageOff } from "lucide-react";
import { useState } from "react";
import type { ChoiceItem } from "@/types/choice";

type Props = {
  item: ChoiceItem;
  index: number;
  side: "right" | "left";
  disabled?: boolean;
  state?: "idle" | "winner" | "loser";
  onPick: (item: ChoiceItem) => void;
};

// Deterministic palette per item, alternating between ember/volt/rose/acid
function paletteFor(id: string): {
  base: string;
  cast: string;
  rim: string;
} {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const palettes = [
    { base: "card-ember", cast: "cast-ember", rim: "card-rim-ember" },
    { base: "card-volt", cast: "cast-volt", rim: "card-rim-volt" },
    { base: "card-rose", cast: "cast-rose", rim: "card-rim-rose" },
    { base: "card-acid", cast: "card-rim-acid", rim: "card-rim-acid" },
  ];
  return palettes[hash % palettes.length];
}

function emojiForCategory(category?: string): string {
  const map: Record<string, string> = {
    פירות: "🍎",
    חיות: "🐾",
    מקומות: "📍",
    אוכל: "🍽️",
    שתייה: "🥤",
    פעילויות: "🎯",
    שירים: "🎵",
    דמויות: "🎭",
  };
  return category ? map[category] ?? "🎯" : "🎯";
}

export function ChoiceCard({
  item,
  index,
  side,
  disabled,
  state = "idle",
  onPick,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const palette = paletteFor(item.id);
  const hasImage = !!item.imageUrl && !imgError;

  const isWinner = state === "winner";
  const isLoser = state === "loser";

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => onPick(item)}
      data-side={side}
      data-item-id={item.id}
      className={`
        card-depth ${palette.base} ${palette.cast}
        relative w-full text-right rounded-[1.75rem] overflow-hidden
        ${isWinner ? "glow-acid pulse-glow" : ""}
        ${isLoser ? "opacity-30 grayscale blur-[2px]" : ""}
        ${disabled ? "cursor-default" : "cursor-pointer"}
        transition-[filter,opacity] duration-500
      `}
      initial={{ opacity: 0, y: 60, scale: 0.9, rotate: side === "right" ? -3 : 3 }}
      animate={{
        opacity: isLoser ? 0.3 : 1,
        y: 0,
        scale: isWinner ? 1.04 : 1,
        rotate: isWinner ? 0 : side === "right" ? -1.5 : 1.5,
      }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 240,
        damping: 22,
      }}
      whileHover={disabled ? undefined : { scale: 1.03, y: -6 }}
      whileTap={disabled ? undefined : { scale: 0.97, y: 0 }}
    >
      {/* Hero area */}
      <div className="relative aspect-[4/5] sm:aspect-[5/6] w-full">
        {hasImage ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-[7rem] sm:text-[8.5rem] drop-shadow-2xl relative z-10"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {emojiForCategory(item.category)}
            </motion.div>
          </div>
        )}

        {/* Dark gradient overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, transparent 35%, oklch(0.13 0.03 290 / 0.85) 100%)",
          }}
        />

        {/* Top row: A/B badge + category chip */}
        <div className="absolute top-3.5 inset-x-3.5 z-10 flex items-start justify-between">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-base"
            style={{
              background: "oklch(1 0 0 / 0.18)",
              backdropFilter: "blur(8px)",
              border: "1px solid oklch(1 0 0 / 0.25)",
              color: "white",
            }}
          >
            {side === "right" ? "A" : "B"}
          </div>

          {item.category && (
            <div
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "oklch(1 0 0 / 0.18)",
                backdropFilter: "blur(8px)",
                border: "1px solid oklch(1 0 0 / 0.25)",
                color: "white",
              }}
            >
              {item.category}
            </div>
          )}
        </div>

        {/* Winner badge */}
        {isWinner && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "var(--acid)",
              boxShadow: "0 0 40px 8px oklch(0.91 0.22 124 / 0.6)",
            }}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 280, delay: 0.1 }}
          >
            <Check className="w-10 h-10 text-ink-2" strokeWidth={4} />
          </motion.div>
        )}

        {/* Image error indicator */}
        {imgError && item.imageUrl && (
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-10 px-2 py-1 rounded-full bg-black/60 backdrop-blur text-white text-xs flex items-center gap-1">
            <ImageOff className="w-3 h-3" />
          </div>
        )}

        {/* Bottom text content */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white z-10">
          <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tight drop-shadow-lg mb-1.5 leading-none">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm sm:text-base text-white/85 leading-snug line-clamp-2 font-medium">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
}
