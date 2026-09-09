/**
 * Sakshi & Sahil — Guest Confirmations (Travel & ID) backend
 * ────────────────────────────────────────────────────────────────────────
 * Standalone from the RSVP script — writes to the "Guest Confirmations"
 * Sheet and saves uploaded ID photos into the "Guest confirmations" Drive
 * folder. Does not touch RSVP data at all.
 *
 * SETUP (one-time)
 * ────────────────────────────────────────────────────────────────────────
 * 1. Go to script.google.com → New Project (or open the "Guest
 *    Confirmations" spreadsheet → Extensions → Apps Script — either way
 *    works, since this script opens the spreadsheet by ID below rather
 *    than relying on which one it happens to be bound to).
 * 2. Delete the default code and paste this whole file in.
 * 3. Deploy → New deployment → gear icon → Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    then click Deploy and authorize when prompted.
 * 4. Copy the URL it gives you (ends in /exec).
 * 5. In Vercel → your project → Settings → Environment Variables, add:
 *      TRAVEL_APPS_SCRIPT_URL = <that /exec URL>
 *    (Production + Preview), then redeploy.
 *
 * UPDATE — 'Guest Names' column (added for the website redesign)
 * ────────────────────────────────────────────────────────────────────────
 * This version writes an optional "accompanying guest names" value into
 * column K (11) of the "Travel Details" tab. Because the tab already
 * exists with a 10-column header row, that header will NOT be created
 * automatically — go to the "Travel Details" tab once and manually type
 * "Guest Names" into cell K1 so the column is labelled. No other columns
 * move or change. If you skip this, the data still saves correctly — the
 * column is just unlabelled until you add the header.
 */

const SPREADSHEET_ID = '1SQHdH67JLTLATJyyARYHhIli3nBrg-0PtMPNSEGiTcU' // "Guest Confirmations" sheet
const ID_DOCS_FOLDER_ID = '1FQUpbA-mxWc1BOfy182xMW3sHj4bx52E'         // "Guest confirmations" Drive folder
const TRAVEL_SHEET_NAME = 'Travel Details'

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents)
    const action = payload.action

    if (action === 'travel_info') return handleTravelInfo_(payload)
    if (action === 'travel_file') return handleTravelFile_(payload)

    return jsonResponse_({ ok: false, error: 'Unknown action: ' + action })
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) })
  }
}

// ── Travel details (arrival/departure info) ───────────────────────────
// Column layout is intentionally append-only ('Guest Names' added at the
// end, column 11) so this script stays compatible with the "Travel Details"
// tab's existing header row and existing rows — inserting a column in the
// middle would silently misalign every prior submission.
function handleTravelInfo_(payload) {
  const lock = LockService.getScriptLock()
  lock.waitLock(30000) // up to 30s — Sheets writes are fast, this just serialises concurrent hits
  try {
    const sheet = getOrCreateSheet_(TRAVEL_SHEET_NAME,
      ['Timestamp', 'Full Name', 'Mobile', 'Arrival Mode', 'Arrival Date', 'Arrival Time',
        'Travel Number', 'Departure Date', 'Notes', 'ID Documents', 'Guest Names'])

    const mobile = payload.mobile || ''
    const rowIndex = findRowByMobile_(sheet, mobile)

    const rowDataCols1to9 = [
      new Date(),
      payload.full_name || '',
      mobile,
      payload.arrival_mode || '',
      payload.arrival_date || '',
      payload.arrival_time || '',
      payload.travel_number || '',
      payload.departure_date || '',
      payload.notes || '',
    ]
    const guestNames = payload.guest_names || ''

    if (rowIndex > 0) {
      // Update columns 1–9 in place — keep whatever's already in the ID
      // Documents column (10), overwrite Guest Names (11) with the latest.
      sheet.getRange(rowIndex, 1, 1, 9).setValues([rowDataCols1to9])
      sheet.getRange(rowIndex, 11).setValue(guestNames)
    } else {
      sheet.appendRow(rowDataCols1to9.concat(['', guestNames]))
    }
    return jsonResponse_({ ok: true })
  } finally {
    lock.releaseLock()
  }
}

// ── Travel details (one ID photo per request) ─────────────────────────
function handleTravelFile_(payload) {
  const mobile = payload.mobile || ''
  const filename = payload.filename || 'id-document'
  const mimeType = payload.mime_type || 'application/octet-stream'
  const base64 = payload.data || ''

  // Drive upload doesn't need the lock — only the Sheet read/write does
  const folder = DriveApp.getFolderById(ID_DOCS_FOLDER_ID)
  const bytes = Utilities.base64Decode(base64)
  const blob = Utilities.newBlob(bytes, mimeType, mobile + '_' + filename)
  const file = folder.createFile(blob)
  // Anyone with the link can view — the link is only ever shared via this
  // private Sheet, never published anywhere public.
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  const fileUrl = file.getUrl()

  const lock = LockService.getScriptLock()
  lock.waitLock(30000)
  try {
    const sheet = getOrCreateSheet_(TRAVEL_SHEET_NAME,
      ['Timestamp', 'Full Name', 'Mobile', 'Arrival Mode', 'Arrival Date', 'Arrival Time',
        'Travel Number', 'Departure Date', 'Notes', 'ID Documents', 'Guest Names'])

    const rowIndex = findRowByMobile_(sheet, mobile)
    if (rowIndex < 0) {
      sheet.appendRow([new Date(), payload.full_name || '', mobile, '', '', '', '', '', '', fileUrl])
    } else {
      const cell = sheet.getRange(rowIndex, 10) // ID Documents column
      const existing = cell.getValue()
      cell.setValue(existing ? existing + ', ' + fileUrl : fileUrl)
    }
    return jsonResponse_({ ok: true, url: fileUrl })
  } finally {
    lock.releaseLock()
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────
function findRowByMobile_(sheet, mobile) {
  const data = sheet.getDataRange().getValues()
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]) === String(mobile)) return i + 1 // 1-indexed sheet row
  }
  return -1
}

function getOrCreateSheet_(name, headers) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(name)
  if (!sheet) {
    sheet = ss.insertSheet(name)
    sheet.appendRow(headers)
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold')
  }
  return sheet
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
