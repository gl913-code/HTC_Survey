# Handoff

## Current Task/Goal
Build and deploy a Hood to Coast 2026 runner survey for the Twisted Bois Running Club (Garrett's 9-runner van, all 36 legs). Static HTML front end + Google Apps Script backend writing to a Google Sheet, hosted on Cloudflare Pages, to be shared with the team so Garrett can build the leg assignment order.

## What's Done
- **Survey redesigned** from the original 8-runner / 36-individual-leg-rating layout to the current 9-runner / 4-legs-each layout.
- **Runner Slot Preference section**: 9 static cards (no longer rankable — see Decisions below), each showing its 4 legs (distance, difficulty, elevation, time-of-day) with a 4-option interest picker per slot (🔥 Really want it / 👍 Willing & Able / 😑 Ugh, Fine / 🚫 No Way Jose).
- **Dropped entirely** (per explicit requests): the 36-question individual-leg interest grid, the "Running Preferences" section (downhill/uphill/night/long-legs/leg-count/rest-window questions), and the whole drag-and-drop + up/down-arrow ranking mechanism.
- **Added "Priority Slots" question**: a 3×3 tap grid showing all 9 runner slots at once; tap order assigns 1st/2nd/3rd choice, with a live summary line and required-field validation before submit.
- **Pace inputs** (flat / uphill adj / downhill) and the notes field are unchanged from the original design.
- **Leg map PDFs**: all 36 individual per-leg PDFs added under `assets/`, with a 🗺️ link on each leg row. The 164MB combined PDF and the source `HTC Leg Maps/` folder are intentionally excluded (see Decisions).
- **`htc_2026_collector.gs` rewritten** to match the current schema: `Timestamp, Name, Priority — 1st/2nd/3rd Choice, Slot Interest — Runner 1–9, Pace — Flat/Uphill/Downhill, Additional Notes` (18 columns).
- **Git + deploy**: local repo initialized, pushed to [github.com/gl913-code/HTC_Survey](https://github.com/gl913-code/HTC_Survey) (`main` branch), Cloudflare Pages connected and deploying automatically on push. Live at **https://htc-survey.pages.dev/**.
- **End-to-end tested** on the live URL: full submission (name, all 9 slot ratings, 3 priority taps, pace) validates and POSTs successfully; leg map PDFs confirmed live (200 OK) and linked correctly in the deployed HTML.

## In Progress
Nothing actively in progress — the last completed step was verifying the leg-map-PDF deploy on the live site.

## Key File Paths
- `index.html` — the survey itself (renamed from `htc_2026_survey.html` so Cloudflare Pages' root URL `/` resolves instead of 404ing).
- `htc_2026_collector.gs` — Apps Script backend. **Not auto-synced** — editing this file locally does nothing to the live endpoint until someone manually pastes it into the script.google.com project and creates a new deployment version.
- `assets/HTC-Leg-1.pdf` … `HTC-Leg-36.pdf` — per-leg course maps, linked from each leg row in `index.html`.
- `.gitignore` — excludes `HTC Leg Maps/` (source folder) and `HTC Leg Maps_All.pdf` (164MB combined map — exceeds GitHub's 100MB file limit).
- `HTC_SURVEY_HANDOFF.md` (repo root) — an earlier, now-superseded handoff doc from before the 9-runner/priority-picker redesign. Consider deleting or merging into this one.

## Decisions Made (and why)
- **Dropped drag/arrow ranking, added tap-to-pick top-3 instead.** Ranking all 9 slots was too fiddly on mobile (long-distance drag on a tall, scrolling list); the actual need was only top-3 priorities, not a full 1–9 order, so the simpler tap grid replaced it entirely.
- **Interest rating is per runner-slot (9), not per individual leg (36).** Explicit simplification request — rating every one of 36 legs individually was too much respondent burden.
- **Renamed `htc_2026_survey.html` → `index.html`.** Cloudflare Pages serves `index.html` at the site root by default; without it, `/` 404'd and only `/htc_2026_survey.html` worked.
- **Only the 36 individual leg PDFs are in the repo, not the combined 164MB PDF.** GitHub hard-rejects any single file over 100MB, so the combined file can't be pushed at all. Individual per-leg PDFs (2–12MB each) are well under both GitHub's and Cloudflare Pages' per-file limits.

## Open Issues/Blockers
- **Apps Script redeploy status is unconfirmed.** The live collector endpoint (`.../AKfycbzjBDAF92mH7hfcL9PR_k3vE2Llpv_qkx5uvLR6t9UnjId4QAldY5J73-jmj2hMaDKJ/exec`) was found to still be running an old, stale version of the script (old 8-runner/36-leg/old-preferences column schema) even after multiple `htc_2026_collector.gs` rewrites — because Apps Script Web Apps only pick up code changes on a new deployment *version*, not on save. Garrett was walked through: paste current `htc_2026_collector.gs` into the script.google.com project → **Deploy → Manage deployments → pencil (Edit) → Version: New version → Deploy**. **This has not been verified as done.**
- **The "HTC 2026 Survey Responses" Google Sheet has stale/wrong headers** (old schema) plus at least one garbage test row from early manual testing, and one row from a Claude-run test submission named "TEST SUBMISSION — please delete (Claude verification)". Recommended fix: delete/trash that spreadsheet in Google Drive entirely so the script recreates it fresh with the current 18-column headers on the next real submission. **Not confirmed done.**

## Next Steps
1. Confirm the Apps Script redeploy actually happened, then delete the stale Google Sheet and run one more clean test submission to verify the new 18-column schema comes through correctly.
2. Once verified, share **https://htc-survey.pages.dev/** with the 8 teammates.
3. Optional cleanup: remove or merge the older `HTC_SURVEY_HANDOFF.md` at the repo root now that this doc exists.
