const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const templates = require('../notif/cron/templates.js');
const rawatib = require('../notif/cron/rawatib.js');

const homepage = fs.readFileSync(new URL('../index.html', `file://${__dirname}/`), 'utf8');
const homepageMatch = homepage.match(
  /\/\* testable:formatTanggalHari:start \*\/([\s\S]*?)\/\* testable:formatTanggalHari:end \*\//
);

test('tanggal Ahad di beranda tidak ditampilkan sebagai Minggu', () => {
  assert.ok(homepageMatch, 'fungsi formatTanggalHari harus tersedia di index.html');
  const formatTanggalHari = new Function(`${homepageMatch[1]}; return formatTanggalHari;`)();

  assert.equal(formatTanggalHari(new Date('2026-08-23T00:00:00+07:00')), 'Ahad, 23 Agustus 2026');
});

test('template notifikasi memakai nama hari Ahad', () => {
  assert.equal(templates.formatDate('2026-08-23').hari, 'Ahad');
});

test('jadwal rawatib hari Ahad membawa label Ahad', () => {
  const jadwal = rawatib.getJadwalHariIni(new Date('2026-08-23T00:00:00+07:00'));

  assert.ok(jadwal.length > 0);
  assert.ok(jadwal.every(item => item.hari === 'Ahad'));
});
