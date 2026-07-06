# API Rekap ZIS — penyensoran nama di server (Google Apps Script)

Tujuan: nama muzakki disensor **di server**, sehingga Google Sheet asli bisa
dibuat **privat** dan nama lengkap tidak pernah dikirim ke browser pengunjung.

Selama URL Web App belum dipasang, halaman `/zis` tetap berjalan memakai Sheet
publik (GViz) dengan penyensoran di sisi browser. Setelah langkah di bawah
selesai, situs otomatis beralih ke mode aman ini.

## Langkah deploy (dilakukan di akun Google DKM)

1. Buka <https://script.google.com> → **New project**.
2. Hapus isi `Code.gs` bawaan, lalu **tempel seluruh isi** file `Code.gs`
   dari folder ini. Pastikan `SHEET_ID` dan `SHEET_NAME` sudah benar.
3. Klik **Deploy → New deployment**.
   - Ikon gerigi **Select type → Web app**.
   - **Description**: `API ZIS`
   - **Execute as**: **Me** (agar script bisa membaca Sheet privat atas nama kamu)
   - **Who has access**: **Anyone**
   - Klik **Deploy**.
4. Klik **Authorize access** dan izinkan (pilih akun DKM → Allow).
5. Salin **Web app URL** (berakhiran `/exec`). Contoh:
   `https://script.google.com/macros/s/AKfycb.../exec`
6. Buka `zis/script.js`, isi baris:
   ```js
   const APPS_SCRIPT_URL = ''; // ← tempel URL /exec di antara tanda kutip
   ```
   Simpan & commit (atau kirim URL-nya ke Claude untuk di-commit).
7. Uji buka halaman `/zis` — data harus tetap tampil dengan nama tersensor.
8. Setelah yakin bekerja, ubah Google Sheet menjadi **privat**
   (Share → hapus "Siapa saja yang memiliki link"). Karena script berjalan
   **Execute as Me**, ia tetap bisa membaca Sheet meski sudah privat.

## Catatan

- **Mengubah kode?** Setelah edit `Code.gs`, lakukan **Deploy → Manage
  deployments → (edit) → Version: New version → Deploy** agar URL `/exec`
  yang sama tetap dipakai (URL tidak berubah). Jangan buat "New deployment"
  baru kecuali memang ingin URL baru.
- Endpoint memakai **JSONP** (`?callback=...`) supaya bisa diakses situs statis
  tanpa masalah CORS.
- Kalau nanti kolom di Sheet berubah urutannya, sesuaikan indeks di `getData()`.
