"use client";

import { motion } from "framer-motion";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-violet-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 border-r-fuchsia-500" />
      </motion.div>
      <motion.p
        className="text-violet-900/70 font-medium"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        טוענים אפשרויות...
      </motion.p>
    </div>
  );
}
