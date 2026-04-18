# Wire the assessment to Google Sheets (5 minutes)

Every lead submitted on the email-gate screen will be appended as a new row in a Google Sheet of your choice. No backend needed — this uses a free Google Apps Script webhook.

## 1. Make the sheet

1. Create a new Google Sheet. Name it something like **"DMA Readiness Leads"**.
2. In row 1, paste these column headers (left to right):

   ```
   timestamp  name  email  company  role  size  score  tier  answers
   ```

3. Copy the sheet's ID from its URL. It's the long string between `/d/` and `/edit`:

   ```
   https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit
   ```

## 2. Add the Apps Script

1. In the sheet, open **Extensions → Apps Script**.
2. Delete any boilerplate and paste this in:

   ```js
   const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
   const SHEET_NAME = 'Sheet1'; // change if your tab is named differently

   function doPost(e) {
     const p = e.parameter || {};
     const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
     sheet.appendRow([
       new Date(),
       p.name || '',
       p.email || '',
       p.company || '',
       p.role || '',
       p.size || '',
       p.score || '',
       p.tier || '',
       p.answers || ''
     ]);
     return ContentService.createTextOutput(JSON.stringify({ok:true}))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. Save (⌘S / Ctrl+S), name the project **"DMA Lead Webhook"**.

## 3. Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon → choose **Web app**.
3. Settings:
   - **Description:** DMA Lead Webhook
   - **Execute as:** Me (your@email)
   - **Who has access:** **Anyone** ← critical. This is a public write endpoint; only lead data goes in.
4. Click **Deploy**. Authorize when prompted (Google will warn it's an unverified app — click **Advanced → Go to DMA Lead Webhook**).
5. Copy the **Web app URL**. It looks like:

   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

## 4. Paste the URL into the assessment

1. Open `assessment-engine.js` in this project.
2. Find this line near the top of the lead-submit handler (around line ~395):

   ```js
   const SHEETS_WEBHOOK_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```

3. Replace the placeholder with your web app URL. Save.

## 5. Test it

1. Open `DMA Readiness Assessment.html`.
2. Run through a few questions, hit the email gate, fill it in, submit.
3. Refresh your sheet — the row should be there within a couple seconds.

## Troubleshooting

- **Nothing shows up in the sheet** — open the browser console on the assessment page. Look for `[DMA lead webhook failed]`. Most common causes:
  - Webhook URL is wrong or wasn't redeployed after a code change (every Apps Script code change needs **Deploy → Manage deployments → edit → New version**).
  - Sheet tab name in the script doesn't match the real tab name.
  - "Who has access" wasn't set to Anyone.
- **CORS errors in console** — shouldn't happen since we use `mode: 'no-cors'`, but if they do, verify the URL starts with `https://script.google.com/macros/s/`.
- **Duplicate rows** — the script itself only appends once per POST; if you see doubles, the form probably got submitted twice. Not a webhook issue.

## Updating the script later

Every time you edit the Apps Script code, you must click **Deploy → Manage deployments → pencil icon → Version: New version → Deploy** to push changes live. Editing and saving alone doesn't redeploy.

## Extras you might want to add

- Slack notification on each lead: in `doPost`, add a `UrlFetchApp.fetch(slackWebhook, ...)` call.
- Auto-email the lead a PDF: out of scope here, but Apps Script's `MailApp.sendEmail` can do it.
- Dedupe by email: check existing rows before appending.
