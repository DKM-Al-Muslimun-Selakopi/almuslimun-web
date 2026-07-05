/**
 * DKM WA Notif — Cron Engine v2 (Rawatib Edition)
 * 
 * SIMPLIFIED: Jadwal imam rawatib TETAP, gak perlu Google Sheet JADWAL.
 * Cukup: panggil getJadwalHariIni() → cek jam → kirim WA reminder 2 jam sebelum shalat
 * 
 * Cara pakai:
 *   export FONNTE_TOKEN="token_anda"
 *   node engine.js
 *   node engine.js --test 62813xxxxxxxx
 */

const fetch = require('node-fetch');
const { sendWA, sendWithRetry } = require('./fonnte');
const { 
  imamH1, imamReminder, jumatInfo, kajianSubuh, tugasMarbot, pengumuman
} = require('./templates');
const { getJadwalHariIni, getKontakImam } = require('./rawatib');

// ===== CONFIG =====
const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
const SHEET_ID = process.env.SHEET_ID || '16zy8Pbbko67jPSEJJoIljG0B5Yvf_85yfW5UYh3PLzY';

// GID untuk kontak & tugas marbot aja (jadwal imam udah fixed di rawatib.js)
const GID = {
  KONTAK: '0',
  TUGAS_MARBOT: '1946823383'
};

// ===== HELPERS =====
async function fetchSheet(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}`;
  const resp = await fetch(url);
  const text = await resp.text();
  const json = JSON.parse(text.substring(47, text.length - 2));
  if (!json.table || !json.table.rows) return [];
  return json.table.rows.map(row => {
    if (!row.c) return [];
    return row.c.map(cell => (cell ? cell.f || cell.v || '' : ''));
  });
}

function logNotif(jadwalId, penerima, jenis, pesan, status, errorDetail = '') {
  const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const entry = { time, jadwalId, penerima, jenis, status, errorDetail };
  console.log('[LOG]', JSON.stringify(entry));
  return entry;
}

async function getContacts() {
  const rows = await fetchSheet(GID.KONTAK);
  const contacts = {};
  for (const row of rows) {
    if (row.length < 6) continue;
    const nama = (row[1] || '').replace('Bpk. ', '').trim();
    const wa = row[2] || '';
    const role = row[3] || '';
    const aktif = String(row[5] || '').toUpperCase() === 'TRUE';
    if (nama && wa && aktif) {
      contacts[nama] = { wa, role };
    }
  }
  return contacts;
}

async function getTugasMarbot(tanggal) {
  const rows = await fetchSheet(GID.TUGAS_MARBOT);
  return rows.filter(row => {
    if (row.length < 4) return false;
    return String(row[1] || '').trim() === tanggal;
  });
}

// ===== MAIN ENGINE =====
async function main() {
  console.log('⏰ DKM WA Notif — Cron Engine v2 (Rawatib)');
  
  if (!FONNTE_TOKEN) {
    console.error('❌ FONNTE_TOKEN tidak di-set.');
    process.exit(1);
  }

  const now = new Date();
  const nowWIB = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const jam = nowWIB.getHours();
  const menit = nowWIB.getMinutes();
  const totalMenit = jam * 60 + menit;
  const hariIni = nowWIB.toISOString().slice(0, 10);

  console.log(`🕒 ${nowWIB.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`);
  console.log(`📅 ${hariIni} | Jam: ${jam}:${String(menit).padStart(2, '0')}`);
  console.log('');

  // Cek jam operasional (04:00 - 20:00)
  if (jam < 4 || jam > 20) {
    console.log('⏸️ Di luar jam operasional. Skip.');
    return;
  }

  // ===== 1. KIRIM REMINDER IMAM RAWATIB (2 jam sebelum) =====
  console.log('=== REMINDER IMAM RAWATIB ===');
  console.log(`Cek jadwal jam ${jam}:${String(menit).padStart(2, '0')}...`);

  const jadwalHariIni = getJadwalHariIni(nowWIB);
  const kontakImam = await getContacts();
  
  console.log(`  Jadwal hari ini (${['','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'][nowWIB.getDay()===0?7:nowWIB.getDay()]}): ${jadwalHariIni.length} shalat`);

  for (const jadwal of jadwalHariIni) {
    // Parse waktu kirim (2 jam sebelum)
    const [jamKirim, menitKirim] = jadwal.waktu_kirim.split(':').map(Number);
    const totalMenitKirim = jamKirim * 60 + menitKirim;
    
    // Kirim reminder dalam rentang 10 menit dari jam kirim
    if (totalMenit >= totalMenitKirim && totalMenit < totalMenitKirim + 10) {
      const kontak = kontakImam[jadwal.nama] || kontakImam[jadwal.nama.replace('Bpk. ', '')];
      
      if (!kontak) {
        console.log(`❌ Kontak "${jadwal.nama}" tidak ditemukan di sheet KONTAK`);
        continue;
      }

      const msg = imamReminder({
        nama_imam: jadwal.nama,
        waktu_shalat: jadwal.shalat,
        jam_shalat: jadwal.jam
      });

      console.log(`📤 ${jadwal.shalat} (${jadwal.jam}) → ${jadwal.nama} (${kontak.wa})`);
      
      const result = await sendWithRetry(FONNTE_TOKEN, kontak.wa, msg);
      logNotif(`RAWATIB-${jadwal.shalat}`, `${jadwal.nama} (${kontak.wa})`, 'personal', msg,
        result.success ? 'terkirim' : 'gagal', result.error);
      
      console.log(result.success ? '✅ Terkirim' : `❌ Gagal: ${result.error}`);
    }
  }

  // ===== 2. PROSES TUGAS MARBOT (Jam 05:30) =====
  if (jam === 5 && menit >= 30 && menit < 40) {
    console.log('');
    console.log('=== TUGAS MARBOT ===');

    const tugasHariIni = await getTugasMarbot(hariIni);
    
    if (tugasHariIni.length > 0) {
      const tugasList = tugasHariIni.map(r => ({
        tugas: r[2],
        pic: r[3],
        status: r[4] || 'pending'
      }));

      const msg = tugasMarbot({ tanggal: hariIni, tugasList });
      console.log(`📤 ${tugasList.length} tugas → Grup Marbot`);
      console.log(`Pesan:\n${msg}\n`);
      logNotif('MARBOT', 'GRUP MARBOT', 'grup', msg, 'terkirim');
    } else {
      console.log('📭 Tidak ada tugas marbot untuk hari ini');
    }
  }

  console.log('');
  console.log('✅ Selesai.');
}

// ===== TEST MODE =====
async function testMode() {
  console.log('🧪 DKM WA Notif — TEST MODE');
  
  if (!FONNTE_TOKEN) {
    console.error('❌ FONNTE_TOKEN tidak di-set.');
    process.exit(1);
  }

  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const jadwal = getJadwalHariIni(now);
  
  console.log(`\n📋 Jadwal hari ini:`);
  for (const j of jadwal) {
    console.log(`  ▸ ${j.shalat} (${j.jam}) → ${j.nama} (reminder ${j.waktu_kirim})`);
  }

  const testTarget = process.argv[3] || process.env.TEST_WA_NUMBER;
  if (testTarget) {
    const msg = `🧪 TEST NOTIF DKM\n\nIni adalah pesan test dari sistem notifikasi DKM Al Muslimun.\n\nWaktu: ${now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB\n\nJika Anda menerima ini, sistem siap digunakan!\n\n— DKM Masjid Al Muslimun`;
    console.log(`\n📤 Mengirim test ke ${testTarget}...`);
    const result = await sendWithRetry(FONNTE_TOKEN, testTarget, msg);
    console.log(result.success ? '✅ Terkirim!' : `❌ Gagal: ${result.error}`);
  } else {
    console.log('\nℹ️  Untuk kirim test: node engine.js --test 62813xxxxxxxx');
  }
}

// ===== RUN =====
if (process.argv.includes('--test')) {
  testMode();
} else {
  main().catch(err => {
    console.error('❌ Fatal:', err);
    process.exit(1);
  });
}
