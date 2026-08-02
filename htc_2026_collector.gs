/**
 * HTC 2026 — Survey Response Collector
 * Google Apps Script Web App
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com → New project
 * 2. Paste this entire script
 * 3. Click Deploy → New deployment
 * 4. Type: Web app
 * 5. Execute as: Me
 * 6. Who has access: Anyone
 * 7. Click Deploy → copy the Web App URL
 * 8. Paste that URL into htc_2026_survey.html where it says YOUR_APPS_SCRIPT_URL_HERE
 *
 * A Google Sheet named "HTC 2026 Survey Responses" will be created automatically
 * in your Google Drive on first submission.
 */

const SHEET_NAME = 'HTC 2026 Survey Responses';

const SLOT_RUNNERS = [1,2,3,4,5,6,7,8,9];

// ─── HEADERS ─────────────────────────────────────────────────
function getHeaders() {
  const headers = ['Timestamp', 'Name'];
  headers.push('Priority — 1st Choice', 'Priority — 2nd Choice', 'Priority — 3rd Choice');
  SLOT_RUNNERS.forEach(r => headers.push(`Slot Interest — Runner ${r}`));
  headers.push(
    'Pace — Flat',
    'Pace — Uphill Adj',
    'Pace — Downhill',
    'Additional Notes'
  );
  return headers;
}

// ─── GET OR CREATE SHEET ─────────────────────────────────────
function getOrCreateSheet() {
  const files = DriveApp.getFilesByName(SHEET_NAME);
  let ss;

  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    // Create fresh spreadsheet with styled header row
    ss = SpreadsheetApp.create(SHEET_NAME);
    const sheet = ss.getActiveSheet();
    sheet.setName('Responses');
    const headers = getHeaders();
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#2D4A35');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 140);
    Logger.log('Sheet created: ' + ss.getUrl());
    return sheet;
  }

  // Find the Responses tab; if renamed, use first sheet
  const found = ss.getSheets().find(s => s.getName() === 'Responses');
  return found || ss.getSheets()[0];
}

// ─── CORS HELPER ─────────────────────────────────────────────
// Apps Script doesn't support arbitrary CORS headers natively.
// We return a plain text 200 OK — the HTML form uses no-cors mode
// and treats any completed fetch as success.
function corsOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── doGet — health check & CORS preflight fallback ──────────
function doGet(e) {
  return corsOutput({ status: 'ok', message: 'HTC 2026 Survey Collector is live.' });
}

// ─── doPost — write submission to sheet ──────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

    const row = [timestamp, data.name || ''];

    row.push(data.priority_1st || '', data.priority_2nd || '', data.priority_3rd || '');
    SLOT_RUNNERS.forEach(r => row.push(data[`interest_r${r}`] || ''));

    row.push(
      data.pace_flat      || '',
      data.pace_uphill    || '',
      data.pace_downhill  || '',
      data.notes          || ''
    );

    sheet.appendRow(row);
    return corsOutput({ status: 'success' });

  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
    return corsOutput({ status: 'error', message: err.toString() });
  }
}
