import type {
  ChoiceItem,
  LocalStats,
  TasteProfile,
} from "@/types/choice";

/**
 * Compute the user's "taste profile" from their picks:
 *  - most-selected item (topPick)
 *  - most-selected category (topCategory)
 *  - share of picks in top category
 *  - a friendly Hebrew description ("הטעם שלך נוטה ל...")
 */
export function computeTasteProfile(
  items: ChoiceItem[],
  stats: LocalStats
): TasteProfile {
  const picks = stats.picks;
  if (picks.length === 0) {
    return {
      totalPicks: 0,
      topChoiceCount: 0,
      description: "עדיין לא בחרתם כלום. יאללה, מתחילים!",
      categoryBreakdown: [],
    };
  }

  const itemMap = new Map<string, ChoiceItem>();
  for (const it of items) itemMap.set(it.id, it);

  // Count selections per item
  const selectedCount = new Map<string, number>();
  const categoryCount = new Map<string, number>();

  for (const pick of picks) {
    selectedCount.set(
      pick.selectedId,
      (selectedCount.get(pick.selectedId) ?? 0) + 1
    );
    const item = itemMap.get(pick.selectedId);
    if (item?.category) {
      categoryCount.set(
        item.category,
        (categoryCount.get(item.category) ?? 0) + 1
      );
    }
  }

  // Top pick
  let topPickId: string | undefined;
  let topPickCount = 0;
  for (const [id, count] of selectedCount) {
    if (count > topPickCount) {
      topPickCount = count;
      topPickId = id;
    }
  }
  const topPick = topPickId ? itemMap.get(topPickId) : undefined;

  // Top category
  let topCategory: string | undefined;
  let topCategoryCount = 0;
  for (const [cat, count] of categoryCount) {
    if (count > topCategoryCount) {
      topCategoryCount = count;
      topCategory = cat;
    }
  }

  // Category breakdown
  const total = picks.length;
  const categoryBreakdown = Array.from(categoryCount.entries())
    .map(([category, count]) => ({
      category,
      count,
      share: count / total,
    }))
    .sort((a, b) => b.count - a.count);

  const description = buildDescription(topPick, topCategory, topPickCount, total);

  return {
    topPick,
    topCategory,
    topChoiceCount: topPickCount,
    totalPicks: total,
    description,
    categoryBreakdown,
  };
}

function buildDescription(
  topPick: ChoiceItem | undefined,
  topCategory: string | undefined,
  topPickCount: number,
  total: number
): string {
  if (!topPick) {
    return "עדיין לא בחרתם כלום. יאללה, מתחילים!";
  }
  const share = Math.round((topPickCount / total) * 100);
  const pickTitle = topPick.title;

  const flavors: Record<string, string[]> = {
    פירות: [
      `נראה שאתם נמשכים לדברים מתוקים וטבעיים — ${pickTitle} הוא הפרי שלכם.`,
      `יש לכם חולשה לפירות. ${pickTitle} מוביל אצלכם עם ${share}% מהבחירות.`,
    ],
    חיות: [
      `${pickTitle} גנב/ה את הלב שלכם — נראה שאתם אנשים של חיות.`,
      `אתם טיפוסים של בעלי חיים, ו-${pickTitle} בראש.`,
    ],
    שירים: [
      `${pickTitle} הוא הפסקול שלכם. נראה שיש לכם טעם מוזיקלי ברור.`,
      `האוזן שלכם בחרה — ${pickTitle} מוביל עם ${share}% מהבחירות.`,
    ],
    מקומות: [
      `נראה שהלב שלכם נוטה ל-${pickTitle}. אולי הגיע הזמן לטיול?`,
      `${pickTitle} בראש רשימת היעדים שלכם.`,
    ],
    דמויות: [
      `${pickTitle} הדמות שאתם מזדהים איתה הכי הרבה.`,
      `נראה שאתם רואים את עצמכם ב-${pickTitle}.`,
    ],
  };

  if (topCategory && flavors[topCategory]) {
    const lines = flavors[topCategory];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  // Generic fallbacks — varied, fun, Hebrew
  const generic = [
    `הבחירה המובילה שלכם היא ${pickTitle} עם ${share}% מהבחירות. יש לכם טעם ברור.`,
    `נראה שאתם יודעים מה אתם אוהבים — ${pickTitle} מוביל אצלכם בבירור.`,
    `${pickTitle} לקח/ה את המקום הראשון. ${share}% מהבחירות שלכם הלכו לשם.`,
    `יש לכם חולשה ל-${pickTitle}. לא צריך להתנצל על זה.`,
  ];
  return generic[Math.floor(Math.random() * generic.length)];
}

// Build shareable text for the Web Share API
export function buildShareText(profile: TasteProfile): string {
  if (!profile.topPick) {
    return `שיחקתי ב"מה עדיף?" — משחק הבחירות הכי מהיר וממכר שיש!`;
  }
  return `שיחקתי ב"מה עדיף?" והבחירה המובילה שלי היא: ${profile.topPick.title} 🎯\n\nבחרתי ${profile.totalPicks} פעמים, והטעם שלי נוטה ל${profile.topCategory ?? "..."}.\n\nבואו לשחק:`;
}
