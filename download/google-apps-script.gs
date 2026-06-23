/**
 * ============================================================
 *  "מה עדיף?" — Google Apps Script Web App
 *  מחזיר JSON של כל הפריטים הפעילים מהגיליון "Sheet1"
 * ============================================================
 *
 *  הוראות התקנה:
 *  1. פתחו את ה-Google Sheet שלכם.
 *  2. Extensions → Apps Script.
 *  3. מחקו את הקוד הקיים והדביקו את הקוד הזה.
 *  4. שמרו (Ctrl+S).
 *  5. Deploy → New deployment → Web app.
 *     - Description: "Pick One API"
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  6. אשרו את ההרשאות.
 *  7. העתיקו את ה-URL שמתקבל והגדירו אותו
 *     כ-NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL בקובץ .env.local
 *
 *  מבנה ה-Sheet הנדרש (שורה ראשונה = כותרות, case-sensitive):
 *  id | title | description | category | imageUrl | active | weight
 *
 *  שדה active מקבל: TRUE/FALSE, 1/0, yes/no, כן/לא (case-insensitive).
 *  שדה weight אופציונלי (default 1) — כמה "כבד" הפריט בבחירה אקראית.
 * ============================================================
 */

function doGet() {
  var sheetName = 'Sheet1';
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Sheet "' + sheetName + '" not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = rows[0].map(function (h) { return String(h).trim().toLowerCase(); });
  var idx = function (name) { return headers.indexOf(name); };

  var idI = idx('id');
  var titleI = idx('title');
  var descI = idx('description');
  var catI = idx('category');
  var imgI = idx('imageurl');
  var activeI = idx('active');
  var weightI = idx('weight');

  var items = [];
  for (var r = 1; r < rows.length; r++) {
    var row = rows[r];
    if (!row || row.every(function (c) { return String(c).trim() === ''; })) continue;

    var id = idI >= 0 ? String(row[idI] || '').trim() : '';
    var title = titleI >= 0 ? String(row[titleI] || '').trim() : '';
    if (!id || !title) continue;

    var active = true;
    if (activeI >= 0) {
      var v = String(row[activeI] || '').trim().toLowerCase();
      active = (v === 'true' || v === '1' || v === 'yes' || v === 'כן' || v === '');
    }

    items.push({
      id: id,
      title: title,
      description: descI >= 0 && row[descI] ? String(row[descI]).trim() : undefined,
      category: catI >= 0 && row[catI] ? String(row[catI]).trim() : undefined,
      imageUrl: imgI >= 0 && row[imgI] ? String(row[imgI]).trim() : undefined,
      active: active,
      weight: weightI >= 0 ? (Number(row[weightI]) || 1) : 1
    });
  }

  // Cache 5 דקות ב-CDN של Google
  return ContentService
    .createTextOutput(JSON.stringify(items))
    .setMimeType(ContentService.MimeType.JSON);
}
