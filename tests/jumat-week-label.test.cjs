const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const html = fs.readFileSync(new URL('../index.html', `file://${__dirname}/`), 'utf8');
const match = html.match(
  /\/\* testable:pilihPekanJumat:start \*\/([\s\S]*?)\/\* testable:pilihPekanJumat:end \*\//
);

assert.ok(match, 'fungsi pilihPekanJumat harus tersedia di index.html');
const pilihPekanJumat = new Function(`${match[1]}; return pilihPekanJumat;`)();

const item = (jumat, kajian) => ({
  jumat: new Date(`${jumat}T00:00:00`),
  kajian: new Date(`${kajian}T00:00:00`)
});

test('menampilkan Jumat Pekan Lalu bila form pekan berjalan belum diisi', () => {
  const result = pilihPekanJumat(
    [item('2026-08-07', '2026-08-09'), item('2026-08-14', '2026-08-16')],
    new Date('2026-08-18T10:00:00')
  );

  assert.equal(result.label, 'Jumat Pekan Lalu');
  assert.equal(result.pekan.jumat.getDate(), 14);
});

test('menampilkan Jumat Pekan Ini bila form pekan berjalan sudah diisi', () => {
  const result = pilihPekanJumat(
    [item('2026-08-14', '2026-08-16'), item('2026-08-21', '2026-08-23')],
    new Date('2026-08-18T10:00:00')
  );

  assert.equal(result.label, 'Jumat Pekan Ini');
  assert.equal(result.pekan.jumat.getDate(), 21);
});
