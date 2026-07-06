# Website Masjid Al Muslimun

Repositori resmi situs web DKM Masjid Al Muslimun, Jalan Selakopi, Sindangbarang, Kota Bogor.

Seluruh situs bersifat **statis** (HTML + JavaScript) dan membaca data langsung dari
Google Sheet milik DKM, sehingga **tidak memerlukan server maupun database**.
Konten diperbarui cukup dengan mengedit Google Sheet — tanpa menyentuh kode.

## Struktur

| Folder / File | Isi | Sumber data |
|---|---|---|
| `index.html` | Portal utama: jadwal shalat, jadwal Jumat & kajian, tautan laporan, infak | Sheet jadwal (sama dengan TV masjid) + API Aladhan |
| `neraca/` | Neraca Keuangan Masjid | Google Sheet bendahara |
| `zis/` | Rekapitulasi Zakat, Infak, Sedekah | Google Sheet bendahara |

> Folder `neraca/` dan `zis/` sudah berisi file asli hasil migrasi dari
> hosting lama (`diriyanto.work/al-muslimun/`).

## Cara memperbarui konten (untuk pengurus)

1. **Jadwal Jumat / kajian** — edit Google Sheet jadwal seperti biasa (sheet yang sama
   dipakai TV masjid dan portal ini). Perubahan tampil otomatis.
2. **Laporan keuangan / ZIS** — bendahara mengisi Sheet pencatatan seperti biasa.
3. **Mengubah tampilan / teks halaman** — edit file HTML di repo ini, lalu commit.
   Situs ter-deploy ulang otomatis dalam ± 1 menit.

Konfigurasi portal (ID Sheet, nomor rekening, kota jadwal shalat) ada di blok
`CONFIG` pada bagian atas `<script>` di `index.html`.

## Deploy

### Opsi A — Cloudflare Pages (disarankan)

1. Buat akun Cloudflare dengan email organisasi DKM.
2. **Workers & Pages → Create → Pages → Connect to Git** → pilih repo ini.
3. Build settings: kosongkan (framework: *None*, build command kosong, output `/`).
4. **Custom domains** → tambahkan domain masjid (mis. `almuslimun.or.id`).

### Opsi B — GitHub Pages

1. Repo → **Settings → Pages → Source: Deploy from a branch** → pilih `main`, folder `/ (root)`.
2. **Custom domain** → isi domain masjid, aktifkan *Enforce HTTPS*.

File `.nojekyll` sudah disertakan agar GitHub Pages tidak memproses situs sebagai Jekyll.

## Prinsip pengelolaan

- Repo, domain, dan seluruh Google Sheet **dimiliki akun organisasi DKM**, bukan akun pribadi.
- Minimal **dua pengurus** memegang akses ke repo, domain, dan akun Google DKM.
- Setiap pergantian pengurus: perbarui `DOKUMEN-SERAH-TERIMA.md`.
- Data pribadi jamaah (peta dakwah) **tidak pernah** dipublikasikan lewat situs ini.
