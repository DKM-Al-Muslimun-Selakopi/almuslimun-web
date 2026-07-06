const SHEET_ID = '1K-jZr5HYtYLJ-QCcEVFTb3R9TSumR352aAIdq_eFzJo';

// Month name mapping for display + sorting
const MONTH_MAP = {
    'JAN': { name: 'Januari',  order: 1 },
    'FEB': { name: 'Februari', order: 2 },
    'MAR': { name: 'Maret',    order: 3 },
    'APR': { name: 'April',    order: 4 },
    'MEI': { name: 'Mei',      order: 5 },
    'JUN': { name: 'Juni',     order: 6 },
    'JUL': { name: 'Juli',     order: 7 },
    'AGT': { name: 'Agustus',  order: 8 },
    'AUG': { name: 'Agustus',  order: 8 },
    'SEP': { name: 'September',order: 9 },
    'OKT': { name: 'Oktober',  order: 10 },
    'OCT': { name: 'Oktober',  order: 10 },
    'NOV': { name: 'November', order: 11 },
    'DES': { name: 'Desember', order: 12 },
    'DEC': { name: 'Desember', order: 12 },
    // Full month names too
    'JANUARI': { name: 'Januari',  order: 1 },
    'FEBRUARI':{ name: 'Februari', order: 2 },
    'MARET':   { name: 'Maret',    order: 3 },
    'APRIL':   { name: 'April',    order: 4 },
    'JUNI':    { name: 'Juni',     order: 6 },
    'JULI':    { name: 'Juli',     order: 7 },
    'AGUSTUS': { name: 'Agustus',  order: 8 },
    'SEPTEMBER':{name: 'September',order: 9 },
    'OKTOBER': { name: 'Oktober',  order: 10 },
    'NOVEMBER':{ name: 'November', order: 11 },
    'DESEMBER':{ name: 'Desember', order: 12 },
};

let allMonths = [];       // Dynamic: {name, short, gid, order}
let allMonthsData = {};   // Data per month
let activeMonth = 0;
let trendChart = null;
let saldoChart = null;

document.addEventListener('DOMContentLoaded', () => {
    init();
    setupSearch();
});

async function init() {
    try {
        // Step 1: Auto-discover all NERACA sheets
        allMonths = await discoverSheets();

        // Step 2: Fetch data for each discovered sheet
        const promises = allMonths.map(m => fetchMonthData(m));
        await Promise.all(promises);

        // Step 3: Render everything
        if (allMonths.length > 0) {
            activeMonth = allMonths.length - 1; // Default: latest month
            renderMonthTabs();
            renderMonth(activeMonth);
            renderTrendCharts();
        }

        document.getElementById('lastUpdate').textContent =
            'Update: ' + new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
    } catch (error) {
        console.error('Error initializing:', error);
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}

/**
 * Auto-discover all NERACA sheets from the spreadsheet.
 * Fetches the htmlview page and parses sheet tab names + gids.
 * Filters for sheets containing "PENGELUARAN" (these have both income & expenses).
 * Sorts by month order.
 *
 * When a new month is added to the spreadsheet, it will be automatically
 * detected here — no code changes needed.
 */
async function discoverSheets() {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/htmlview`;
    const response = await fetch(url);
    const html = await response.text();

    // Pattern: items.push({name: "SHEET NAME", pageUrl: "...gid=GID"
    // Names use \x27 for apostrophe
    const regex = /items\.push\(\{name:\s*"([^"]+)",\s*pageUrl:\s*"[^"]*gid=(\d+)"/g;
    let m;
    const sheets = [];
    while ((m = regex.exec(html)) !== null) {
        const name = m[1].replace(/\\x27/g, "'");
        sheets.push({ name, gid: m[2] });
    }

    // Filter for NERACA sheets (PENGELUARAN = has both income & expenses)
    const neracaSheets = sheets.filter(s => s.name.toUpperCase().includes('PENGELUARAN'));

    // Parse month from sheet name and map to display name + sort order
    const months = neracaSheets.map(sheet => {
        const upperName = sheet.name.toUpperCase();
        // Try to find which month this sheet represents
        let monthInfo = null;
        let shortLabel = '';
        for (const [key, info] of Object.entries(MONTH_MAP)) {
            if (upperName.includes(key)) {
                monthInfo = info;
                shortLabel = key.slice(0, 3);
                break;
            }
        }
        // Fallback: use sheet name as label if no match
        if (!monthInfo) {
            return {
                name: sheet.name,
                short: sheet.name.substring(0, 6),
                gid: sheet.gid,
                order: 99
            };
        }
        return {
            name: monthInfo.name,
            short: shortLabel,
            gid: sheet.gid,
            order: monthInfo.order
        };
    });

    // Sort by month order (Jan → Dec)
    months.sort((a, b) => a.order - b.order);

    return months;
}

async function fetchMonthData(month) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${month.gid}`;
    try {
        const response = await fetch(url);
        const text = await response.text();
        const jsonStr = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w\W]*)\);/)[1];
        const data = JSON.parse(jsonStr);
        allMonthsData[month.short] = parseSheetData(data.table, month);
    } catch (e) {
        console.error(`Failed to fetch ${month.name}:`, e);
        allMonthsData[month.short] = {
            penerimaan: [], pengeluaran: [],
            saldoAwal: 0, totalMasuk: 0, totalKeluar: 0,
            saldoAkhir: 0, rekening: 0, cash: 0
        };
    }
}

function parseSheetData(table, month) {
    const rows = table.rows;
    const penerimaan = [];
    const pengeluaran = [];

    let saldoAwal = 0, totalMasuk = 0, totalKeluar = 0;
    let saldoAkhir = 0, rekening = 0, cash = 0;

    rows.forEach(row => {
        const cells = row.c;
        if (!cells) return;

        // Left side: Penerimaan (cols 0-3)
        const noMasuk = cells[0] ? cells[0].v : null;
        const tglMasuk = cells[1] ? (cells[1].f || cells[1].v) : '';
        const uraianMasuk = cells[2] ? cells[2].v : '';
        const jmlMasuk = cells[3] ? parseAmount(cells[3].v) : 0;

        // Right side: Pengeluaran (cols 4-7)
        const noKeluar = cells[4] ? cells[4].v : null;
        const tglKeluar = cells[5] ? (cells[5].f || cells[5].v) : '';
        const uraianKeluar = cells[6] ? cells[6].v : '';
        const jmlKeluar = cells[7] ? parseAmount(cells[7].v) : 0;

        const uraianMasukStr = uraianMasuk ? uraianMasuk.toString() : '';
        const uraianKeluarStr = uraianKeluar ? uraianKeluar.toString() : '';
        const uraianKeluarLower = uraianKeluarStr.toLowerCase();

        // Parse saldo awal
        if (uraianMasukStr.toLowerCase().includes('saldo bulan')) {
            saldoAwal = jmlMasuk;
        }

        // Parse summary rows
        if (uraianMasukStr.toLowerCase().includes('jumlah penerimaan bulan ini')) {
            totalMasuk = jmlMasuk;
        }
        if (uraianKeluarStr.toLowerCase().includes('jumlah pengeluaran bulan ini')) {
            totalKeluar = jmlKeluar;
        }

        // Parse saldo akhir
        if (uraianKeluarLower.includes('saldo kas masjid')) {
            saldoAkhir = jmlKeluar;
        }

        // Parse rekening/cash
        if (uraianKeluarLower.includes('rekening bsi')) {
            rekening = jmlKeluar;
        }
        if (uraianKeluarLower === 'cash' || uraianKeluarLower.trim() === 'cash') {
            cash = jmlKeluar;
        }

        // Regular penerimaan entries
        if (noMasuk && uraianMasukStr && !isSummaryRow(uraianMasukStr) && jmlMasuk >= 0) {
            if (!uraianMasukStr.toLowerCase().includes('saldo bulan')) {
                penerimaan.push({ no: noMasuk, tanggal: tglMasuk, uraian: uraianMasukStr, jumlah: jmlMasuk });
            }
        }

        // Regular pengeluaran entries
        if (noKeluar && uraianKeluarStr && !isSummaryRow(uraianKeluarStr) && jmlKeluar > 0) {
            pengeluaran.push({ no: noKeluar, tanggal: tglKeluar, uraian: uraianKeluarStr, jumlah: jmlKeluar });
        }
    });

    // Fallback: calculate totals if not found
    if (totalMasuk === 0 && penerimaan.length > 0) {
        totalMasuk = penerimaan.reduce((s, r) => s + r.jumlah, 0);
    }
    if (totalKeluar === 0 && pengeluaran.length > 0) {
        totalKeluar = pengeluaran.reduce((s, r) => s + r.jumlah, 0);
    }
    if (saldoAkhir === 0) {
        saldoAkhir = saldoAwal + totalMasuk - totalKeluar;
    }

    return { penerimaan, pengeluaran, saldoAwal, totalMasuk, totalKeluar, saldoAkhir, rekening, cash };
}

function isSummaryRow(text) {
    const t = text.toLowerCase();
    return t.includes('jumlah penerimaan') ||
           t.includes('jumlah pengeluaran') ||
           t.includes('jumlah total') ||
           t.includes('saldo kas') ||
           t.includes('rekening bsi') ||
           t === 'cash' ||
           t === 'total';
}

function parseAmount(v) {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return v;
    if (v === '-') return 0;
    const cleaned = v.toString().replace(/[^0-9.\-]/g, '');
    return parseFloat(cleaned) || 0;
}

function renderMonthTabs() {
    const container = document.getElementById('monthTabs');
    container.innerHTML = '';
    allMonths.forEach((m, i) => {
        const tab = document.createElement('button');
        tab.className = 'month-tab' + (i === activeMonth ? ' active' : '');
        tab.textContent = m.name;
        tab.addEventListener('click', () => {
            activeMonth = i;
            renderMonthTabs();
            renderMonth(activeMonth);
        });
        container.appendChild(tab);
    });
}

function renderMonth(index) {
    const month = allMonths[index];
    if (!month) return;
    const data = allMonthsData[month.short];
    if (!data) return;

    document.getElementById('saldo-awal').textContent = formatCurrency(data.saldoAwal);
    document.getElementById('saldo-awal-label').textContent = `Saldo ${month.name} 2026`;
    document.getElementById('total-masuk').textContent = formatCurrency(data.totalMasuk);
    document.getElementById('total-keluar').textContent = formatCurrency(data.totalKeluar);
    document.getElementById('saldo-akhir').textContent = formatCurrency(data.saldoAkhir);
    document.getElementById('saldo-akhir-label').textContent = `Saldo akhir ${month.name} 2026`;

    document.getElementById('dana-rekening').textContent = formatCurrency(data.rekening);
    document.getElementById('dana-cash').textContent = formatCurrency(data.cash);
    document.getElementById('dana-total').textContent = formatCurrency(data.rekening + data.cash);

    renderTable('tableMasuk', data.penerimaan, 'totalMasukRow');
    renderTable('tableKeluar', data.pengeluaran, 'totalKeluarRow');
}

function renderTable(tbodyId, items, totalId) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.no}</td>
            <td>${item.tanggal || '-'}</td>
            <td>${item.uraian}</td>
            <td class="text-right amount-pos">${formatCurrency(item.jumlah)}</td>
        `;
        tbody.appendChild(row);
    });

    if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:2rem;">Tidak ada data</td></tr>`;
    }

    const total = items.reduce((s, r) => s + r.jumlah, 0);
    document.getElementById(totalId).textContent = formatCurrency(total);
}

function renderTrendCharts() {
    const labels = allMonths.map(m => m.short);
    const masukData = allMonths.map(m => allMonthsData[m.short]?.totalMasuk || 0);
    const keluarData = allMonths.map(m => allMonthsData[m.short]?.totalKeluar || 0);
    const saldoData = allMonths.map(m => allMonthsData[m.short]?.saldoAkhir || 0);

    // Chart 1: Bar chart - Pemasukan vs Pengeluaran
    const ctx1 = document.getElementById('trendChart').getContext('2d');
    if (trendChart) trendChart.destroy();
    trendChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Pemasukan', data: masukData, backgroundColor: 'rgba(46, 125, 79, 0.75)', borderColor: '#2E7D4F', borderWidth: 1, borderRadius: 6 },
                { label: 'Pengeluaran', data: keluarData, backgroundColor: 'rgba(192, 73, 47, 0.75)', borderColor: '#C0492F', borderWidth: 1, borderRadius: 6 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: (ctx) => ctx.dataset.label + ': ' + formatCurrency(ctx.parsed.y) } }
            },
            scales: {
                y: { beginAtZero: true, ticks: { callback: (v) => 'Rp ' + (v / 1000000).toFixed(1) + ' jt' } }
            }
        }
    });

    // Chart 2: Line chart - Saldo trend
    const ctx2 = document.getElementById('saldoChart').getContext('2d');
    if (saldoChart) saldoChart.destroy();
    saldoChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Saldo Kas', data: saldoData,
                borderColor: '#1F4D3B', backgroundColor: 'rgba(31, 77, 59, 0.1)',
                fill: true, tension: 0.4, pointRadius: 5,
                pointBackgroundColor: '#1F4D3B', pointBorderColor: '#fff', pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => 'Saldo: ' + formatCurrency(ctx.parsed.y) } }
            },
            scales: {
                y: { ticks: { callback: (v) => 'Rp ' + (v / 1000000).toFixed(0) + ' jt' } }
            }
        }
    });
}

function setupSearch() {
    document.getElementById('searchMasuk').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const month = allMonths[activeMonth];
        if (!month) return;
        const data = allMonthsData[month.short];
        if (!data) return;
        const filtered = data.penerimaan.filter(r =>
            r.uraian.toLowerCase().includes(term) ||
            (r.tanggal || '').toString().toLowerCase().includes(term)
        );
        renderTable('tableMasuk', filtered, 'totalMasukRow');
    });

    document.getElementById('searchKeluar').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const month = allMonths[activeMonth];
        if (!month) return;
        const data = allMonthsData[month.short];
        if (!data) return;
        const filtered = data.pengeluaran.filter(r =>
            r.uraian.toLowerCase().includes(term) ||
            (r.tanggal || '').toString().toLowerCase().includes(term)
        );
        renderTable('tableKeluar', filtered, 'totalKeluarRow');
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(amount || 0);
}
