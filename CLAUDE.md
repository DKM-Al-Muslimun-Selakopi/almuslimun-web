# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static website (plain HTML/CSS/JS, no framework, no build step) for DKM Masjid Al-Muslimun, Bogor. All dynamic data is read client-side from public Google Sheets — there is no server or database. Content in Indonesian; code comments mix Indonesian and English.

## Commands

There is no build, lint, or test tooling. To preview, serve the repo root with any static server (the project lives under MAMP htdocs, so MAMP works too):

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

The only Node component is the WhatsApp cron engine:

```bash
cd notif/cron
npm install
export FONNTE_TOKEN="..."       # Fonnte WhatsApp API token
node engine.js                  # run the notifier
node engine.js --test 62813xxx  # send a test message to one number
```

Deployment is automatic: pushing to `main` redeploys via Cloudflare Pages / GitHub Pages (`.nojekyll` is intentional — keep it).

## Architecture

Four independent pages, each self-contained (own HTML/CSS/JS, no shared assets):

- `index.html` — main portal (single file, CSS+JS inline). Prayer times from the Aladhan API (method 20 = Kemenag), schedule table from the shared "TV display" Google Sheet.
- `neraca/` — monthly financial balance report. Auto-discovers per-month `NERACA*` tabs in the treasurer's sheet, renders tabs + trend charts.
- `zis/` — zakat/infak/sedekah recap, reads the `INPUT MUZAKKI` tab.
- `notif/` — WhatsApp notification system: an admin dashboard (static page) plus `notif/cron/`, a Node engine that sends reminders via the Fonnte API. Imam rotation schedule is hard-coded in `notif/cron/rawatib.js` (not sheet-driven); contacts and marbot duties come from the sheet. `notif/SHEET_TEMPLATE.md` documents the expected sheet structure.

### The Google Sheets pattern

Every page fetches sheets through the GViz endpoint (`https://docs.google.com/spreadsheets/d/<ID>/gviz/tq?tqx=out:json...`), strips the JSONP wrapper, and parses the JSON. Sheets must be shared as "Anyone with the link — Viewer". Each page has its own hard-coded `SHEET_ID` (a `CONFIG`/`SHEET_CONFIG` block or const at the top of its script) — these are intentionally public read-only IDs, not secrets. When cell formatting matters, code prefers `cell.f` (formatted value) over `cell.v`.

## Constraints

- Keep everything static and dependency-free — content updates must remain possible by editing Google Sheets only, no code changes.
- `index.html` colors are flat (no gradients) on purpose, matching the mosque's TV display; palette is defined in `:root` CSS variables.
- The `neraca/` and `zis/` pages were migrated from the old host (`diriyanto.work/al-muslimun/`); portal links in `index.html` point to the local `neraca/` and `zis/` paths.
- Congregation personal data (peta dakwah) must never be published through this site. `DOKUMEN-SERAH-TERIMA.md` is the handover inventory of accounts/assets — update it when ownership details change.
