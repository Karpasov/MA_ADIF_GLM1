"use client";

import { motion } from "framer-motion";

type Props = {
  current: number; // 1-indexed
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full flex items-center gap-3 select-none">
      <div className="flex-1 h-2.5 bg-white/50 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>
      <div className="text-sm font-semibold tabular text-violet-900/80 min-w-[64px] text-left">
        {current}/{total}
      </div>
    </div>
  );
}
