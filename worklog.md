---
Task ID: pick-one-website
Agent: main
Task: בניית אתר "מה עדיף?" מלא — React + Next.js + TypeScript + Tailwind + Framer Motion, RTL עברית, עם מקור נתונים מ-Google Sheets

Work Log:
- אתחלתי סביבת fullstack-dev עם Next.js 16 + React 19 + TypeScript + Tailwind 4 + shadcn/ui.
- עיצבתי מערכת צבעים וגרדיאנטים ב-globals.css (violet/fuchsia/pink, animated blobs, glass cards).
- הגדרתי RTL + עברית + פונט Heebo ב-layout.tsx.
- בניתי types/choice.ts עם כל סוגי הנתונים (ChoiceItem, UserPick, LocalStats, TasteProfile, Pair).
- כתבתי utils/storage.ts (loadStats/saveStats/recordPick/reset/pairKey), pairGenerator.ts (shuffle + generatePair + avoid-recent-pairs), scoring.ts (computeTasteProfile + buildShareText).
- בניתי data/sampleItems.ts (32 פריטים ב-7 קטגוריות) ו-data/googleSheets.ts (תומך CSV + Apps Script + fallback).
- כתבתי hooks: useChoices (טעינת פריטים + reload), useLocalStats (localStorage + recordPick).
- בניתי 7 קומפוננטות: StartScreen, ChoiceCard, ChoiceScreen, ResultsScreen, ProgressBar, LoadingState, ErrorState — עם Framer Motion (entrance, exit, win-pulse, confetti).
- חיברתי הכל ב-page.tsx עם ניהול state (phase: start/loading/playing/results/error) ומעברי AnimatePresence.
- תיקנתי שגיאות lint (react-hooks/set-state-in-effect).
- תיקנתי באג קריטי: "Maximum update depth exceeded" — ה-useEffect שיצר את הזוג יצר לולאה אינסופית בגלל ש-currentPair היה ב-dependencies. העברתי את יצירת הזוג לתוך handleStart/handlePick/handleContinue (פונקציות event handler) במקום useEffect.
- הרצתי lint נקי.
- בדקתי עם Agent Browser: מסך פתיחה → 10 בחירות → מסך תוצאות עם קונפטי + Top-3 + פילוח קטגוריות → "המשך לשחק" ו"התחל מחדש" עובדים.
- בדקתי מצב mobile (390x844) — כרטיסים מוצגים אנכית.
- וידאתי שאין שגיאות ב-console והשרת רץ נקי (GET 200).
- כתבתי README.md עם הוראות CSV / Apps Script / פריסה ל-Vercel+Netlify / QA / פיצ'רים עתידיים.
- יצרתי קבצי עזר ב-download/: google-apps-script.gs (מוכן להעתקה), google-sheet-template.csv (דוגמת נתונים), 5 צילומי מסך של כל המסכים.

Stage Summary:
- אתר מלא ופעיל ב-`/` — כל הזרימה עובדת end-to-end.
- נתונים נטענים מ-Google Sheets (CSV או Apps Script) עם fallback ל-32 פריטים מובנים.
- localStorage שומר היסטוריית בחירות, סטטיסטיקות, וזוגות שהוצגו — מאפשר הימנעות מחזרות.
- עיצוב פרימיום: גרדיאנטים, glass cards, win-pulse, confetti, gradient-text, animated blobs.
- mobile-first + RTL + safe-area insets.
- Web Share API לשיתוף תוצאות.
- קוד מחולק נכון ל-data/hooks/components/types/utils.
- ללא שגיאות lint או runtime.
- קבצים להורדה: google-apps-script.gs, google-sheet-template.csv, 5 screenshots.
