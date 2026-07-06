/**
 * DKM Al-Muslimun — API Rekap ZIS (privasi nama muzakki)
 *
 * Web App ini membaca Google Sheet ZIS lalu mengembalikan datanya dengan
 * NAMA SUDAH TERSENSOR di sisi server. Karena penyensoran terjadi di server
 * (bukan di browser), Sheet asli boleh dibuat PRIVAT — nama lengkap tidak
 * pernah dikirim ke pengunjung.
 *
 * Cara deploy ada di README.md pada folder ini.
 */

// ==== KONFIGURASI ====
const SHEET_ID = '1mQZypiBnu428YN-SCSAL38R_3C9Xwq_FuqwZ6Fq6oW8';
const SHEET_NAME = 'INPUT MUZAKKI';

// Titik masuk Web App. Mendukung JSONP lewat parameter ?callback=namaFungsi
function doGet(e) {
  const callback = (e && e.parameter && e.parameter.callback) || null;
  let payload;
  try {
    payload = JSON.stringify({ ok: true, data: getData() });
  } catch (err) {
    payload = JSON.stringify({ ok: false, error: String(err) });
  }

  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + payload + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

function getData() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" tidak ditemukan');

  const range = sheet.getDataRange();
  const values = range.getValues();          // nilai mentah (untuk angka)
  const display = range.getDisplayValues();  // teks seperti tampil (untuk tanggal)

  // Kolom mengikuti tab INPUT MUZAKKI:
  // [1]=Tanggal, [2]=Nama, [3]=Komplek, [4]=Beras, [5]=Uang, [6]=Maal, [7]=Infaq
  const rows = [];
  for (let i = 1; i < values.length; i++) { // i=1 → lewati baris header
    const v = values[i];
    const d = display[i];
    const nama = v[2];
    if (!nama) continue; // lewati baris kosong

    rows.push({
      tanggal: d[1] || '-',
      nama: maskName(String(nama)),
      komplek: v[3] || '-',
      beras: toNum(v[4]),
      uang: toNum(v[5]),
      maal: toNum(v[6]),
      infaq: toNum(v[7])
    });
  }
  return rows;
}

// Sensor nama: tiap kata jadi huruf pertama + bintang. "Dodi Iriyanto" -> "D*** I*******"
function maskName(name) {
  if (!name) return name;
  return name.trim().split(/\s+/).map(function (w) {
    return w.length <= 1 ? w : w.charAt(0) + '*'.repeat(w.length - 1);
  }).join(' ');
}

function toNum(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}
