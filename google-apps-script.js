/**
 * Google Apps Script Code for Google Sheets Webhook
 *
 * Instructions:
 * 1. Open Google Sheets
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code
 * 4. Save the project
 * 5. Deploy > New deployment > Web app
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone"
 * 8. Click Deploy
 * 9. Copy the web app URL and use it as GOOGLE_SHEETS_WEBHOOK_URL
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const requestedSheetName = data.sheetName || 'Sheet1';
    const sheet =
      spreadsheet.getSheetByName(requestedSheetName) ||
      spreadsheet.insertSheet(requestedSheetName);

    const name = data.name || '';
    const email = data.email || '';
    const date = data.date || new Date().toISOString();

    sheet.appendRow([
      name,
      email,
      date
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true,
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Google Sheets webhook is live'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: Setup function to create headers in the sheet
 * Run this once manually from the Apps Script editor
 */
function setupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = ['Sheet1', 'Sheet2'];

  sheetNames.forEach((sheetName) => {
    const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Name', 'Email', 'Date']);

      const headerRange = sheet.getRange(1, 1, 1, 3);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
    }
  });
}
