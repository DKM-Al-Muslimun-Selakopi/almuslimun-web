# DKM Al Muslimun — Notifikasi WhatsApp

Sistem notifikasi otomatis untuk mengirim pengingat jadwal imam, tugas marbot,
dan pengumuman ke jamaah via WhatsApp.

## Struktur

```
dkm-wa-notif/
├── index.html       # Dashboard web (admin panel)
├── styles.css       # Design system (teal/indigo, Outfit font)
├── script.js        # Client-side logic (read sheet, form, calendar)
├── cron/
│   ├── package.json 
│   ├── fonnte.js    # Fonnte API wrapper
│   ├── engine.js    # Main cron engine
│   └── templates.js # WA message templates
├── SHEET_TEMPLATE.md # Google Sheet structure docs
└── README.md        # This file
```

## Setup

### 1. Google Sheet
Buat Google Sheet dengan 4 sheet: `KONTAK`, `JADWAL`, `LOG_NOTIF`, `TUGAS_MARBOT`
Lihat `SHEET_TEMPLATE.md` untuk struktur kolom.

Share sheet → "Anyone with link can view" (public read).
Copy Sheet ID dari URL.

### 2. Konfigurasi
Edit baris pertama `script.js` — ganti `SHEET_ID` dengan ID sheet kamu.

### 3. Cron Engine
```bash
cd cron
npm install
export FONNTE_TOKEN="token_dari_fonnte"
node engine.js
```

### 4. Hosting
Upload semua file ke `diriyanto.work/al-muslimun/notif/` via FTP.

## Design
- Font: Outfit (Google Fonts)
- Warna: Teal `#0f766e` / Indigo `#6366f1`
- Bahasa: Indonesia
- Mobile-first responsive