// Type definitions for the "Pick One" / "מה עדיף?" app

export type ChoiceItem = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  active: boolean;
  weight?: number;
};

export type UserPick = {
  round: number;
  optionAId: string;
  optionBId: string;
  selectedId: string;
  timestamp: string;
};

export type ChoiceStats = {
  itemId: string;
  shown: number;
  selected: number;
};

export type GamePhase = "start" | "loading" | "playing" | "results" | "error";

export type Pair = [ChoiceItem, ChoiceItem];

// Persistent local-storage shape
export type LocalStats = {
  picks: UserPick[];
  stats: Record<string, ChoiceStats>;
  shownPairs: string[]; // canonical pair keys "idA|idB"
  totalRoundsCompleted: number;
  lastPlayed: string;
};

// Personality/taste profile computed from picks
export type TasteProfile = {
  topPick?: ChoiceItem;
  topCategory?: string;
  topChoiceCount: number;
  totalPicks: number;
  description: string;
  categoryBreakdown: Array<{ category: string; count: number; share: number }>;
};

// Google Sheet config — set NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL in env to use live data
export type SheetConfig = {
  csvUrl?: string;
  appsScriptUrl?: string;
};
