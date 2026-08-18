const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const html = fs.readFileSync(new URL('../index.html', `file://${__dirname}/`), 'utf8');
const match = html.match(
  /\/\* testable:ringkasanNeraca:start \*\/([\s\S]*?)\/\* testable:ringkasanNeraca:end \*\//
);

assert.ok(match, 'fungsi ringkasan Neraca harus tersedia di index.html');
const fungsi = new Function(`${match[1]}; return { pilihSheetNeracaTerbaru, parseRingkasanNeraca };`)();

test('memilih sheet Neraca dengan bulan terbaru', () => {
  const halamanSheet = `
    items.push({name: "NERACA PENGELUARAN JULI", pageUrl: "?gid=700"});
    items.push({name: "NERACA PENGELUARAN AGUSTUS", pageUrl: "?gid=800"});
    items.push({name: "JADWAL IMAM", pageUrl: "?gid=900"});
  `;

  assert.deepEqual(fungsi.pilihSheetNeracaTerbaru(halamanSheet), {
    nama: 'Agustus',
    gid: '800',
    urutan: 8
  });
});

test('mengambil saldo akhir, pemasukan, dan pengeluaran dari tabel Neraca', () => {
  const cell = value => ({ v: value });
  const table = {
    rows: [
      { c: [null, null, cell('Jumlah Penerimaan Bulan Ini'), cell(12500000)] },
      { c: [null, null, null, null, null, null, cell('Jumlah Pengeluaran Bulan Ini'), cell(7250000)] },
      { c: [null, null, null, null, null, null, cell('Saldo Kas Masjid'), cell(18250000)] }
    ]
  };

  assert.deepEqual(fungsi.parseRingkasanNeraca(table), {
    pemasukan: 12500000,
    pengeluaran: 7250000,
    saldoAkhir: 18250000
  });
});

test('menghitung saldo akhir bila sheet hanya menyediakan saldo awal', () => {
  const cell = value => ({ v: value });
  const table = {
    rows: [
      { c: [null, null, cell('Saldo Bulan Juli'), cell(83894785)] },
      { c: [null, null, cell('Jumlah Penerimaan Bulan Ini'), cell(480000)] },
      { c: [null, null, null, null, null, null, cell('Jumlah Pengeluaran Bulan Ini'), cell(4455650)] }
    ]
  };

  assert.equal(fungsi.parseRingkasanNeraca(table).saldoAkhir, 79919135);
});
