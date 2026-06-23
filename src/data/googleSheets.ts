import type { ChoiceItem } from "@/types/choice";
import { SAMPLE_ITEMS } from "./sampleItems";

/**
 * Google Sheets loader.
 *
 * Two supported modes (set via NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL or
 * NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL in your .env.local):
 *
 *  A) Published CSV  (simplest, MVP default)
 *     - File → Share → Publish to web → as CSV
 *     - URL looks like: https://docs.google.com/spreadsheets/d/e/<id>/pub?gid=0&single=true&output=csv
 *
 *  B) Apps Script web app (returns JSON)
 *     - Deploy → Web app → Anyone
 *     - URL looks like: https://script.google.com/macros/s/<id>/exec
 *
 * If neither is set, or the fetch fails, we fall back to SAMPLE_ITEMS
 * so the app is always usable (offline / first run / demo).
 */

const CSV_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL?.trim();
const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL?.trim();

export type LoadResult =
  | { ok: true; items: ChoiceItem[]; source: "csv" | "apps-script" | "fallback" }
  | { ok: false; error: string; items: ChoiceItem[] }; // always return fallback items

export async function loadItems(
  signal?: AbortSignal
): Promise<LoadResult> {
  // Try Apps Script first (cleanest JSON)
  if (APPS_SCRIPT_URL) {
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        signal,
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`Apps Script HTTP ${res.status}`);
      const json = (await res.json()) as unknown;
      const items = normalizeJson(json);
      if (items.length >= 2) {
        return { ok: true, items, source: "apps-script" };
      }
      throw new Error("Apps Script returned fewer than 2 items");
    } catch (err) {
      console.warn("[googleSheets] Apps Script fetch failed:", err);
      // fall through to CSV / fallback
    }
  }

  if (CSV_URL) {
    try {
      const res = await fetch(CSV_URL, { signal, redirect: "follow" });
      if (!res.ok) throw new Error(`CSV HTTP ${res.status}`);
      const text = await res.text();
      const items = parseCsv(text);
      if (items.length >= 2) {
        return { ok: true, items, source: "csv" };
      }
      throw new Error("CSV returned fewer than 2 items");
    } catch (err) {
      console.warn("[googleSheets] CSV fetch failed:", err);
      return {
        ok: false,
        error:
          err instanceof Error ? err.message : "טעינת הגוגל שיט נכשלה. מציגים נתוני דוגמה.",
        items: SAMPLE_ITEMS,
      };
    }
  }

  // No URL configured → use sample data (silent fallback)
  return { ok: true, items: SAMPLE_ITEMS, source: "fallback" };
}

// ---------- CSV parser ----------

/**
 * Minimal CSV parser that supports:
 *  - quoted fields with embedded commas / newlines
 *  - headers row
 *  - boolean parsing for `active` (TRUE/FALSE/1/0/yes/no)
 */
export function parseCsv(text: string): ChoiceItem[] {
  const rows = csvToRows(text);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => headers.indexOf(name);

  const idI = idx("id");
  const titleI = idx("title");
  const descI = idx("description");
  const catI = idx("category");
  const imgI = idx("imageurl");
  const activeI = idx("active");
  const weightI = idx("weight");

  const items: ChoiceItem[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.every((c) => c.trim() === "")) continue;

    const id = idI >= 0 ? row[idI]?.trim() : "";
    const title = titleI >= 0 ? row[titleI]?.trim() : "";
    if (!id || !title) continue;

    items.push({
      id,
      title,
      description: descI >= 0 ? row[descI]?.trim() || undefined : undefined,
      category: catI >= 0 ? row[catI]?.trim() || undefined : undefined,
      imageUrl: imgI >= 0 ? row[imgI]?.trim() || undefined : undefined,
      active: activeI >= 0 ? parseBool(row[activeI]) : true,
      weight: weightI >= 0 ? parseFloat(row[weightI] ?? "1") || 1 : 1,
    });
  }

  return items;
}

function csvToRows(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        cur.push(field);
        field = "";
      } else if (c === "\n") {
        cur.push(field);
        rows.push(cur);
        cur = [];
        field = "";
      } else if (c === "\r") {
        // ignore — handled by \n
      } else {
        field += c;
      }
    }
  }
  // last field
  if (field !== "" || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }
  return rows;
}

function parseBool(v?: string): boolean {
  if (!v) return true;
  const s = v.trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes" || s === "כן" || s === "";
}

// ---------- Apps Script JSON normalizer ----------

function normalizeJson(json: unknown): ChoiceItem[] {
  // Accept either an array of items or { items: [...] } / { data: [...] }
  let arr: unknown[] = [];
  if (Array.isArray(json)) {
    arr = json;
  } else if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    arr = (obj.items as unknown[]) || (obj.data as unknown[]) || [];
  }

  const items: ChoiceItem[] = [];
  for (const raw of arr) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    const id = String(o.id ?? "").trim();
    const title = String(o.title ?? "").trim();
    if (!id || !title) continue;
    items.push({
      id,
      title,
      description: o.description ? String(o.description) : undefined,
      category: o.category ? String(o.category) : undefined,
      imageUrl: o.imageUrl ? String(o.imageUrl) : undefined,
      active:
        typeof o.active === "boolean"
          ? o.active
          : parseBool(o.active != null ? String(o.active) : "true"),
      weight: o.weight != null ? Number(o.weight) || 1 : 1,
    });
  }
  return items;
}
