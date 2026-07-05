/**
 * Jadwal Imam Rawatib Tetap — DKM Al Muslimun
 * Sumber: Google Sheet jadwal rawatib
 * 
 * Struktur: imam_rawatib[hari_ke][shalat] = nama_imam
 * hari_ke: 1=Senin, 2=Selasa, ... 7=Minggu
 */

// Mapping nama shalat → jam (WIB)
const WAKTU_SHALAT = {
  subuh: { nama: 'Subuh', jam: '04:30' },
  dzuhur: { nama: 'Dzuhur', jam: '12:00' },
  ashar: { nama: 'Ashar', jam: '15:30' },
  maghrib: { nama: 'Maghrib', jam: '18:00' },
  isya: { nama: 'Isya', jam: '19:00' }
};

// Mapping hari (1=Senin..7=Minggu)
const DAYS = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

// Jadwal Imam Rawatib Tetap
// Data dari: https://docs.google.com/spreadsheets/d/1ZN02Wa2MfnCsnrxWSpG0waCsR3aF66fGqN_MesVb-Cs
const IMAM_RAWATIB = {
  // Senin
  1: {
    subuh: 'Rahmat Suhadi',
    dzuhur: 'Rakhmat Muharram',
    ashar: 'Dani',
    maghrib: 'Erwan',
    isya: 'Yunus Nugraha'
  },
  // Selasa
  2: {
    subuh: 'Yunus Nugraha',
    dzuhur: 'Dani',
    ashar: 'Ahmad Chozin',
    maghrib: 'Dani',
    isya: 'Rahmat Suhadi'
  },
  // Rabu
  3: {
    subuh: 'Yunus Nugraha',
    dzuhur: 'Dani',
    ashar: 'Sudirman',
    maghrib: 'Ahmad Chozin',
    isya: 'Dani'
  },
  // Kamis
  4: {
    subuh: 'Dani',
    dzuhur: 'Rakhmat Muharram',
    ashar: 'Dani',
    maghrib: 'Sudirman',
    isya: 'Prawoto'
  },
  // Jumat
  5: {
    subuh: 'Prawoto',
    dzuhur: null, // Khotib Jumat
    ashar: 'Dani',
    maghrib: 'Yunus Nugraha',
    isya: 'Sudirman'
  },
  // Sabtu
  6: {
    subuh: 'Yunus Nugraha',
    dzuhur: 'Rakhmat Muharram',
    ashar: 'Dani',
    maghrib: 'Prawoto',
    isya: 'Rahmat Suhadi'
  },
  // Minggu
  7: {
    subuh: null, // Ustad ceramah subuh
    dzuhur: 'Hardjanto',
    ashar: 'Erwan',
    maghrib: 'Rahmat Suhadi',
    isya: 'Yunus Nugraha'
  }
};

/**
 * Dapatkan semua jadwal imam untuk hari ini / tanggal tertentu
 * @param {Date} date - Date object (WIB)
 * @returns {Array} [{shalat, nama, jam, waktu_kirim}]
 */
function getJadwalHariIni(date) {
  const dayIndex = date.getDay(); // 0=Minggu, 1=Senin
  // Convert JS day (0=Minggu) ke index kita (1=Senin..7=Minggu)
  const idx = dayIndex === 0 ? 7 : dayIndex;
  
  const jadwal = IMAM_RAWATIB[idx];
  if (!jadwal) return [];
  
  const result = [];
  const shalatList = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  
  for (const shalat of shalatList) {
    const nama = jadwal[shalat];
    if (nama) {
      const ws = WAKTU_SHALAT[shalat];
      // Hitung waktu kirim: 2 jam sebelum shalat
      const jamParts = ws.jam.split(':');
      const jamKirim = parseInt(jamParts[0]) - 2;
      const menitKirim = jamParts[1];
      
      result.push({
        shalat: ws.nama,
        nama: nama,
        jam: ws.jam,
        waktu_kirim: `${String(jamKirim).padStart(2, '0')}:${menitKirim}`,
        hari: DAYS[idx]
      });
    }
  }
  
  return result;
}

/**
 * Dapatkan kontak imam dari database kontak
 * Output: { nama: { wa: '628xxx', ... } }
 */
function getKontakImam(kontakList) {
  const kontak = {};
  for (const k of kontakList) {
    kontak[k.nama] = { wa: k.wa, role: k.role };
  }
  return kontak;
}

module.exports = {
  IMAM_RAWATIB,
  WAKTU_SHALAT,
  DAYS,
  getJadwalHariIni,
  getKontakImam
};
