const SHEET_ID = '1mQZypiBnu428YN-SCSAL38R_3C9Xwq_FuqwZ6Fq6oW8';
const SHEET_NAME = 'INPUT MUZAKKI';
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

let allData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    setupSearch();
});

async function fetchData() {
    try {
        const response = await fetch(GVIZ_URL);
        const text = await response.text();
        
        // Extract JSON from Google's response wrapper
        const jsonStr = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w\W]*)\);/)[1];
        const data = JSON.parse(jsonStr);
        
        processData(data.table);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Gagal mengambil data dari Google Sheets. Pastikan spreadsheet publik.');
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}

function processData(table) {
    const rows = table.rows;
    allData = rows.map((row, index) => {
        const cells = row.c;
        return {
            no: index + 1,
            tanggal: cells[1] ? cells[1].f : '-',
            nama: cells[2] ? cells[2].v : '-',
            komplek: cells[3] ? cells[3].v : '-',
            beras: cells[4] ? parseFloat(cells[4].v) || 0 : 0,
            uang: cells[5] ? parseFloat(cells[5].v) || 0 : 0,
            maal: cells[6] ? parseFloat(cells[6].v) || 0 : 0,
            infaq: cells[7] ? parseFloat(cells[7].v) || 0 : 0
        };
    }).filter(item => item.nama !== '-'); // Filter out empty rows

    updateSummary(allData);
    renderTable(allData);
    renderCharts(allData);
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
            <td style="font-weight: 600;">${maskName(item.nama)}</td>
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

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allData.filter(item => 
            item.nama.toLowerCase().includes(term) || 
            item.komplek.toLowerCase().includes(term)
        );
        renderTable(filtered);
    });
}

// Sensor nama muzakki demi privasi: tiap kata jadi huruf pertama + bintang.
// Contoh: "Dodi Iriyanto" -> "D*** I*******". Pencarian tetap memakai nama asli.
function maskName(name) {
    if (!name || name === '-') return name;
    return name.trim().split(/\s+/).map(word =>
        word.length <= 1 ? word : word.charAt(0) + '*'.repeat(word.length - 1)
    ).join(' ');
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
