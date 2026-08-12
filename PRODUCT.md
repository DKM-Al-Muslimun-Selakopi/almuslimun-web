# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: static HTML, CSS, and JavaScript already present in the repository

## Users

Jamaah Masjid Al-Muslimun yang ingin melihat jadwal, kegiatan, dan transparansi keuangan; serta pengurus DKM yang memelihara data melalui Google Sheets.

## Product Purpose

Portal publik Masjid Al-Muslimun untuk menyajikan jadwal shalat, agenda Jumat dan kajian, laporan neraca, rekap ZIS, serta informasi infak secara terbuka.

## Operating Context

Situs dibuka dari ponsel maupun desktop oleh jamaah dan diperbarui dari Google Sheets yang juga menjadi sumber data layar TV masjid.

## Capabilities and Constraints

- Beranda menampilkan jadwal shalat dari Aladhan dan kegiatan dari Google Sheets.
- Halaman Neraca menampilkan ringkasan, chart, pencarian, dan rincian transaksi.
- Halaman ZIS menampilkan ringkasan, chart, dan daftar muzakki.
- Tetap menggunakan HTML/CSS/JavaScript statis dan endpoint data yang sudah ada.

## Brand Commitments

Nama Masjid Al-Muslimun, logo di `assets/logo.svg`, bahasa Indonesia, dan sistem visual yang diberikan di `/Users/dodiiriyanto/Downloads/design.md`.

## Evidence on Hand

Konten, data, dan endpoint saat ini berada di `index.html`, `neraca/`, `zis/`, dan `apps-script/`.

## Product Principles

- Informasi penting terbaca dalam beberapa detik.
- Transparansi harus terasa jelas, bukan dekoratif.
- Semua data tetap berasal dari sumber yang sudah dipakai pengurus.
- Tampilan responsif dan nyaman untuk jamaah lansia.

## Accessibility & Inclusion

Kontrol interaktif memiliki target sentuh minimal 44px, fokus keyboard terlihat, dan teks utama menggunakan kontras tinggi.
