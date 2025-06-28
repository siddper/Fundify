/* summary.js - Summary page for Fundify */
let summaryRange = 'week';
let analyticsDoughnutChart, spendingLineChart, categoryBarChart, cashflowLineChart, methodDoughnutChart, topStoresBarChart, monthlyTrendsLineChart;

// Get start date for range
function getStartDateForRange(range) {
  const now = new Date();
  if (range === 'week') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    return new Date(now.getFullYear(), now.getMonth(), diff);
  } else if (range === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (range === 'year') {
    return new Date(now.getFullYear(), 0, 1);
  }
  return new Date(0);
}

// Filter transactions by range
function filterTransactionsByRange(transactions, range) {
  const start = getStartDateForRange(range);
  return transactions.filter(t => {
    if (!t.date) return false;
    const [mm, dd, yyyy] = t.date.split('/');
    const txDate = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`);
    txDate.setHours(0,0,0,0);
    return txDate >= start;
  });
}

// Set active toggle button
function setActiveToggleBtn(range) {
  document.querySelectorAll('.summary-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.range === range);
  });
}

// Fetch and render summary
async function fetchAndRenderSummary() {
  const totalTxEl = document.getElementById('total-transactions');
  const totalSpentEl = document.getElementById('total-spent');
  const totalDepositedEl = document.getElementById('total-deposited');
  // Always reset to neutral state (no transactions)
  totalTxEl.textContent = '--';
  totalSpentEl.textContent = '--';
  totalDepositedEl.textContent = '--';

  // Get user email
  const email = localStorage.getItem('fundify_user_email');
  if (!email) {
    totalTxEl.textContent = 'Login required';
    totalSpentEl.textContent = '--';
    totalDepositedEl.textContent = '--';
    return;
  }

  // Fetch transactions
  try {
    const res = await fetch(`http://127.0.0.1:8000/transactions?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (!data.success) {
      console.error('[Summary] Backend error:', data);
      totalTxEl.textContent = 'Error';
      totalSpentEl.textContent = '--';
      totalDepositedEl.textContent = '--';
      return;
    }
    // Filter transactions by range
    let transactions = data.transactions;
    transactions = filterTransactionsByRange(transactions, summaryRange);
    
    // If no transactions, render empty charts
    if (transactions.length === 0) {
      totalTxEl.textContent = '0';
      totalSpentEl.textContent = '$0.00';
      totalDepositedEl.textContent = '$0.00';
      // Render empty charts
      const emptyDoughnut = (ctx) => new Chart(ctx, {
        type: 'doughnut',
        data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
        options: { plugins: { legend: { display: false } }, cutout: '70%', responsive: false }
      });
      const emptyLine = (ctx) => new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ data: [] }] },
        options: { plugins: { legend: { display: false } }, responsive: true }
      });
      const emptyBar = (ctx) => new Chart(ctx, {
        type: 'bar',
        data: { labels: [], datasets: [{ data: [] }] },
        options: { plugins: { legend: { display: false } }, responsive: true }
      });
      emptyDoughnut(document.getElementById('analytics-doughnut').getContext('2d'));
      emptyLine(document.getElementById('spending-line-chart').getContext('2d'));
      emptyBar(document.getElementById('category-bar-chart').getContext('2d'));
      emptyLine(document.getElementById('cashflow-line-chart').getContext('2d'));
      emptyDoughnut(document.getElementById('method-doughnut-chart').getContext('2d'));
      emptyBar(document.getElementById('top-stores-bar-chart').getContext('2d'));
      emptyLine(document.getElementById('monthly-trends-line-chart').getContext('2d'));
      return;
    }

    // Calculate summary stats (total transactions, total spent, total deposited)
    const totalTransactions = transactions.length;
    const totalSpent = transactions.filter(t => t.type === 'Withdrawal').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalDeposited = transactions.filter(t => t.type === 'Deposit').reduce((sum, t) => sum + parseFloat(t.amount), 0);

    totalTxEl.textContent = totalTransactions;
    totalSpentEl.textContent = `$${totalSpent.toFixed(2)}`;
    totalDepositedEl.textContent = `$${totalDeposited.toFixed(2)}`;

    // Doughnut chart: Spending vs Deposits (analytics-doughnut)
    const doughnutCtx = document.getElementById('analytics-doughnut').getContext('2d');
    if (analyticsDoughnutChart) analyticsDoughnutChart.destroy();
    analyticsDoughnutChart = new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Spent', 'Deposited'],
        datasets: [{
          data: [totalSpent, totalDeposited],
          backgroundColor: ['#235FD6', '#22c55e'],
          borderWidth: 0,
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        cutout: '70%',
        responsive: false,
      }
    });

    // Line chart: Spending over time (spending-line-chart)
    // Group by date
    const dateMap = {};
    transactions.forEach(t => {
      if (!dateMap[t.date]) dateMap[t.date] = 0;
      if (t.type === 'Withdrawal') dateMap[t.date] += parseFloat(t.amount);
    });
    const dates = Object.keys(dateMap).sort();
    const spentByDate = dates.map(date => dateMap[date]);
    const lineCtx = document.getElementById('spending-line-chart').getContext('2d');
    if (spendingLineChart) spendingLineChart.destroy();
    spendingLineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Spent',
          data: spentByDate,
          borderColor: '#235FD6',
          backgroundColor: 'rgba(35,95,214,0.15)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#235FD6',
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: '#bfc6e0' },
            grid: { color: '#23262a' }
          },
          y: {
            ticks: { color: '#bfc6e0' },
            grid: { color: '#23262a' }
          }
        },
        responsive: true,
      }
    });

    // Bar chart: Category breakdown (use store as fallback if no category) (category-bar-chart)
    const categoryMap = {};
    transactions.forEach(t => {
      const cat = t.category || t.store || 'Other';
      if (!categoryMap[cat]) categoryMap[cat] = 0;
      if (t.type === 'Withdrawal') categoryMap[cat] += parseFloat(t.amount);
    });
    const categories = Object.keys(categoryMap);
    const spentByCategory = categories.map(cat => categoryMap[cat]);
    const barCtx = document.getElementById('category-bar-chart').getContext('2d');
    if (categoryBarChart) categoryBarChart.destroy();
    categoryBarChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Spent',
          data: spentByCategory,
          backgroundColor: '#235FD6',
          borderRadius: 4,
          barThickness: 28,
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: '#bfc6e0' },
            grid: { color: '#23262a' }
          },
          y: {
            ticks: { color: '#bfc6e0' },
            grid: { color: '#23262a' }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
      }
    });

    // Cash Flow Over Time (dual line: deposits and withdrawals) (cashflow-line-chart)
    const cashflowDateMap = {};
    transactions.forEach(t => {
      if (!cashflowDateMap[t.date]) cashflowDateMap[t.date] = { deposit: 0, withdrawal: 0 };
      if (t.type === 'Deposit') cashflowDateMap[t.date].deposit += parseFloat(t.amount);
      if (t.type === 'Withdrawal') cashflowDateMap[t.date].withdrawal += parseFloat(t.amount);
    });
    const cashflowDates = Object.keys(cashflowDateMap).sort();
    const depositsByDate = cashflowDates.map(date => cashflowDateMap[date].deposit);
    const withdrawalsByDate = cashflowDates.map(date => cashflowDateMap[date].withdrawal);
    const cashflowCtx = document.getElementById('cashflow-line-chart').getContext('2d');
    if (cashflowLineChart) cashflowLineChart.destroy();
    cashflowLineChart = new Chart(cashflowCtx, {
      type: 'line',
      data: {
        labels: cashflowDates,
        datasets: [
          {
            label: 'Deposits',
            data: depositsByDate,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.15)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#22c55e',
          },
          {
            label: 'Withdrawals',
            data: withdrawalsByDate,
            borderColor: '#235FD6',
            backgroundColor: 'rgba(35,95,214,0.15)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#235FD6',
          }
        ]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#bfc6e0' } },
        },
        scales: {
          x: { ticks: { color: '#bfc6e0' }, grid: { color: '#23262a' } },
          y: { ticks: { color: '#bfc6e0' }, grid: { color: '#23262a' } }
        },
        responsive: true,
      }
    });

    // Spending by Method (doughnut) (method-doughnut-chart)
    const methodMap = { Credit: 0, Debit: 0, Cash: 0, Check: 0 };
    transactions.forEach(t => {
      if (t.type === 'Withdrawal') {
        const method = t.method in methodMap ? t.method : 'Credit';
        methodMap[method] += parseFloat(t.amount);
      }
    });
    const methodLabels = Object.keys(methodMap);
    const methodData = methodLabels.map(m => methodMap[m]);
    const methodColors = ['#235FD6', '#22c55e', '#fbbf24', '#f472b6'];
    const methodCtx = document.getElementById('method-doughnut-chart').getContext('2d');
    if (methodDoughnutChart) methodDoughnutChart.destroy();
    methodDoughnutChart = new Chart(methodCtx, {
      type: 'doughnut',
      data: {
        labels: methodLabels,
        datasets: [{
          data: methodData,
          backgroundColor: methodColors,
          borderWidth: 0,
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#bfc6e0' } },
        },
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: true,
      }
    });

    // Top Stores (horizontal bar) (top-stores-bar-chart)
    const storeMap = {};
    transactions.forEach(t => {
      if (t.type === 'Withdrawal') {
        const store = t.store || 'Other';
        if (!storeMap[store]) storeMap[store] = 0;
        storeMap[store] += parseFloat(t.amount);
      }
    });
    const topStores = Object.entries(storeMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topStoreLabels = topStores.map(([store]) => store);
    const topStoreData = topStores.map(([, amt]) => amt);
    const topStoresCtx = document.getElementById('top-stores-bar-chart').getContext('2d');
    if (topStoresBarChart) topStoresBarChart.destroy();
    topStoresBarChart = new Chart(topStoresCtx, {
      type: 'bar',
      data: {
        labels: topStoreLabels,
        datasets: [{
          label: 'Spent',
          data: topStoreData,
          backgroundColor: '#235FD6',
          borderRadius: 4,
          barThickness: 32,
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { ticks: { color: '#bfc6e0' }, grid: { color: '#23262a' } },
          y: { ticks: { color: '#bfc6e0' }, grid: { color: '#23262a' } }
        },
        responsive: true,
        maintainAspectRatio: true,
      }
    });

    // Weekly Trends (dual line: deposits and withdrawals per week) (weekly-trends-line-chart)
    const weekMap = {};
    transactions.forEach(t => {
      if (!t.date) return;
      const [mm, dd, yyyy] = t.date.split('/');
      const txDate = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`);
      // Get Monday of the week
      const day = txDate.getDay();
      const monday = new Date(txDate);
      monday.setDate(txDate.getDate() - ((day + 6) % 7));
      const weekKey = `${monday.getFullYear()}-${(monday.getMonth()+1).toString().padStart(2,'0')}-${monday.getDate().toString().padStart(2,'0')}`;
      if (!weekMap[weekKey]) weekMap[weekKey] = { deposit: 0, withdrawal: 0 };
      if (t.type === 'Deposit') weekMap[weekKey].deposit += parseFloat(t.amount);
      if (t.type === 'Withdrawal') weekMap[weekKey].withdrawal += parseFloat(t.amount);
    });
    const weekKeys = Object.keys(weekMap).sort();
    const depositsByWeek = weekKeys.map(k => weekMap[k].deposit);
    const withdrawalsByWeek = weekKeys.map(k => weekMap[k].withdrawal);
    const weeklyTrendsCtx = document.getElementById('weekly-trends-line-chart').getContext('2d');
    if (window.weeklyTrendsLineChart) window.weeklyTrendsLineChart.destroy();
    window.weeklyTrendsLineChart = new Chart(weeklyTrendsCtx, {
      type: 'line',
      data: {
        labels: weekKeys,
        datasets: [
          {
            label: 'Deposits',
            data: depositsByWeek,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.15)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#22c55e',
          },
          {
            label: 'Withdrawals',
            data: withdrawalsByWeek,
            borderColor: '#235FD6',
            backgroundColor: 'rgba(35,95,214,0.15)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#235FD6',
          }
        ]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#bfc6e0' } },
        },
        scales: {
          x: { ticks: { color: '#bfc6e0' }, grid: { color: '#23262a' } },
          y: { ticks: { color: '#bfc6e0' }, grid: { color: '#23262a' } }
        },
        responsive: true,
        maintainAspectRatio: true,
      }
    });

    // --- Summary Statistics --- (summary-stats)
    function calcStats(arr) {
      if (!arr.length) return { mean: '--', median: '--', min: '--', max: '--', std: '--' };
      const sorted = [...arr].sort((a, b) => a - b);
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      const median = arr.length % 2 === 0 ? (sorted[arr.length/2-1] + sorted[arr.length/2]) / 2 : sorted[Math.floor(arr.length/2)];
      const min = sorted[0];
      const max = sorted[sorted.length-1];
      const std = Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);
      return { mean, median, min, max, std };
    }
    const withdrawals = transactions.filter(t => t.type === 'Withdrawal').map(t => parseFloat(t.amount));
    const deposits = transactions.filter(t => t.type === 'Deposit').map(t => parseFloat(t.amount));
    const wStats = calcStats(withdrawals);
    const dStats = calcStats(deposits);
    function fmt(val) { return typeof val === 'number' ? `$${val.toFixed(2)}` : val; }
    document.getElementById('withdrawal-mean').textContent = fmt(wStats.mean);
    document.getElementById('withdrawal-median').textContent = fmt(wStats.median);
    document.getElementById('withdrawal-min').textContent = fmt(wStats.min);
    document.getElementById('withdrawal-max').textContent = fmt(wStats.max);
    document.getElementById('withdrawal-std').textContent = fmt(wStats.std);
    document.getElementById('deposit-mean').textContent = fmt(dStats.mean);
    document.getElementById('deposit-median').textContent = fmt(dStats.median);
    document.getElementById('deposit-min').textContent = fmt(dStats.min);
    document.getElementById('deposit-max').textContent = fmt(dStats.max);
    document.getElementById('deposit-std').textContent = fmt(dStats.std);
  } catch (err) {
    console.error('[Summary] Fetch or JSON error:', err);
    totalTxEl.textContent = 'Error';
    totalSpentEl.textContent = '--';
    totalDepositedEl.textContent = '--';
  }
}

// Add event listeners for toggle buttons (summary-toggle-btn)
function setupSummaryToggle() {
  document.querySelectorAll('.summary-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      summaryRange = btn.dataset.range;
      setActiveToggleBtn(summaryRange);
      fetchAndRenderSummary();
    });
  });
}

setupSummaryToggle();

fetchAndRenderSummary();

// Simulate a click on the month button, then the week button, to force correct chart sizing (summary-toggle-btn)
window.addEventListener('DOMContentLoaded', () => {
  const monthBtn = document.querySelector('.summary-toggle-btn[data-range="month"]');
  const weekBtn = document.querySelector('.summary-toggle-btn[data-range="week"]');
  if (monthBtn && weekBtn) {
    monthBtn.click();
    setTimeout(() => {
      weekBtn.click();
    }, 50); // Small delay to allow chart to update
  }
});

// --- Export as Image/Email --- (export-image-btn, export-email-btn)
function loadHtml2Canvas(cb) {
  if (window.html2canvas) return cb();
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
  script.onload = cb;
  document.body.appendChild(script);
}
function showExportStatus(msg, type) {
  const el = document.getElementById('export-status-message');
  el.textContent = msg;
  el.className = 'export-status-message ' + (type || '');
  if (msg) setTimeout(() => { el.textContent = ''; el.className = 'export-status-message'; }, 5000);
}
function exportSummaryAsImage(openInNewTab = true, sendToEmail = false) {
  showExportStatus('', '');
  loadHtml2Canvas(() => {
    // Screenshot only the widgets area
    const content = document.getElementById('summary-main-content');
    if (!content) return showExportStatus('Summary content not found.', 'error');
    window.html2canvas(content, {backgroundColor: '#18191a'}).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      if (openInNewTab) {
        const win = window.open();
        win.document.write('<iframe src="' + imgData + '" frameborder="0" style="width:100vw;height:100vh;"></iframe>');
      } else if (sendToEmail) {
        const email = localStorage.getItem('fundify_user_email');
        if (!email) return showExportStatus('User email not found. Please log in.', 'error');
        fetch('http://127.0.0.1:8000/export-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, image: imgData })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) showExportStatus('Summary sent to your email!', 'success');
          else showExportStatus('Failed to send email: ' + (data.error || 'Unknown error'), 'error');
        })
        .catch(err => showExportStatus('Failed to send email: ' + err, 'error'));
      }
    });
  });
}

// Add event listeners for export buttons (export-image-btn, export-email-btn)
document.getElementById('export-image-btn').addEventListener('click', () => exportSummaryAsImage(true, false));
document.getElementById('export-email-btn').addEventListener('click', () => exportSummaryAsImage(false, true));
