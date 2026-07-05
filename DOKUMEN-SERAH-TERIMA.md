# Inventaris Sistem Digital — DKM Masjid Al Muslimun

> Dokumen ini adalah "peta" seluruh sistem digital masjid.
> Perbarui setiap kali ada perubahan akun, akses, atau pergantian pengurus.
> Simpan salinannya di Google Drive DKM.

Terakhir diperbarui: __________ oleh: __________

## 1. Domain & Hosting

| Aset | Nilai | Keterangan |
|---|---|---|
| Domain masjid | `___________________` | Registrar: ______; jatuh tempo: ______; akun pemilik: ______ |
| Hosting situs | Cloudflare Pages / GitHub Pages | Akun: ______ |
| Repositori kode | `github.com/__________` | Admin: 1) ______ 2) ______ |
| Situs lama (transisi) | `diriyanto.work/al-muslimun/` | Redirect ke domain baru sejak: ______ |

## 2. Akun Organisasi

| Akun | Alamat | Pemegang akses | Pemulihan (no. HP/email) |
|---|---|---|---|
| Google DKM | `___________________` | 1) ______ 2) ______ | ______ |
| GitHub DKM | `___________________` | 1) ______ 2) ______ | ______ |
| Cloudflare | `___________________` | 1) ______ 2) ______ | ______ |

## 3. Google Sheet & Drive

| Berkas | Fungsi | Akses edit |
|---|---|---|
| Sheet Jadwal (TV + portal) | Jadwal Jumat, kajian, pengumuman | Semua admin DKM |
| Sheet Neraca Keuangan | Sumber laporan `neraca/` | Bendahara |
| Sheet Rekap ZIS | Sumber laporan `zis/` | Bendahara + panitia ZIS |
| Sheet Peta Dakwah | Database jamaah — **RAHASIA, jangan dipublikasi** | Maks. 3 pengurus inti |
| Video `now-showing.mp4` (Drive) | File tayangan TV masjid (URL tetap) | Admin sistem |

## 4. Otomasi Terjadwal (Claude Cowork)

| Jadwal | Tugas |
|---|---|
| Jumat 09.00 | Render video 2 slide (Jumat + kajian) |
| Jumat 13.00 | Render slide kajian saja |
| Ahad 06.00 | Render slide statis Senin–Jumat |

Akun pemilik otomasi: ______

## 5. Perangkat Fisik

| Perangkat | Lokasi | Catatan |
|---|---|---|
| TV display + pemutar | Masjid | Memutar URL Drive tetap; padding kiri 280px untuk widget jadwal shalat |
| Printer/QRIS/lainnya | ______ | ______ |

## 6. Kontak Teknis

| Peran | Nama | Kontak |
|---|---|---|
| Penanggung jawab sistem | ______ | ______ |
| Cadangan/pendamping | ______ | ______ |
