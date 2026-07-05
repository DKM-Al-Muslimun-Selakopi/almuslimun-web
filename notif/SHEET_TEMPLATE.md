# Google Sheet Template — DKM Al Muslimun Notifikasi WA

Buat Google Sheet baru dengan nama "DKM Al Muslimun - Notifikasi WA".
Buat 4 sheet (tab) berikut:

---

## Sheet 1: `KONTAK`

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| No | number | 1 | Auto-increment |
| Nama | text | Gunawan B. | Nama lengkap |
| No_WA | text | 6281310417643 | Nomor WA internasional (tanpa +) |
| Role | text | imam_tetap, marbot | Bisa comma-separated |
| Grup | text | jamaah_group, marbot_group | Grup WA yg diikuti |
| Aktif | boolean | TRUE | TRUE = aktif, FALSE = nonaktif |

**Role values:** imam_tetap, imam_cadangan, marbot, pengurus, jamaah_biasa, ustadz
**Grup values:** jamaah_group, marbot_group, pengurus_group

### Data awal (isi sesuai DKM):

| No | Nama | No_WA | Role | Grup | Aktif |
|----|------|-------|------|------|-------|
| 1 | Gunawan B. | 6281310417643 | imam_tetap, pengurus | jamaah_group, marbot_group | TRUE |
| 2 | Sonny L. | 6289512756947 | imam_tetap, pengurus | jamaah_group | TRUE |
| 3 | Erwan | 6281517278946 | imam_tetap, pengurus | jamaah_group, marbot_group | TRUE |
| 4 | Dodi Iriyanto | 6281212345678 | imam_tetap, pengurus | jamaah_group | TRUE |
| 5 | Willy Murdianto | 6285959737340 | imam_tetap, pengurus | jamaah_group | TRUE |
| 6 | Dani | 6281388888888 | marbot | marbot_group | TRUE |
| 7 | Junaedi | 6281399999999 | marbot | marbot_group | TRUE |
| 8 | Agus | 6281377777777 | marbot | marbot_group | TRUE |
| 9 | Mukhsy N. A. | 6281517494799 | pengurus | jamaah_group | TRUE |

---

## Sheet 2: `JADWAL`

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| ID | text | J001 | Auto-format: J + 3 digit |
| Jenis | text | imam_dzuhur | Lihat daftar jenis di bawah |
| Tanggal | date | 2026-07-02 | ISO format YYYY-MM-DD |
| Waktu | time | 12:00 | HH:MM (24h) |
| Nama1 | text | Sonny L. | Imam/Ustadz/Khatib utama |
| Nama2 | text | - | Co-Imam/Co-Ustadz (optional) |
| Tema | text | - | Tema kajian/khutbah (optional) |
| Status_Kirim | text | pending | pending, sent_h1, sent_reminder, sent, failed |
| Waktu_Kirim | datetime | 2026-07-01 19:00:00 | ISO timestamp kirim terakhir |

**Jenis values:**
- `imam_subuh` — imam shalat Subuh
- `imam_dzuhur` — imam shalat Dzuhur
- `imam_ashar` — imam shalat Ashar
- `imam_maghrib` — imam shalat Maghrib
- `imam_isya` — imam shalat Isya
- `jumat` — imam & khatib Jumat (Nama1 = Imam, Nama2 = Khatib, Tema = tema khutbah)
- `kajian_subuh` — kajian Subuh Ahad (Nama1 = Ustadz, Tema = tema)
- `pengajian_ibu` — pengajian Ibu Senin Ashar
- `pengajian_anak` — pengajian Anak Sel-Kam Ashar
- `pengajian_remaja` — pengajian Remaja Jumat Ashar

**Waktu kirim otomatis (logika cron):**
- imam_* → H-1 jam 19:00 (notif H-1) + H-0 jam 30 menit sebelum shalat (reminder)
- jumat → Kamis jam 19:00
- kajian_subuh → Sabtu jam 19:00
- pengajian_* → H-1 jam 08:00

---

## Sheet 3: `LOG_NOTIF`

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| ID_Jadwal | text | J001 | Referensi ke JADWAL.ID |
| Waktu_Kirim | datetime | 2026-07-01 19:01:00 | Waktu eksekusi |
| Penerima | text | Sonny L. (62813...) | Nama + nomor |
| Jenis_Kirim | text | personal | personal atau grup |
| Pesan | text | Assalamualaikum... | Isi pesan yg dikirim |
| Status | text | terkirim | terkirim, gagal, antri |
| Error_Detail | text | - | Pesan error jika gagal |

---

## Sheet 4: `TUGAS_MARBOT`

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| ID | text | M001 | Auto-format: M + 3 digit |
| Tanggal | date | 2026-07-02 | ISO format |
| Tugas | text | Bersih Karpet | Nama tugas |
| PIC | text | Dani | Penanggung jawab |
| Status | text | pending | pending, done, skipped |

**Tugas standard:** Bersih Karpet, Isi Aqua Galon, Ganti Mukena, Sapu Halaman, Periksa Toilet, Periksa Wudhu

---

## Cara Share

1. Klik **Share** di kanan atas
2. Set ke **"Anyone with the link can view"**
3. Copy URL → ambil `SPREADSHEET_ID` dari URL:
   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=...`

## Cara Mendapatkan GID per Sheet

Setiap sheet tab punya GID:
- Sheet pertama biasanya `0`
- Sheet berikutnya `gid=...` (angka random)

Cara termudah: buka sheet di browser, klik tabnya, lihat URL → `#gid=1234567890`
