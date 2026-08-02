# HTC 2026 Survey — Claude Code Handoff

## Project Overview
We built a standalone HTML survey + Google Apps Script response collector for the **Twisted Bois Running Club** Hood to Coast 2026 team. Garrett is captain of a 9-person team (running as 8) doing all 36 legs in a single van. The survey collects runner slot preferences, individual leg interest ratings, running preferences, and pace inputs to help Garrett build the leg assignment order.

---

## Repo
GitHub: `gl913-code`
Deployed via: Cloudflare Pages
Stack: Single-file HTML (no framework), Google Apps Script web app as backend

---

## Files

### `htc_2026_survey.html`
The survey itself. Key features:
- **Section 1:** Name input
- **Section 2:** Runner Slot Preference — drag-and-drop ranking of 8 runner slots. Slots are defined as:
  - Runner 1: Legs 1, 9, 17, 25, 33 (5 legs)
  - Runner 2: Legs 2, 10, 18, 26, 34 (5 legs)
  - Runner 3: Legs 3, 11, 19, 27, 35 (5 legs)
  - Runner 4: Legs 4, 12, 20, 28, 36 (5 legs)
  - Runner 5: Legs 5, 13, 21, 29 (4 legs)
  - Runner 6: Legs 6, 14, 22, 30 (4 legs)
  - Runner 7: Legs 7, 15, 23, 31 (4 legs)
  - Runner 8: Legs 8, 16, 24, 32 (4 legs)
- **Section 3:** Individual Leg Interest — tap-target buttons for all 36 legs grouped as Day (1–13), Overnight/Dusk/Night/Dawn (14–27), Day Late Race (28–36). Options: 🔥 I really want this! / 👍 Willing & Able / 😑 Ugh, Fine / 🚫 No Way Jose
- **Section 4:** Running Preferences — downhill, uphill, night running, long legs, leg count, rest window
- **Section 5:** Pace inputs — flat, uphill adjustment, downhill
- **Section 6:** Open notes field
- Form submits via `fetch` with `mode: 'no-cors'` POST to Apps Script URL
- JS validation catches unanswered leg radios before submit (browser `required` unreliable on dynamic radios)
- Interest button selected states driven by JS `.checked` class toggle (not CSS `:has()` — Firefox compat)
- All grids/cards built dynamically by JS; wrapped in `DOMContentLoaded` with error banner fallback

### `htc_2026_collector.gs`
Google Apps Script web app that receives POST, writes each submission as a row to a Google Sheet named "HTC 2026 Survey Responses" (auto-created on first submission with styled header row).

**To deploy:**
1. script.google.com → New project → paste collector
2. Deploy → New deployment → Web app → Execute as: Me → Access: Anyone
3. Copy Web App URL → paste into `htc_2026_survey.html` replacing `YOUR_APPS_SCRIPT_URL_HERE`

---

## Known Issues / Next Steps

### 1. PDF Leg Maps Link — NOT YET ADDED
Need to add a PDF link to the Individual Leg Interest section. Plan:
- Drop PDF at `/assets/htc_2026_leg_maps.pdf` in the repo
- Add this link in the section hint text in the HTML:
  ```html
  <a href="/assets/htc_2026_leg_maps.pdf" target="_blank"
     style="color: var(--green-mid); font-weight: 600;">
    📄 View All Leg Maps (PDF)
  </a>
  ```

### 2. Mobile Rendering — NOT YET CONFIRMED
Survey was previewed in Koder's in-app browser which sandboxes local JS — grids appeared empty. This is a local file issue, not a code issue. Needs to be tested in Safari once deployed to Cloudflare Pages. The error banner fallback will surface any remaining issues.

### 3. Apps Script URL — NOT YET WIRED
`YOUR_APPS_SCRIPT_URL_HERE` placeholder is still in the HTML. Collector must be deployed first, then URL dropped in before pushing to Cloudflare.

---

## Leg Data Reference
All 36 legs with distance, difficulty, elevation gain/loss, and time-of-day are hardcoded in the JS `legs` array in `htc_2026_survey.html`. Source file was `htc_2026.json`. Do not re-fetch or re-import — the array in the HTML is the source of truth for this project.

Key leg flags:
- Leg 14: LONGEST (7.91 mi), tod = dusk
- Leg 20: HARDEST (912 ft gain), tod = night
- Leg 36: FINISH leg, tod = day

---

## Design System
Colors defined as CSS vars:
- `--green-dark: #2D4A35` (headers, rank badges)
- `--green-mid: #1A6B3C` (accents, borders, links)
- `--orange: #D64F1E` (CTA button, required markers)
- `--cream: #F7F4EF` (page background)

---

## Deployment Checklist
- [ ] Deploy `htc_2026_collector.gs` as Apps Script Web App
- [ ] Paste Web App URL into `htc_2026_survey.html` (`YOUR_APPS_SCRIPT_URL_HERE`)
- [ ] Add PDF to `/assets/htc_2026_leg_maps.pdf` in repo
- [ ] Add PDF link to HTML (see above)
- [ ] Push HTML to `gl913-code` repo
- [ ] Confirm Cloudflare Pages picks up the deploy
- [ ] Test in Safari on mobile end-to-end (name → drag slots → rate all 36 legs → preferences → pace → submit)
- [ ] Verify row appears in Google Sheet "HTC 2026 Survey Responses"
- [ ] Share link with 8 teammates
