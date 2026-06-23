# מה עדיף? · Pick One

> משחק הבחירות הכי מהיר, מצחיק וממכר שיש. בחרו בין שתי אפשרויות, גלו את הטעם שלכם, ושתפו את התוצאה.

אתר Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Framer Motion.
עברית, RTL, mobile-first, עם מקור נתונים מ-Google Sheets (או נתוני דוגמה מובנים).

---

## 🎯 מה יש באתר

| מסך | תיאור |
|------|------|
| **פתיחה** | כותרת גדולה "מה עדיף?" עם גרדיאנט חי, אנימציות emoji, וכפתור "יאללה, מתחילים" |
| **בחירה** | שני כרטיסים גדולים עם תמונה/גרדיאנט, ספיר "או" באמצע, progress bar למעלה, כפתור יציאה |
| **תוצאות** | קונפטי, "זה הטעם שלך", הפריט המוביל, דירוג Top‑3, פילוח קטגוריות, 3 כפתורי פעולה |
| **שיתוף** | Web Share API במובייל, העתקה ללוח בדסקטופ |

האתר שומר את כל הבחירות ב-`localStorage`, כך שגם אחרי רענון ההיסטוריה נשמרת.

---

## 🚀 הרצה מקומית

```bash
bun install      # או npm install
bun run dev      # מריץ את השרת בפורט 3000
```

פתחו את `http://localhost:3000`.

### בדיקת איכות קוד

```bash
bun run lint
```

---

## 📊 חיבור ל-Google Sheets

יש שתי דרכים. ברירת המחדל: האתר משתמש בנתוני דוגמה מובנים (`src/data/sampleItems.ts`),
כך שהוא עובד מיד בלי שום הגדרה. כדי לחבר Google Sheet אמיתי:

### אפשרות א׳ — Published CSV (פשוטה, מומלצת ל-MVP)

1. צרו Google Sheet חדש ב-`https://sheets.new`.
2. בשורה הראשונה, הזינו את הכותרות הבאות (בדיוק כך, באנגלית, case-sensitive):

   | id | title | description | category | imageUrl | active | weight |
   |----|-------|-------------|----------|----------|--------|--------|
   | orange | תפוז | פרי הדר כתום ומתוק | פירות | https://...orange.jpg | TRUE | 1 |
   | banana | בננה | פרי צהוב ומתוק | פירות | https://...banana.jpg | TRUE | 1 |
   | apple | תפוח | קלאסי, פריך ומתוק | פירות |  | TRUE | 1 |

3. **File → Share → Publish to web**
   - Choose: הגיליון שלכם (Sheet1 או השם שנתתם)
   - Format: **Comma-separated values (.csv)**
   - לחצו **Publish**
4. העתיקו את ה-URL שמתקבל — נראה כך:
   `https://docs.google.com/spreadsheets/d/e/<ID>/pub?gid=0&single=true&output=csv`
5. צרו קובץ `.env.local` בשורש הפרויקט:

   ```bash
   NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/<ID>/pub?gid=0&single=true&output=csv
   ```

6. אתחלו את השרת (`bun run dev`). האתר ייקרא את הנתונים מה-Sheet.

> **טיפ:** שדה `imageUrl` אופציונלי. אם אין תמונה, הכרטיס יציג גרדיאנט יפה עם emoji לפי קטגוריה.

### אפשרות ב׳ — Google Apps Script (מתקדם, מחזיר JSON)

מתאים אם רוצים לוגיקה בצד Google (סינון, מיון, שליפת כמה גיליונות וכו').

1. ב-Sheet, **Extensions → Apps Script**
2. הדביקו את הקוד הבא:

   ```javascript
   function doGet() {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
     const rows = sheet.getDataRange().getValues();
     const headers = rows[0];
     const items = rows.slice(1).map(function (row) {
       const obj = {};
       headers.forEach(function (h, i) {
         obj[h] = row[i];
       });
       return {
         id: String(obj.id).trim(),
         title: String(obj.title).trim(),
         description: obj.description ? String(obj.description) : undefined,
         category: obj.category ? String(obj.category) : undefined,
         imageUrl: obj.imageUrl ? String(obj.imageUrl) : undefined,
         active: (String(obj.active).toLowerCase() === 'true' || obj.active === true),
         weight: Number(obj.weight) || 1,
       };
     }).filter(function (i) { return i.id && i.title; });

     return ContentService
       .createTextOutput(JSON.stringify(items))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. אשרו את ההרשאות, העתיקו את ה-URL (נראה כך: `https://script.google.com/macros/s/<ID>/exec`).
5. ב-`.env.local`:

   ```bash
   NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/<ID>/exec
   ```

> האתר ינסה קודם את Apps Script (אם מוגדר), ואז CSV, ולבסוף ייפול על נתוני הדוגמה.

---

## 📁 מבנה הפרויקט

```
src/
├── app/
│   ├── layout.tsx        # RTL + פונט Heebo + metadata
│   ├── page.tsx          # ניהול state ומעברי מסכים
│   └── globals.css       # מערכת עיצוב: גרדיאנטים, אנימציות, צבעים
├── components/
│   ├── game/
│   │   ├── StartScreen.tsx
│   │   ├── ChoiceCard.tsx
│   │   ├── ChoiceScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── LoadingState.tsx
│   │   └── ErrorState.tsx
│   └── ui/               # shadcn/ui components
├── data/
│   ├── googleSheets.ts   # טעינת נתונים (CSV / Apps Script / fallback)
│   └── sampleItems.ts    # 32 פריטים מובנים למצב התחלתי
├── hooks/
│   ├── useChoices.ts     # טעינת ו-caching של רשימת הפריטים
│   └── useLocalStats.ts  # ניהול localStorage + היסטוריית בחירות
├── types/
│   └── choice.ts         # כל סוגי הנתונים
└── utils/
    ├── storage.ts        # קריאה/כתיבה של localStorage + עדכון סטטיסטיקות
    ├── pairGenerator.ts  # לוגיקת בחירת זוג אקראי ללא חזרות
    └── scoring.ts        # חישוב פרופיל טעם + טקסט שיתוף
```

---

## 🧠 איך עובד מנוע הזוגות

בכל סבב, `pairGenerator.ts` בוחר שני פריטים ש:

1. שניהם `active === true`.
2. לא הופיעו יחד לאחרונה (לפי `shownPairs` ב-localStorage).
3. לא היו הזוג הקודם (`avoidIds` כדי שלא נציג אותו זוג פעמיים ברצף).

אם אין מספיק זוגות חדשים, נופלים בחזרה ל"פחות מוצגים" כדי לאזן.

---

## 📱 רספונסיביות

- **mobile-first**: כרטיסים מוצגים אנכית במובייל, אופקית ב-sm+.
- **safe-area insets** נכבדים (iPhone notch / Dynamic Island).
- **touch targets** מינימום 44px.
- **user-scalable=no** כדי למנוע zoom מקרי בעת בחירה מהירה.

---

## ☁️ פריסה ל-Vercel

1. דחפו את הפרויקט ל-GitHub.
2. ב-`https://vercel.com/new`, חברו את ה-repo.
3. Vercel מזהה אוטומטית Next.js — אין צורך בהגדרות build.
4. **Settings → Environment Variables**, הוסיפו:
   - `NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL` (או `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL`)
5. **Deploy**. סיימתם.

### פריסה ל-Netlify

1. חברו את ה-repo ב-`https://app.netlify.com/start`.
2. Build command: `npm run build`
3. Publish directory: `.next` (Netlify מזהה Next.js אוטומטית ומתקין את הפלאגין המתאים)
4. הוסיפו את משתני הסביבה תחת **Site settings → Environment variables**.

---

## 🧪 QA — רשימת בדיקות

- [x] מסך פתיחה מוצג עם כותרת וכפתור.
- [x] שני כרטיסים מוצגים בכל סבב.
- [x] כרטיס נבחר מקבל אנימציית ניצחון.
- [x] כרטיס שלא נבחר נחלש (opacity 40%).
- [x] מעבר לסבב הבא אחרי 700ms.
- [x] Progress bar מתקדם בכל סבב.
- [x] אחרי 10 בחירות מוצג מסך תוצאות עם קונפטי.
- [x] דירוג Top‑3 ופילוח קטגוריות מוצגים.
- [x] כפתור "המשך לשחק" מתחיל 10 סבבים חדשים.
- [x] כפתור "התחל מחדש" מאפס את ה-localStorage.
- [x] כפתור "שתף" משתמש ב-Web Share API במובייל / clipboard בדסקטופ.
- [x] עברית + RTL תקינים.
- [x] mobile-first — כרטיסים מוצגים אנכית ב-390px.
- [x] אין שגיאות ב-console.
- [x] תמונה חסרה מציגה placeholder עם emoji לפי קטגוריה.

---

## 🛣️ פיצ׳רים עתידיים

- קטגוריות נפרדות עם מסך בחירה.
- תמיכה ב-3 או 4 אפשרויות במקום 2.
- טורניר נוקאאוט (bracket).
- דירוג גלובלי (צריך backend).
- משתמשים רשומים (NextAuth.js מותקן כבר).
- מצבים: ילדים / שירים / דמויות.
- שיתוף תוצאה כתמונה (html-to-image).
- אנליטיקה (Vercel Analytics / PostHog).
- מצב כהה (next-themes כבר מותקן).

---

## 📄 רישיון

MIT — עשו מה שתרצו. שיתוף עם קרדיט מוערך 💜
