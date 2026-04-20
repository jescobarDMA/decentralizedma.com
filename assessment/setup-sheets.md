# Assessment Lead Capture — n8n Webhook

Every lead submitted on the email-gate form is sent to an n8n workflow that appends a row to Google Sheets and emails a summary to the CEO.

## Current Setup

| Item | Value |
|------|-------|
| n8n workflow | **DMA Web Assessment Lead** (`Led5lTsWs7A0ieqx`) |
| Webhook URL | `https://n8n.srv1128508.hstgr.cloud/webhook/dma-web-assessment-lead` |
| Spreadsheet | DMA Assessment Sheet (`1uTY_zVkI9Wg_emihEADPjOGEq_0gzgFSPjtisHaTZcY`) |
| Sheet tab | **WebLeads** |
| CEO notification | `jescobar@decentralizedma.com` (sent by Gmail node in the workflow) |

## First-time: Create the WebLeads tab

The n8n workflow targets a tab named **WebLeads** in the DMA Assessment spreadsheet. If it doesn't exist yet:

1. Open the spreadsheet at `https://docs.google.com/spreadsheets/d/1uTY_zVkI9Wg_emihEADPjOGEq_0gzgFSPjtisHaTZcY/edit`
2. Click `+` at the bottom to add a new tab. Name it exactly **WebLeads** (case-sensitive).
3. In row 1, paste these headers:

   ```
   Timestamp  Name  Email  Company  Role  Score  Tier  Category Scores  Submitted At
   ```

n8n will append rows automatically using `autoMapInputData` — the headers must match the field names output by the Normalize node.

## Activating the workflow

The workflow is **saved but not active** (per DMA convention — CEO tests and activates).

1. Open n8n → **DMA Web Assessment Lead** workflow.
2. Test it: click **Webhook → Listen for Test Event**, then submit the form on the assessment page. Confirm the Code node parses correctly, the Sheets node appends a row, and the Gmail node sends.
3. Once confirmed, click **Activate** (toggle at top right).

## Troubleshooting

- **Nothing in the sheet** — check the n8n execution log for the workflow. The most likely cause is the `WebLeads` tab doesn't exist yet (create it per above).
- **CEO email not arriving** — Gmail node has `continueOnFail: true`, so sheet writes still succeed if Gmail fails. Check the Gmail node error in the execution log. Usually a token refresh issue — re-auth the `DMA_Gmail` credential in n8n.
- **Console warning `[DMA lead webhook failed]`** — the `fetch` in `assessment-engine.js` caught an error. Verify the workflow is activated and the webhook URL is correct.
- **Form data fields** — the JS sends: `name`, `email`, `company`, `role`, `submittedAt`, `score`, `tier`, `categoryScores` (JSON-encoded object). The Normalize node reads these and outputs clean column-named fields.
