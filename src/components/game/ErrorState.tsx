"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-amber-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-violet-950">
          משהו השתבש
        </h2>
        <p className="text-violet-900/70 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          size="lg"
          className="btn-shine bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700"
        >
          <RefreshCw className="w-4 h-4 ml-2" />
          נסו שוב
        </Button>
      )}
    </div>
  );
}
