import type { ChoiceItem } from "@/types/choice";

/**
 * Built-in sample data. Used as fallback when:
 *  - No Google Sheet URL is configured (NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL)
 *  - The fetch fails (network / publish issue)
 *
 * To replace with your own data: either edit this file OR set the env var
 * to your published Google Sheet CSV URL (see README).
 */
export const SAMPLE_ITEMS: ChoiceItem[] = [
  // פירות
  { id: "orange", title: "תפוז", description: "פרי הדר כתום ומתוק", category: "פירות", active: true, weight: 1 },
  { id: "banana", title: "בננה", description: "פרי צהוב ומתוק", category: "פירות", active: true, weight: 1 },
  { id: "apple", title: "תפוח", description: "קלאסי, פריך ומתוק", category: "פירות", active: true, weight: 1 },
  { id: "strawberry", title: "תות שדה", description: "אדום, קטן וממכר", category: "פירות", active: true, weight: 1 },
  { id: "mango", title: "מנגו", description: "מלך הפירות הטרופיים", category: "פירות", active: true, weight: 1 },
  { id: "watermelon", title: "אבטיח", description: "מרענן וקיצי", category: "פירות", active: true, weight: 1 },
  { id: "grapes", title: "ענבים", description: "קטנים, מתוקים וקלים לאכילה", category: "פירות", active: true, weight: 1 },
  { id: "pineapple", title: "אננס", description: "חמוץ-מתוק וטרופי", category: "פירות", active: true, weight: 1 },

  // חיות
  { id: "dog", title: "כלב", description: "חברו הטוב ביותר של האדם", category: "חיות", active: true, weight: 1 },
  { id: "cat", title: "חתול", description: "עצמאי, מסתורי ורגוע", category: "חיות", active: true, weight: 1 },
  { id: "elephant", title: "פיל", description: "גדול, חכם ובעל זיכרון מצוין", category: "חיות", active: true, weight: 1 },
  { id: "dolphin", title: "דולפין", description: "חכם, חברותי ושובב", category: "חיות", active: true, weight: 1 },
  { id: "penguin", title: "פינגווין", description: "אדיב, חמוד והולך בכיף", category: "חיות", active: true, weight: 1 },
  { id: "lion", title: "אריה", description: "מלך החיות", category: "חיות", active: true, weight: 1 },

  // מקומות
  { id: "beach", title: "חוף ים", description: "חול, שמש וגלים", category: "מקומות", active: true, weight: 1 },
  { id: "mountains", title: "הרים", description: "גבוה, שקט ומרגיע", category: "מקומות", active: true, weight: 1 },
  { id: "city", title: "עיר גדולה", description: "תוססת, רועשת ומלאה באנשים", category: "מקומות", active: true, weight: 1 },
  { id: "forest", title: "יער", description: "ירוק, שקט ומלא חיים", category: "מקומות", active: true, weight: 1 },
  { id: "desert", title: "מדבר", description: "שקט, רחב ומרגיע", category: "מקומות", active: true, weight: 1 },

  // אוכל
  { id: "pizza", title: "פיצה", description: "איטלקית, חמה וגבינתית", category: "אוכל", active: true, weight: 1 },
  { id: "burger", title: "המבורגר", description: "אמריקאי, עסיסי ומשביע", category: "אוכל", active: true, weight: 1 },
  { id: "sushi", title: "סושי", description: "יפני, עדין וטרי", category: "אוכל", active: true, weight: 1 },
  { id: "pasta", title: "פסטה", description: "איטלקית, מנחמת וטעימה", category: "אוכל", active: true, weight: 1 },
  { id: "falafel", title: "פלאפל", description: "ישראלי, פריך ומהיר", category: "אוכל", active: true, weight: 1 },

  // שתייה
  { id: "coffee", title: "קפה", description: "חם, מריר ומעורר", category: "שתייה", active: true, weight: 1 },
  { id: "tea", title: "תה", description: "חם, רגוע ומרגיע", category: "שתייה", active: true, weight: 1 },
  { id: "lemonade", title: "לימונדה", description: "קרה, חמוצה-מתוקה ומרעננת", category: "שתייה", active: true, weight: 1 },
  { id: "cola", title: "קולה", description: "תוססת, מתוקה וקרה", category: "שתייה", active: true, weight: 1 },

  // פעילויות
  { id: "movie", title: "סרט", description: "נוח, קולנועי ומרגיע", category: "פעילויות", active: true, weight: 1 },
  { id: "book", title: "ספר", description: "שקט, מרתק ומעורר מחשבה", category: "פעילויות", active: true, weight: 1 },
  { id: "gym", title: "חדר כושר", description: "פעיל, מאתגר ומחזק", category: "פעילויות", active: true, weight: 1 },
  { id: "sleep", title: "שינה", description: "רגוע, נעים וחיוני", category: "פעילויות", active: true, weight: 1 },
];
