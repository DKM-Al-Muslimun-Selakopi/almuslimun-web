const SHEET_ID = '1mQZypiBnu428YN-SCSAL38R_3C9Xwq_FuqwZ6Fq6oW8';
const SHEET_NAME = 'INPUT MUZAKKI';
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

// Setelah men-deploy Apps Script (lihat folder /apps-script), tempel URL Web App
// (berakhiran /exec) di sini. Bila diisi: data dibaca dari Apps Script yang SUDAH
// menyensor nama di server — Sheet boleh dibuat privat. Bila kosong: fallback ke
// Google Sheet publik (GViz) dengan penyensoran di sisi browser.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwB-J6EYbRqhwkWoeQfaVmHObsxwqWLxbIRPjY-uUQphtmDo3sHW5FpjsMC3gV3JOAswQ/exec';

let allData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const data = APPS_SCRIPT_URL ? await fetchFromAppsScript() : await fetchFromGViz();
        allData = data;
        allData.forEach((item, i) => { item.no = i + 1; });

        updateSummary(allData);
        renderTable(allData);
        renderCharts(allData);
    } catch (error) {
        console.error('Error fetching data:', error);
        showLoadError(error);
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}

// Sumber aman: Apps Script. Nama sudah tersensor di server.
// Memakai fetch() biasa — endpoint mengirim header CORS (allow-origin: *),
// jadi tidak perlu JSONP. Ini lebih tahan terhadap pemblokir & kondisi
// browser yang login ke banyak akun Google.
async function fetchFromAppsScript() {
    const res = await fetch(APPS_SCRIPT_URL, { redirect: 'follow' });
    if (!res.ok) throw new Error('Apps Script menjawab HTTP ' + res.status);

    let json;
    try {
        json = await res.json();
    } catch (e) {
        throw new Error('respons Apps Script bukan JSON (kemungkinan diblokir atau minta login)');
    }
    if (!json.ok) throw new Error(json.error || 'respons Apps Script tidak valid');

    // Buang baris header yang mungkin ikut terbawa dari Sheet.
    return (json.data || []).filter(r =>
        String(r.komplek).trim().toLowerCase() !== 'komplek' &&
        String(r.tanggal).trim().toLowerCase() !== 'tanggal'
    );
}

// Tampilkan error di dalam halaman (bukan popup alert yang memblokir).
function showLoadError(err) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    const pesan = String((err && err.message) || err);
    tbody.innerHTML = `<tr><td colspan="8" style="padding:2rem;text-align:center;line-height:1.7;">
        <strong>Data rekap ZIS belum dapat dimuat.</strong><br>
        <span style="font-size:.85rem;color:#66736C;">Detail: ${pesan}</span><br>
        <span style="font-size:.85rem;color:#66736C;">Coba muat ulang halaman. Bila memakai pemblokir iklan/VPN, nonaktifkan sementara untuk situs ini.</span>
    </td></tr>`;
}

// Fallback: Google Sheet publik (GViz). Nama disensor di sisi browser.
async function fetchFromGViz() {
    const response = await fetch(GVIZ_URL);
    const text = await response.text();
    const jsonStr = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w\W]*)\);/)[1];
    const table = JSON.parse(jsonStr).table;

    return table.rows.map((row) => {
        const c = row.c;
        return {
            tanggal: c[1] ? c[1].f : '-',
            nama: maskName(c[2] ? c[2].v : '-'),
            komplek: c[3] ? c[3].v : '-',
            beras: c[4] ? parseFloat(c[4].v) || 0 : 0,
            uang: c[5] ? parseFloat(c[5].v) || 0 : 0,
            maal: c[6] ? parseFloat(c[6].v) || 0 : 0,
            infaq: c[7] ? parseFloat(c[7].v) || 0 : 0
        };
    }).filter(item => item.nama && item.nama !== '-');
}

// Sensor nama muzakki: tiap kata jadi huruf pertama + bintang.
// Contoh: "Dodi Iriyanto" -> "D*** I*******". Dipakai untuk jalur fallback GViz;
// pada jalur Apps Script, penyensoran sudah dilakukan di server.
function maskName(name) {
    if (!name || name === '-') return name;
    return name.trim().split(/\s+/).map(word =>
        word.length <= 1 ? word : word.charAt(0) + '*'.repeat(word.length - 1)
    ).join(' ');
}

function updateSummary(data) {
    const totals = data.reduce((acc, curr) => {
        acc.beras += curr.beras;
        acc.uang += curr.uang;
        acc.maal += curr.maal;
        acc.infaq += curr.infaq;
        return acc;
    }, { beras: 0, uang: 0, maal: 0, infaq: 0 });

    document.getElementById('total-beras').textContent = `${totals.beras.toLocaleString('id-ID')} kg`;
    document.getElementById('total-uang').textContent = formatCurrency(totals.uang);
    document.getElementById('total-maal').textContent = formatCurrency(totals.maal);
    document.getElementById('total-infaq').textContent = formatCurrency(totals.infaq);
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.no}</td>
            <td>${item.tanggal}</td>
            <td style="font-weight: 600;">${item.nama}</td>
            <td><span class="badge ${getKomplekBadge(item.komplek)}">${item.komplek}</span></td>
            <td>${item.beras > 0 ? `${item.beras} kg` : '-'}</td>
            <td>${item.uang > 0 ? formatCurrency(item.uang) : '-'}</td>
            <td>${item.maal > 0 ? formatCurrency(item.maal) : '-'}</td>
            <td>${item.infaq > 0 ? formatCurrency(item.infaq) : '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderCharts(data) {
    // Chart 1: Distribution by Komplek
    const complexes = [...new Set(data.map(item => item.komplek))];
    const complexData = complexes.map(c => {
        return data.filter(item => item.komplek === c).length;
    });

    const ctx1 = document.getElementById('komplekChart').getContext('2d');
    new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: complexes,
            datasets: [{
                data: complexData,
                backgroundColor: [
                    '#1F4D3B', '#D9A441', '#2F6A52', '#14352A', '#9AA88F', '#B5843B'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            },
            cutout: '70%'
        }
    });

    // Chart 2: Daily Trend (Aggregated by Date)
    const dates = [...new Set(data.map(item => item.tanggal))];
    const dailyTotals = dates.map(d => {
        const dayData = data.filter(item => item.tanggal === d);
        return dayData.reduce((sum, curr) => sum + curr.uang + curr.maal + curr.infaq, 0);
    });

    const ctx2 = document.getElementById('dailyChart').getContext('2d');
    new Chart(ctx2, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Penerimaan Uang (Total)',
                data: dailyTotals,
                borderColor: '#1F4D3B',
                backgroundColor: 'rgba(31, 77, 59, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#1F4D3B'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => 'Rp ' + (value/1000) + 'k'
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(amount);
}

function getKomplekBadge(komplek) {
    const k = komplek.toLowerCase();
    if (k.includes('btn')) return 'badge-blue';
    if (k.includes('kehutanan')) return 'badge-green';
    if (k.includes('jayagiri')) return 'badge-purple';
    return '';
}
