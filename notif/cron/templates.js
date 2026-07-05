/**
 * WA Message Templates — DKM Al Muslimun
 * All messages in Bahasa Indonesia
 */

const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00+07:00');
  return {
    hari: days[d.getDay()],
    tanggal: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
    dayIndex: d.getDay()
  };
}

/**
 * Template: Jadwal Imam — H-1
 */
function imamH1({ nama_imam, waktu_shalat, jam_shalat, tanggal }) {
  const { hari, tanggal: tgl } = formatDate(tanggal);
  return [
    `Assalamualaikum wr wb.`,
    ``,
    `Yth. Bapak ${nama_imam},`,
    ``,
    `Kami informasikan jadwal Bapak sebagai Imam Shalat di Masjid Al Muslimun:`,
    ``,
    `📅 Hari, Tanggal: ${hari}, ${tgl}`,
    `🕌 Waktu: ${waktu_shalat} (${jam_shalat} WIB)`,
    ``,
    `Mohon persiapkan diri dan hadir tepat waktu.`,
    `Jazakallah khairan katsiran.`,
    ``,
    `— DKM Masjid Al Muslimun`
  ].join('\n');
}

/**
 * Template: Reminder Imam — H-0 (30 menit sebelum)
 */
function imamReminder({ nama_imam, waktu_shalat, jam_shalat }) {
  return [
    `🔔 Assalamualaikum, Pak ${nama_imam}.`,
    ``,
    `Ini pengingat jadwal Imam Shalat ${waktu_shalat} hari ini pukul ${jam_shalat} WIB.`,
    ``,
    `Jazakallah.`,
    `— DKM Al Muslimun`
  ].join('\n');
}

/**
 * Template: Info Jumat (Kamis malam)
 */
function jumatInfo({ tanggal, nama_imam, nama_khatib, tema_khutbah }) {
  const { hari, tanggal: tgl } = formatDate(tanggal);
  return [
    `Assalamualaikum warahmatullahi wabarakatuh 📢`,
    ``,
    `*INFORMASI SHALAT JUM'AT*`,
    `━━━━━━━━━━━━━━━━━━`,
    `📅 Tanggal: ${tgl}`,
    `━━━━━━━━━━━━━━━━━━`,
    `🕌 *Khatib:* ${nama_khatib}`,
    `🗂️ *Tema:* ${tema_khutbah || '-'}`,
    `🕋 *Imam:* ${nama_imam}`,
    `━━━━━━━━━━━━━━━━━━`,
    `🕌 Masjid Al Muslimun`,
    `Jl. Selakopi, Sindangbarang, Bogor Barat`,
    ``,
    `Ayo ajak keluarga, kerabat, dan tetangga!`,
    `Barakallahufikum.`,
    ``,
    `— DKM Masjid Al Muslimun`
  ].join('\n');
}

/**
 * Template: Tugas Marbot (pagi hari)
 */
function tugasMarbot({ tanggal, tugasList }) {
  const { hari, tanggal: tgl } = formatDate(tanggal);
  const lines = tugasList.map((t, i) => `${i + 1}. ${t.status === 'done' ? '✅' : '⬜'} ${t.tugas} — ${t.pic}`);
  return [
    `📋 *TUGAS MARBOT — ${hari}, ${tgl}*`,
    `━━━━━━━━━━━━━━━━━━`,
    ``,
    ...lines,
    ``,
    `Jazakallah atas kerjasamanya.`,
    ``,
    `— DKM Al Muslimun (Bidang Ri'ayah)`
  ].join('\n');
}

/**
 * Template: Kajian Subuh Ahad (Sabtu malam)
 */
function kajianSubuh({ tanggal, nama_ustadz, tema_kajian }) {
  const { hari, tanggal: tgl } = formatDate(tanggal);
  return [
    `📢 *KAJIAN SUBUH — ${hari}, ${tgl}*`,
    `━━━━━━━━━━━━━━━━━━`,
    `🎙️ *Ustadz:* ${nama_ustadz}`,
    `📖 *Tema:* ${tema_kajian || '—'}`,
    `⏰ *Waktu:* Ba'da Shalat Subuh`,
    `━━━━━━━━━━━━━━━━━━`,
    `🕌 Masjid Al Muslimun`,
    `Jl. Selakopi, Sindangbarang, Bogor Barat`,
    ``,
    `Ayo hadir, jangan sampai ketinggalan!`,
    `Barakallah.`,
    ``,
    `— DKM Masjid Al Muslimun (Bidang Imaroh)`
  ].join('\n');
}

/**
 * Template: Pengumuman umum
 */
function pengumuman({ judul, isi }) {
  return [
    `📢 *${judul}*`,
    `━━━━━━━━━━━━━━━━━━`,
    ``,
    isi,
    ``,
    `— DKM Masjid Al Muslimun`
  ].join('\n');
}

// Mapping: jenis_jadwal → nama shalat Indonesia
const WAKTU_SHALAT = {
  imam_subuh: { nama: 'Subuh', jam: '04:30', reminderJam: '04:00' },
  imam_dzuhur: { nama: 'Dzuhur', jam: '12:00', reminderJam: '11:30' },
  imam_ashar: { nama: 'Ashar', jam: '15:30', reminderJam: '15:00' },
  imam_maghrib: { nama: 'Maghrib', jam: '18:00', reminderJam: '17:30' },
  imam_isya: { nama: 'Isya', jam: '19:00', reminderJam: '18:30' }
};

// Mapping: jenis_jadwal → template function + waktu kirim
const TEMPLATE_MAP = {
  imam_subuh: { template: imamH1, reminder: imamReminder, type: 'personal', sendH1Hour: 19 },
  imam_dzuhur: { template: imamH1, reminder: imamReminder, type: 'personal', sendH1Hour: 19 },
  imam_ashar: { template: imamH1, reminder: imamReminder, type: 'personal', sendH1Hour: 19 },
  imam_maghrib: { template: imamH1, reminder: imamReminder, type: 'personal', sendH1Hour: 19 },
  imam_isya: { template: imamH1, reminder: imamReminder, type: 'personal', sendH1Hour: 19 },
  jumat: { template: jumatInfo, type: 'grup', sendHour: 19, sendDay: 4 }, // Kamis
  kajian_subuh: { template: kajianSubuh, type: 'grup', sendHour: 19, sendDay: 6 } // Sabtu
};

module.exports = {
  imamH1,
  imamReminder,
  jumatInfo,
  tugasMarbot,
  kajianSubuh,
  pengumuman,
  WAKTU_SHALAT,
  TEMPLATE_MAP,
  formatDate
};
