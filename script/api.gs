/**
 * Google Apps Script — Student ID Lookup API
 *
 * SETUP:
 * 1. Open your Google Sheet that contains student data
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Update SHEET_NAME below if your sheet tab is not named "Sheet1"
 * 5. Click Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the deployment URL and put it in idstudent.html (API_URL constant)
 *
 * EXPECTED SHEET STRUCTURE:
 * Column A: เลขบัตรประชาชน (National ID / Card ID)
 * Column B: ชื่อ-สกุล (Full name)
 * Column C: รหัสนักศึกษา (Student ID)
 *
 * Row 1 is treated as a header row and is skipped during search.
 */

var SHEET_NAME = "Sheet1";

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // Allow CORS
  var output;

  try {
    var cardId = "";

    // Support both GET (?cardId=xxx) and POST (JSON body)
    if (e.parameter && e.parameter.cardId) {
      cardId = e.parameter.cardId.toString().trim();
    } else if (e.postData && e.postData.contents) {
      var body = JSON.parse(e.postData.contents);
      cardId = (body.cardId || "").toString().trim();
    }

    // Validate: must be exactly 13 digits
    if (!cardId || !/^\d{13}$/.test(cardId)) {
      output = JSON.stringify({
        success: false,
        error: "INVALID_INPUT",
        message: "กรุณากรอกเลขบัตรประชาชน 13 หลัก",
      });
      return ContentService.createTextOutput(output).setMimeType(
        ContentService.MimeType.JSON,
      );
    }

    // Search the sheet
    var sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }

    var data = sheet.getDataRange().getValues();
    var result = null;

    // Start from row index 1 to skip header
    for (var i = 1; i < data.length; i++) {
      var rowCardId = data[i][0].toString().trim();
      if (rowCardId === cardId) {
        result = {
          name: data[i][1].toString().trim(),
          studentId: data[i][2].toString().trim(),
        };
        break;
      }
    }

    if (result) {
      output = JSON.stringify({
        success: true,
        data: {
          name: maskName(result.name),
          studentId: result.studentId,
        },
      });
    } else {
      output = JSON.stringify({
        success: false,
        error: "NOT_FOUND",
        message: "ไม่พบข้อมูลนักศึกษาที่ตรงกับเลขบัตรประชาชนนี้",
      });
    }
  } catch (err) {
    output = JSON.stringify({
      success: false,
      error: "SERVER_ERROR",
      message: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง",
    });
  }

  return ContentService.createTextOutput(output).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * Mask a name: keep first char of each part, replace the rest with ****
 * "สมชาย ใจดี" → "ส**** ใ****"
 */
function maskName(name) {
  return name
    .split(" ")
    .map(function (part) {
      if (part.length <= 1) return part;
      return part.charAt(0) + "****";
    })
    .join(" ");
}
