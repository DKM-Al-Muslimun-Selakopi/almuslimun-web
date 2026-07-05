/**
 * DKM Al Muslimun — Notifikasi WA Dashboard
 * Client-side JavaScript: Google Sheet integration, navigation, forms
 * 
 * MODE: Menggunakan dummy data dulu (DEMO_MODE = true)
 * Saat Google Sheet siap: ubah DEMO_MODE = false, isi SHEET_ID & GID
 */

// ====== KONFIGURASI ======
const DEMO_MODE = false;

// Google Sheet config
const SHEET_CONFIG = {
  SHEET_ID: '16zy8Pbbko67jPSEJJoIljG0B5Yvf_85yfW5UYh3PLzY',
  GID: {
    KONTAK: '0',
    JADWAL: '190523496',
    LOG_NOTIF: '1047746164',
    TUGAS_MARBOT: '1946823383'
  }
};

// ====== DATA DUMMY (Demo Mode) ======
const DEMO = {
  kontak: [
    { no: 1, nama: 'Gunawan B.', wa: '6281310417643', role: 'imam_tetap, pengurus', grup: 'jamaah_group, marbot_group', aktif: true },
    { no: 2, nama: 'Sonny L.', wa: '6289512756947', role: 'imam_tetap, pengurus', grup: 'jamaah_group', aktif: true },
    { no: 3, nama: 'Erwan', wa: '6281517278946', role: 'imam_tetap, pengurus', grup: 'jamaah_group, marbot_group', aktif: true },
    { no: 4, nama: 'Dodi Iriyanto', wa: '6281211111111', role: 'imam_tetap, pengurus', grup: 'jamaah_group', aktif: true },
    { no: 5, nama: 'Willy Murdianto', wa: '6285959737340', role: 'imam_tetap, pengurus', grup: 'jamaah_group', aktif: true },
    { no: 6, nama: 'Mukhsy N. A.', wa: '6281517494799', role: 'pengurus', grup: 'jamaah_group', aktif: true },
    { no: 7, nama: 'Dani', wa: '6281388888888', role: 'marbot', grup: 'marbot_group', aktif: true },
    { no: 8, nama: 'Junaedi', wa: '6281399999999', role: 'marbot', grup: 'marbot_group', aktif: true },
    { no: 9, nama: 'Agus', wa: '6281377777777', role: 'marbot', grup: 'marbot_group', aktif: true },
    { no: 10, nama: 'Rafi', wa: '6281311111111', role: 'imam_cadangan', grup: 'jamaah_group', aktif: true },
    { no: 11, nama: 'Purnomo Sidi', wa: '6281322222222', role: 'jamaah_biasa', grup: 'jamaah_group', aktif: true },
    { no: 12, nama: 'Rakhmat M.', wa: '6281282018349', role: 'pengurus', grup: 'jamaah_group', aktif: true }
  ],

  jadwal: [
    { id: 'J001', jenis: 'imam_subuh', tanggal: '2026-07-02', waktu: '04:30', nama1: 'Gunawan B.', nama2: '', tema: '', status_kirim: 'sent_h1', waktu_kirim: '2026-07-01 19:00:00' },
    { id: 'J002', jenis: 'imam_dzuhur', tanggal: '2026-07-02', waktu: '12:00', nama1: 'Sonny L.', nama2: '', tema: '', status_kirim: 'pending', waktu_kirim: '' },
    { id: 'J003', jenis: 'imam_ashar', tanggal: '2026-07-02', waktu: '15:30', nama1: 'Erwan', nama2: '', tema: '', status_kirim: 'pending', waktu_kirim: '' },
    { id: 'J004', jenis: 'imam_maghrib', tanggal: '2026-07-02', waktu: '18:00', nama1: 'Dodi Iriyanto', nama2: '', tema: '', status_kirim: 'pending', waktu_kirim: '' },
    { id: 'J005', jenis: 'imam_isya', tanggal: '2026-07-02', waktu: '19:00', nama1: 'Willy Murdianto', nama2: '', tema: '', status_kirim: 'pending', waktu_kirim: '' },
    { id: 'J006', jenis: 'jumat', tanggal: '2026-07-03', waktu: '12:00', nama1: 'Rafi', nama2: 'Ust. Ahmad Fauzi', tema: 'Ikhlas & Tawakal dalam Kehidupan', status_kirim: 'pending', waktu_kirim: '' },
    { id: 'J007', jenis: 'kajian_subuh', tanggal: '2026-07-05', waktu: '04:30', nama1: 'Ust. Firman', nama2: '', tema: 'Menjaga Lisan di Era Digital', status_kirim: 'pending', waktu_kirim: '' },
    { id: 'J008', jenis: 'imam_dzuhur', tanggal: '2026-07-03', waktu: '12:00', nama1: 'Gunawan B.', nama2: '', tema: '', status_kirim: 'pending', waktu_kirim: '' },
    { id: 'J009', jenis: 'imam_ashar', tanggal: '2026-07-03', waktu: '15:30', nama1: 'Sonny L.', nama2: '', tema: '', status_kirim: 'pending', waktu_kirim: '' },
    { id: 'J010', jenis: 'imam_maghrib', tanggal: '2026-07-03', waktu: '18:00', nama1: 'Erwan', nama2: '', tema: '', status_kirim: 'pending', waktu_kirim: '' },
    { id: 'J011', jenis: 'pengajian_ibu', tanggal: '2026-07-06', waktu: '15:30', nama1: 'Ustadzah Siti', nama2: '', tema: 'Fikih Wanita', status_kirim: 'pending', waktu_kirim: '' },
    { id: 'J012', jenis: 'imam_subuh', tanggal: '2026-07-03', waktu: '04:30', nama1: 'Dodi Iriyanto', nama2: '', tema: '', status_kirim: 'sent_h1', waktu_kirim: '2026-07-02 19:00:00' }
  ],

  logNotif: [
    { id_jadwal: 'J001', waktu_kirim: '02 Jul 19:00', penerima: 'Gunawan B.', jenis: 'personal', pesan: 'Assalamualaikum wr wb. Yth. Bapak Gunawan B....', status: 'terkirim' },
    { id_jadwal: 'J012', waktu_kirim: '02 Jul 19:00', penerima: 'Dodi Iriyanto', jenis: 'personal', pesan: 'Assalamualaikum wr wb. Yth. Bapak Dodi Iriyanto....', status: 'terkirim' },
    { id_jadwal: 'MARBOT', waktu_kirim: '02 Jul 05:30', penerima: 'Grup Marbot', jenis: 'grup', pesan: 'Tugas Marbot hari ini...', status: 'terkirim' }
  ],

  tugasMarbot: [
    { id: 'M001', tanggal: '2026-07-02', tugas: 'Bersih Karpet', pic: 'Dani', status: 'done' },
    { id: 'M002', tanggal: '2026-07-02', tugas: 'Isi Aqua Galon', pic: 'Junaedi', status: 'done' },
    { id: 'M003', tanggal: '2026-07-02', tugas: 'Sapu Halaman', pic: 'Agus', status: 'pending' },
    { id: 'M004', tanggal: '2026-07-02', tugas: 'Ganti Mukena', pic: 'Dani', status: 'pending' },
    { id: 'M005', tanggal: '2026-07-02', tugas: 'Periksa Toilet', pic: 'Junaedi', status: 'pending' },
    { id: 'M006', tanggal: '2026-07-02', tugas: 'Periksa Wudhu', pic: 'Agus', status: 'pending' },
    // Besok
    { id: 'M007', tanggal: '2026-07-03', tugas: 'Bersih Karpet', pic: 'Agus', status: 'pending' },
    { id: 'M008', tanggal: '2026-07-03', tugas: 'Isi Aqua Galon', pic: 'Dani', status: 'pending' },
    { id: 'M009', tanggal: '2026-07-03', tugas: 'Sapu Halaman', pic: 'Junaedi', status: 'pending' },
    { id: 'M010', tanggal: '2026-07-03', tugas: 'Ganti Mukena', pic: 'Agus', status: 'pending' },
    { id: 'M011', tanggal: '2026-07-03', tugas: 'Periksa Toilet', pic: 'Dani', status: 'pending' },
    { id: 'M012', tanggal: '2026-07-03', tugas: 'Periksa Wudhu', pic: 'Junaedi', status: 'pending' }
  ]
};

// ====== DATA STORE ======
let data = {
  kontak: [],
  jadwal: [],
  logNotif: [],
  tugasMarbot: []
};

const JENIS_SHALAT = ['imam_subuh', 'imam_dzuhur', 'imam_ashar', 'imam_maghrib', 'imam_isya'];
const NAMA_SHALAT = { imam_subuh: 'Subuh', imam_dzuhur: 'Dzuhur', imam_ashar: 'Ashar', imam_maghrib: 'Maghrib', imam_isya: 'Isya' };
const JAM_SHALAT = { imam_subuh: '04:30', imam_dzuhur: '12:00', imam_ashar: '15:30', imam_maghrib: '18:00', imam_isya: '19:00' };
const JENIS_LABEL = {
  imam_subuh: 'Imam Subuh', imam_dzuhur: 'Imam Dzuhur', imam_ashar: 'Imam Ashar',
  imam_maghrib: 'Imam Maghrib', imam_isya: 'Imam Isya',
  jumat: 'Jumat (Imam & Khatib)', kajian_subuh: 'Kajian Subuh',
  pengajian_ibu: 'Pengajian Ibu', pengajian_anak: 'Pengajian Anak', pengajian_remaja: 'Pengajian Remaja'
};

// ====== JADWAL IMAM RAWATIB TETAP ======
// Sumber: https://docs.google.com/spreadsheets/d/1ZN02Wa2MfnCsnrxWSpG0waCsR3aF66fGqN_MesVb-Cs
const WAKTU_SHALAT_RAWATIB = {
  subuh: { nama: 'Subuh', jam: '04:30' },
  dzuhur: { nama: 'Dzuhur', jam: '12:00' },
  ashar: { nama: 'Ashar', jam: '15:30' },
  maghrib: { nama: 'Maghrib', jam: '18:00' },
  isya: { nama: 'Isya', jam: '19:00' }
};

const SHALAT_LIST = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
const HARI = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

// Jadwal imam rawatib: IMAM_RAWATIB[hari_ke][shalat] = nama_imam
const IMAM_RAWATIB = {
  1: { subuh:'Rahmat Suhadi', dzuhur:'Rakhmat Muharram', ashar:'Dani', maghrib:'Erwan', isya:'Yunus Nugraha' },
  2: { subuh:'Yunus Nugraha', dzuhur:'Dani', ashar:'Ahmad Chozin', maghrib:'Dani', isya:'Rahmat Suhadi' },
  3: { subuh:'Yunus Nugraha', dzuhur:'Dani', ashar:'Sudirman', maghrib:'Ahmad Chozin', isya:'Dani' },
  4: { subuh:'Dani', dzuhur:'Rakhmat Muharram', ashar:'Dani', maghrib:'Sudirman', isya:'Prawoto' },
  5: { subuh:'Prawoto', dzuhur:null, ashar:'Dani', maghrib:'Yunus Nugraha', isya:'Sudirman' },
  6: { subuh:'Yunus Nugraha', dzuhur:'Rakhmat Muharram', ashar:'Dani', maghrib:'Prawoto', isya:'Rahmat Suhadi' },
  7: { subuh:null, dzuhur:'Hardjanto', ashar:'Erwan', maghrib:'Rahmat Suhadi', isya:'Yunus Nugraha' }
};

function getJadwalImam(date) {
  if (!date) date = new Date();
  let day = date.getDay(); // 0=Minggu
  let idx = day === 0 ? 7 : day;
  const jadwal = IMAM_RAWATIB[idx] || {};
  return SHALAT_LIST.map(s => ({
    shalat: WAKTU_SHALAT_RAWATIB[s].nama,
    jam: WAKTU_SHALAT_RAWATIB[s].jam,
    imam: jadwal[s] || '—'
  }));
}
const TUGAS_STANDAR = ['Bersih Karpet', 'Isi Aqua Galon', 'Ganti Mukena', 'Sapu Halaman', 'Periksa Toilet', 'Periksa Wudhu'];
const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

let currentTab = 'dashboard';
let calendarMonth = new Date().getMonth();
let calendarYear = new Date().getFullYear();

// ====== TOAST ======
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ====== DATE HELPERS ======
function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatDate(str) {
  const d = new Date(str + 'T00:00:00+07:00');
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTimeHour(str) {
  if (!str) return '';
  return str.slice(0, 5);
}

// ====== DATA FETCHING ======
async function loadData() {
  if (DEMO_MODE) {
    data.kontak = [...DEMO.kontak];
    data.jadwal = [...DEMO.jadwal];
    data.logNotif = [...DEMO.logNotif];
    data.tugasMarbot = [...DEMO.tugasMarbot];
    return;
  }

  // Google Sheet mode — fetch via gviz/tq API
  try {
    const [kontak, jadwal, logNotif, tugasMarbot] = await Promise.all([
      fetchSheet(SHEET_CONFIG.GID.KONTAK),
      fetchSheet(SHEET_CONFIG.GID.JADWAL),
      fetchSheet(SHEET_CONFIG.GID.LOG_NOTIF),
      fetchSheet(SHEET_CONFIG.GID.TUGAS_MARBOT)
    ]);
    data.kontak = parseKontak(kontak);
    data.jadwal = parseJadwal(jadwal);
    data.logNotif = parseLog(logNotif);
    data.tugasMarbot = parseTugas(tugasMarbot);
  } catch (err) {
    console.error('Gagal load sheet:', err);
    showToast('Gagal memuat data dari Google Sheet', 'error');
    // Fallback ke demo
    data.kontak = [...DEMO.kontak];
    data.jadwal = [...DEMO.jadwal];
    data.logNotif = [...DEMO.logNotif];
    data.tugasMarbot = [...DEMO.tugasMarbot];
  }
}

async function fetchSheet(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}`;
  const resp = await fetch(url);
  const text = await resp.text();
  const json = JSON.parse(text.substring(47, text.length - 2));
  if (!json.table || !json.table.rows) return [];
  return json.table.rows.map(row => {
    if (!row.c) return [];
    return row.c.map(cell => (cell ? cell.f || cell.v || '' : ''));
  });
}

function parseKontak(rows) {
  return rows.slice(1).map((r, i) => ({
    no: i + 1,
    nama: r[1] || '',
    wa: r[2] || '',
    role: r[3] || '',
    grup: r[4] || '',
    aktif: String(r[5] || '').toUpperCase() === 'TRUE'
  }));
}

function parseJadwal(rows) {
  return rows.slice(1).map(r => ({
    id: r[0] || '',
    jenis: r[1] || '',
    tanggal: r[2] || '',
    waktu: r[3] || '',
    nama1: r[4] || '',
    nama2: r[5] || '',
    tema: r[6] || '',
    status_kirim: r[7] || 'pending',
    waktu_kirim: r[8] || ''
  }));
}

function parseLog(rows) {
  return rows.slice(1).map(r => ({
    id_jadwal: r[0] || '',
    waktu_kirim: r[1] || '',
    penerima: r[2] || '',
    jenis: r[3] || '',
    pesan: r[4] || '',
    status: r[5] || ''
  }));
}

function parseTugas(rows) {
  return rows.slice(1).map(r => ({
    id: r[0] || '',
    tanggal: r[1] || '',
    tugas: r[2] || '',
    pic: r[3] || '',
    status: r[4] || 'pending'
  }));
}

// ====== TAB NAVIGATION ======
function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.toggle('active', el.id === `tab-${tabName}`);
  });
}

// ====== RENDER: DASHBOARD ======
function renderDashboard() {
  const today = todayStr();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const jadwalToday = data.jadwal.filter(j => j.tanggal === today);
  const jadwalTomorrow = data.jadwal.filter(j => j.tanggal === tomorrowStr);
  const tugasToday = data.tugasMarbot.filter(t => t.tanggal === today);

  const sentCount = data.logNotif.length;
  const pendingCount = jadwalToday.filter(j => j.status_kirim === 'pending').length +
    jadwalTomorrow.filter(j => j.status_kirim === 'pending').length;
  const failedCount = data.logNotif.filter(l => l.status === 'gagal').length;

  const el = document.getElementById('tab-dashboard');
  el.innerHTML = `
    <div class="stat-row">
      <div class="stat-card primary">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${sentCount}</div>
        <div class="stat-label">Terkirim Hari Ini</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-icon">⏳</div>
        <div class="stat-value">${pendingCount}</div>
        <div class="stat-label">Antri / Pending</div>
      </div>
      <div class="stat-card success">
        <div class="stat-icon">📊</div>
        <div class="stat-value">${jadwalTomorrow.length}</div>
        <div class="stat-label">Jadwal Besok</div>
      </div>
      <div class="stat-card ${failedCount > 0 ? 'error' : 'success'}">
        <div class="stat-icon">📤</div>
        <div class="stat-value">${sentCount + pendingCount}</div>
        <div class="stat-label">Total Notifikasi</div>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="card">
          <div class="card-title"><span class="icon">🕌</span> Jadwal Imam Hari Ini (${formatDate(today)})</div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr><th>Waktu</th><th>Shalat</th><th>Imam</th><th>Status</th></tr>
              </thead>
              <tbody>
                ${renderImamTable(today)}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-title"><span class="icon">📋</span> Tugas Marbot Hari Ini</div>
          ${tugasToday.length > 0 ? `
          <ul class="checklist">
            ${tugasToday.map(t => `
              <li class="checklist-item ${t.status === 'done' ? 'done' : ''}">
                <span>${t.status === 'done' ? '✅' : '⬜'}</span>
                <span class="task-name">${t.tugas}</span>
                <span class="task-pic">— ${t.pic}</span>
              </li>
            `).join('')}
          </ul>` : `<div class="empty-state"><p>Tidak ada tugas untuk hari ini</p></div>`}
        </div>
      </div>

      <div>
        <div class="card">
          <div class="card-title"><span class="icon">🕒</span> Jadwal Imam Besok (${formatDate(tomorrowStr)})</div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr><th>Waktu</th><th>Shalat</th><th>Imam</th></tr>
              </thead>
              <tbody>
                ${renderImamTable(tomorrowStr)}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-title"><span class="icon">📝</span> Notifikasi Terakhir</div>
          ${data.logNotif.length > 0 ? data.logNotif.slice(-5).reverse().map(l => `
            <div class="log-entry">
              <span class="log-time">${l.waktu_kirim}</span>
              <span class="log-target">${l.penerima} <span style="color:var(--text-muted)">(${l.jenis})</span></span>
              <span class="log-status">
                <span class="badge ${l.status === 'terkirim' ? 'badge-success' : l.status === 'gagal' ? 'badge-error' : 'badge-warning'}">
                  ${l.status === 'terkirim' ? '✅' : l.status === 'gagal' ? '❌' : '⏳'} ${l.status}
                </span>
              </span>
            </div>
          `).join('') : `<div class="empty-state"><p>Belum ada notifikasi</p></div>`}
        </div>
      </div>
    </div>
  `;
}

function renderImamTable(dateStr) {
  // Jadwal rawatib tetap — bukan dari sheet
  const date = dateStr ? new Date(dateStr + 'T00:00:00+07:00') : new Date();
  const jadwalRawatib = getJadwalImam(date);
  
  if (!jadwalRawatib || jadwalRawatib.length === 0 || jadwalRawatib.every(j => j.imam === '—')) {
    return '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:20px;">Tidak ada jadwal imam</td></tr>';
  }
  
  return jadwalRawatib.map(j => {
    const isFilled = j.imam !== '—';
    return `<tr><td>${j.jam}</td><td>${j.shalat}</td><td>${isFilled ? j.imam : '<span style="color:var(--text-muted)">—</span>'}</td><td>${
      isFilled ? '<span class="badge badge-info">📋 Rawatib</span>' : '<span class="badge badge-warning">📭 Kosong</span>'
    }</td></tr>`;
  }).join('');
}

// ====== RENDER: JADWAL ======
function renderJadwal() {
  const el = document.getElementById('tab-jadwal');
  const today = todayStr();

  el.innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card-title"><span class="icon">➕</span> Tambah Jadwal Baru</div>
        <form id="form-jadwal">
          <div class="form-group">
            <label class="form-label">Jenis Jadwal</label>
            <select class="form-select" id="f-jenis" required>
              <option value="">Pilih jenis...</option>
              ${Object.entries(JENIS_LABEL).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Tanggal</label>
              <input class="form-input" type="date" id="f-tanggal" value="${today}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Waktu</label>
              <input class="form-input" type="time" id="f-waktu" value="12:00">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Nama (Imam/Ustadz/Khatib)</label>
            <select class="form-select" id="f-nama1" required>
              <option value="">Pilih nama...</option>
              ${data.kontak.filter(k => k.aktif).map(k => `<option value="${k.nama}">${k.nama}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Nama 2 (Khatib/Co-Ustadz) <span style="color:var(--text-muted)">opsional</span></label>
            <input class="form-input" type="text" id="f-nama2" placeholder="Misal: nama khatib untuk Jumat">
          </div>
          <div class="form-group">
            <label class="form-label">Tema / Judul <span style="color:var(--text-muted)">opsional</span></label>
            <input class="form-input" type="text" id="f-tema" placeholder="Tema kajian / khutbah">
          </div>
          <div class="form-group">
            <label class="toggle">
              <input type="checkbox" id="f-ulang">
              <span class="toggle-slider"></span>
              <span class="toggle-label">Ulang setiap minggu</span>
            </label>
          </div>
          <div class="form-group" id="f-ulang-hari-container" style="display:none;">
            <label class="form-label">Hari pengulangan</label>
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
              ${DAYS.map((d, i) => `<label class="toggle" style="margin-right:8px;">
                <input type="checkbox" class="ulang-hari" value="${i}">
                <span class="toggle-slider" style="width:30px;height:18px;"></span>
                <span class="toggle-label" style="font-size:12px;">${d.slice(0,3)}</span>
              </label>`).join('')}
            </div>
          </div>
          <button type="submit" class="btn btn-primary">✅ Simpan Jadwal</button>
        </form>
      </div>

      <div class="card">
        <div class="card-title"><span class="icon">📅</span> Kalender Jadwal</div>
        <div id="calendar"></div>
        ${renderCalendar()}
      </div>
    </div>

    <div class="card">
      <div class="card-title"><span class="icon">📋</span> Semua Jadwal Bulan Ini</div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>Tanggal</th><th>Hari</th><th>Jenis</th><th>Nama</th><th>Waktu</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${renderAllJadwal()}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Event listeners
  document.getElementById('f-ulang').addEventListener('change', function() {
    document.getElementById('f-ulang-hari-container').style.display = this.checked ? 'block' : 'none';
  });

  document.getElementById('form-jadwal').addEventListener('submit', function(e) {
    e.preventDefault();
    const entry = {
      id: 'J' + String(data.jadwal.length + 1).padStart(3, '0'),
      jenis: document.getElementById('f-jenis').value,
      tanggal: document.getElementById('f-tanggal').value,
      waktu: document.getElementById('f-waktu').value,
      nama1: document.getElementById('f-nama1').value,
      nama2: document.getElementById('f-nama2').value,
      tema: document.getElementById('f-tema').value,
      status_kirim: 'pending',
      waktu_kirim: ''
    };
    data.jadwal.push(entry);
    
    // Handle recurring
    if (document.getElementById('f-ulang').checked) {
      const hariTerpilih = [...document.querySelectorAll('.ulang-hari:checked')].map(c => parseInt(c.value));
      if (hariTerpilih.length > 0) {
        let base = new Date(entry.tanggal + 'T00:00:00+07:00');
        for (let w = 1; w <= 12; w++) {
          for (const h of hariTerpilih) {
            const nextDate = new Date(base);
            nextDate.setDate(base.getDate() + (w * 7) + (h - base.getDay()));
            const newEntry = { ...entry, id: 'J' + String(data.jadwal.length + 1).padStart(3, '0'), tanggal: nextDate.toISOString().slice(0, 10) };
            data.jadwal.push(newEntry);
          }
        }
        showToast(`${hariTerpilih.length} jadwal berulang tersimpan untuk 12 minggu`, 'success');
      }
    }

    showToast('✅ Jadwal berhasil disimpan!', 'success');
    this.reset();
    document.getElementById('f-tanggal').value = today;
    renderJadwal();
    renderDashboard();
  });
}

function renderCalendar() {
  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const today = new Date();

  let html = `
    <div class="calendar-header">
      <button class="calendar-nav-btn" onclick="changeMonth(-1)">‹</button>
      <h3>${MONTHS[calendarMonth]} ${calendarYear}</h3>
      <button class="calendar-nav-btn" onclick="changeMonth(1)">›</button>
    </div>
    <div class="calendar-grid">
      ${DAYS.map(d => `<div class="calendar-day-header">${d.slice(0, 3)}</div>`).join('')}
  `;

  // Empty cells before first day
  for (let i = 0; i < startDay; i++) html += '<div class="calendar-day other-month"></div>';

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateStr === todayStr();
    const events = data.jadwal.filter(j => j.tanggal === dateStr);
    
    html += `<div class="calendar-day ${isToday ? 'today' : ''}">
      <div class="day-number">${d}</div>
      ${events.slice(0, 3).map(e => `<div class="day-event">${JENIS_LABEL[e.jenis] || e.jenis}: ${e.nama1}</div>`).join('')}
      ${events.length > 3 ? `<div class="day-event" style="color:var(--text-muted)">+${events.length - 3} lagi</div>` : ''}
    </div>`;
  }

  html += '</div>';
  return html;
}

function changeMonth(delta) {
  calendarMonth += delta;
  if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
  if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
  renderJadwal();
}

function renderAllJadwal() {
  const monthStart = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-01`;
  const monthEnd = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-31`;

  const filtered = data.jadwal
    .filter(j => j.tanggal >= monthStart && j.tanggal <= monthEnd)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  if (filtered.length === 0) {
    return `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px;">Belum ada jadwal bulan ini</td></tr>`;
  }

  return filtered.map(j => {
    const d = new Date(j.tanggal + 'T00:00:00+07:00');
    const hari = DAYS[d.getDay()];
    const statusBadge = j.status_kirim === 'sent_h1' || j.status_kirim === 'sent'
      ? '<span class="badge badge-success">✅ Terkirim</span>'
      : j.status_kirim === 'failed'
      ? '<span class="badge badge-error">❌ Gagal</span>'
      : '<span class="badge badge-warning">⏳ Menunggu</span>';
    return `<tr>
      <td>${j.tanggal}</td>
      <td>${hari}</td>
      <td>${JENIS_LABEL[j.jenis] || j.jenis}</td>
      <td>${j.nama1}${j.nama2 ? '<br><span style="color:var(--text-muted);font-size:12px;">+ ' + j.nama2 + '</span>' : ''}</td>
      <td>${j.waktu || '—'}</td>
      <td>${statusBadge}</td>
    </tr>`;
  }).join('');
}

// ====== RENDER: TUGAS MARBOT ======
function renderTugas() {
  const today = todayStr();
  const el = document.getElementById('tab-tugas');
  const tugasToday = data.tugasMarbot.filter(t => t.tanggal === today);

  el.innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card-title"><span class="icon">✏️</span> Atur Tugas Marbot — ${formatDate(today)}</div>
        <form id="form-tugas">
          ${TUGAS_STANDAR.map(t => {
            const existing = tugasToday.find(tg => tg.tugas === t);
            return `
            <div class="form-row" style="margin-bottom:8px;align-items:center;">
              <div style="flex:1;"><label class="form-label" style="margin:0;">${t}</label></div>
              <div style="flex:1;">
                <select class="form-select tugas-pic" data-tugas="${t}" style="width:100%;">
                  <option value="">Pilih PIC...</option>
                  ${data.kontak.filter(k => k.role.includes('marbot') && k.aktif).map(k => 
                    `<option value="${k.nama}" ${existing && existing.pic === k.nama ? 'selected' : ''}>${k.nama}</option>`
                  ).join('')}
                </select>
              </div>
              <label class="toggle" style="min-width:60px;">
                <input type="checkbox" class="tugas-status" data-tugas="${t}" ${existing && existing.status === 'done' ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>`;
          }).join('')}
          <button type="submit" class="btn btn-primary">💾 Simpan Tugas</button>
        </form>
      </div>

      <div>
        <div class="card">
          <div class="card-title"><span class="icon">📋</span> Status Hari Ini</div>
          ${tugasToday.length > 0 ? `
          <ul class="checklist">
            ${tugasToday.map(t => `
              <li class="checklist-item ${t.status === 'done' ? 'done' : ''}">
                <span>${t.status === 'done' ? '✅' : '⬜'}</span>
                <span class="task-name">${t.tugas}</span>
                <span class="task-pic">— ${t.pic}</span>
              </li>
            `).join('')}
          </ul>` : `<div class="empty-state"><p>Belum ada tugas untuk hari ini</p></div>`}
        </div>

        <div class="card">
          <div class="card-title"><span class="icon">📅</span> Riwayat Tugas</div>
          <div style="margin-bottom:12px;">
            <input class="form-input" type="date" id="tugas-history-date" value="${today}">
          </div>
          <div id="tugas-history"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('form-tugas').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Hapus tugas lama untuk tanggal ini
    data.tugasMarbot = data.tugasMarbot.filter(t => t.tanggal !== today);
    
    // Simpan tugas baru
    document.querySelectorAll('.tugas-pic').forEach(sel => {
      const tugas = sel.dataset.tugas;
      const pic = sel.value;
      if (pic) {
        const statusCheckbox = document.querySelector(`.tugas-status[data-tugas="${tugas}"]`);
        const status = statusCheckbox && statusCheckbox.checked ? 'done' : 'pending';
        data.tugasMarbot.push({
          id: 'M' + String(data.tugasMarbot.length + 1).padStart(3, '0'),
          tanggal: today,
          tugas,
          pic,
          status
        });
      }
    });

    showToast('✅ Tugas marbot berhasil disimpan!', 'success');
    renderTugas();
    renderDashboard();
  });

  document.getElementById('tugas-history-date').addEventListener('change', function() {
    renderTugasHistory(this.value);
  });

  renderTugasHistory(today);
}

function renderTugasHistory(dateStr) {
  const el = document.getElementById('tugas-history');
  const tugas = data.tugasMarbot.filter(t => t.tanggal === dateStr);
  
  if (tugas.length === 0) {
    el.innerHTML = `<div class="empty-state"><p>Tidak ada data untuk tanggal ${dateStr}</p></div>`;
    return;
  }

  el.innerHTML = `
    <div class="table-wrapper">
      <table>
        <thead><tr><th>Tugas</th><th>PIC</th><th>Status</th></tr></thead>
        <tbody>
          ${tugas.map(t => `<tr>
            <td>${t.tugas}</td>
            <td>${t.pic}</td>
            <td>${t.status === 'done' ? '<span class="badge badge-success">✅ Selesai</span>' : '<span class="badge badge-warning">⬜ Pending</span>'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ====== RENDER: KONTAK ======
function renderKontak() {
  const el = document.getElementById('tab-kontak');

  el.innerHTML = `
    <div class="card">
      <div class="card-title"><span class="icon">👥</span> Manajemen Kontak</div>
      <div class="search-bar">
        <input class="search-input" id="kontak-search" placeholder="Cari nama / nomor...">
        <select class="filter-select" id="kontak-filter">
          <option value="semua">Semua Role</option>
          <option value="imam_tetap">Imam Tetap</option>
          <option value="marbot">Marbot</option>
          <option value="pengurus">Pengurus</option>
          <option value="jamaah_biasa">Jamaah</option>
        </select>
        <button class="btn btn-primary" onclick="showTambahKontak()">➕ Tambah</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>#</th><th>Nama</th><th>No. WA</th><th>Role</th><th>Aktif</th><th>Aksi</th></tr>
          </thead>
          <tbody id="kontak-table-body"></tbody>
        </table>
      </div>
    </div>
  `;

  renderKontakTable();

  document.getElementById('kontak-search').addEventListener('input', renderKontakTable);
  document.getElementById('kontak-filter').addEventListener('change', renderKontakTable);
}

function renderKontakTable() {
  const search = (document.getElementById('kontak-search')?.value || '').toLowerCase();
  const filter = document.getElementById('kontak-filter')?.value || 'semua';
  const tbody = document.getElementById('kontak-table-body');

  let filtered = data.kontak;
  if (search) filtered = filtered.filter(k => k.nama.toLowerCase().includes(search) || k.wa.includes(search));
  if (filter !== 'semua') filtered = filtered.filter(k => k.role.includes(filter));

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px;">Kontak tidak ditemukan</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(k => `
    <tr>
      <td>${k.no}</td>
      <td><strong>${k.nama}</strong></td>
      <td>${k.wa}</td>
      <td>${k.role.split(',').map(r => `<span class="badge badge-info" style="margin:1px;">${r.trim()}</span>`).join(' ')}</td>
      <td>${k.aktif ? '<span class="badge badge-success">✅ Aktif</span>' : '<span class="badge badge-error">❌ Nonaktif</span>'}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editKontak('${k.nama}')">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="toggleKontak('${k.nama}')">${k.aktif ? '🚫' : '✅'}</button>
      </td>
    </tr>
  `).join('');
}

function showTambahKontak() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box">
      <h3>➕ Tambah Kontak</h3>
      <form id="form-tambah-kontak">
        <div class="form-group">
          <label class="form-label">Nama</label>
          <input class="form-input" id="k-nama" required>
        </div>
        <div class="form-group">
          <label class="form-label">No. WA (628xxx, tanpa +)</label>
          <input class="form-input" id="k-wa" required pattern="62[0-9]{8,15}">
        </div>
        <div class="form-group">
          <label class="form-label">Role (pisahkan dengan koma)</label>
          <input class="form-input" id="k-role" value="jamaah_biasa">
        </div>
        <div style="display:flex;gap:8px;">
          <button type="submit" class="btn btn-primary">💾 Simpan</button>
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Batal</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('form-tambah-kontak').addEventListener('submit', function(e) {
    e.preventDefault();
    data.kontak.push({
      no: data.kontak.length + 1,
      nama: document.getElementById('k-nama').value,
      wa: document.getElementById('k-wa').value,
      role: document.getElementById('k-role').value,
      grup: 'jamaah_group',
      aktif: true
    });
    modal.remove();
    renderKontak();
    showToast('✅ Kontak berhasil ditambahkan!', 'success');
  });
}

function editKontak(nama) {
  const kontak = data.kontak.find(k => k.nama === nama);
  if (!kontak) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box">
      <h3>✏️ Edit Kontak — ${nama}</h3>
      <form id="form-edit-kontak">
        <div class="form-group">
          <label class="form-label">Nama</label>
          <input class="form-input" id="ke-nama" value="${kontak.nama}" required>
        </div>
        <div class="form-group">
          <label class="form-label">No. WA</label>
          <input class="form-input" id="ke-wa" value="${kontak.wa}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Role</label>
          <input class="form-input" id="ke-role" value="${kontak.role}">
        </div>
        <div style="display:flex;gap:8px;">
          <button type="submit" class="btn btn-primary">💾 Simpan</button>
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Batal</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('form-edit-kontak').addEventListener('submit', function(e) {
    e.preventDefault();
    kontak.nama = document.getElementById('ke-nama').value;
    kontak.wa = document.getElementById('ke-wa').value;
    kontak.role = document.getElementById('ke-role').value;
    modal.remove();
    renderKontak();
    showToast('✅ Kontak berhasil diupdate!', 'success');
  });
}

function toggleKontak(nama) {
  const kontak = data.kontak.find(k => k.nama === nama);
  if (kontak) {
    kontak.aktif = !kontak.aktif;
    renderKontak();
    showToast(`${kontak.aktif ? '✅' : '🚫'} ${nama} ${kontak.aktif ? 'diaktifkan' : 'dinonaktifkan'}`, 'success');
  }
}

// ====== RENDER: LOG ======
function renderLog() {
  const el = document.getElementById('tab-log');

  el.innerHTML = `
    <div class="card">
      <div class="card-title"><span class="icon">📝</span> Log Notifikasi</div>
      <div class="search-bar">
        <input class="search-input" id="log-search" placeholder="Cari penerima / ID...">
        <select class="filter-select" id="log-filter">
          <option value="semua">Semua Status</option>
          <option value="terkirim">✅ Terkirim</option>
          <option value="gagal">❌ Gagal</option>
          <option value="antri">⏳ Antri</option>
        </select>
      </div>
      <div id="log-list"></div>
    </div>
  `;

  renderLogList();

  document.getElementById('log-search').addEventListener('input', renderLogList);
  document.getElementById('log-filter').addEventListener('change', renderLogList);
}

function renderLogList() {
  const search = (document.getElementById('log-search')?.value || '').toLowerCase();
  const filter = document.getElementById('log-filter')?.value || 'semua';
  const container = document.getElementById('log-list');

  let filtered = [...data.logNotif];
  if (search) filtered = filtered.filter(l => l.penerima.toLowerCase().includes(search) || l.id_jadwal.toLowerCase().includes(search));
  if (filter !== 'semua') filtered = filtered.filter(l => l.status === filter);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>Belum ada log notifikasi</p></div>`;
    return;
  }

  container.innerHTML = filtered.slice().reverse().map(l => `
    <div class="log-entry">
      <span class="log-time">${l.waktu_kirim}</span>
      <span class="log-target">
        <strong>${l.id_jadwal}</strong> — ${l.penerima}
        <span style="color:var(--text-muted);font-size:12px;">(${l.jenis})</span>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;max-width:400px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${l.pesan.slice(0, 80)}...</div>
      </span>
      <span class="log-status">
        <span class="badge ${l.status === 'terkirim' ? 'badge-success' : l.status === 'gagal' ? 'badge-error' : 'badge-warning'}">
          ${l.status}
        </span>
        ${l.status === 'gagal' ? '<button class="btn btn-sm btn-secondary" style="margin-top:4px;">🔄 Kirim Ulang</button>' : ''}
      </span>
    </div>
  `).join('');
}

// ====== JAM DIGITAL ======
function updateClock() {
  const now = new Date();
  const wib = now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('app-clock').textContent = `🕒 ${wib} WIB`;
}

// ====== INIT ======
async function init() {
  await loadData();

  // Register global functions for inline onclick
  window.switchTab = switchTab;
  window.changeMonth = changeMonth;
  window.showTambahKontak = showTambahKontak;
  window.editKontak = editKontak;
  window.toggleKontak = toggleKontak;

  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Initial renders
  renderDashboard();
  renderJadwal();
  renderTugas();
  renderKontak();
  renderLog();

  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  console.log('✅ DKM WA Notif Dashboard siap!');
  console.log(`📊 Data: ${data.kontak.length} kontak, ${data.jadwal.length} jadwal, ${data.logNotif.length} log, ${data.tugasMarbot.length} tugas`);
}

document.addEventListener('DOMContentLoaded', init);
