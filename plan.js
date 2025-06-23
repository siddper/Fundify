// --- Budget Widget Logic ---
let planTransactions = [];

function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

function getBudget() {
  const { month, year } = getCurrentMonthYear();
  const key = `fundify_budget_${month}_${year}`;
  const val = localStorage.getItem(key);
  return val ? parseFloat(val) : 0;
}

function setBudget(amount) {
  const { month, year } = getCurrentMonthYear();
  const key = `fundify_budget_${month}_${year}`;
  localStorage.setItem(key, amount);
}

function getSpentThisMonth() {
  const { month, year } = getCurrentMonthYear();
  return planTransactions
    .filter(tx => {
      if (tx.type !== 'Withdrawal') return false;
      const [mm, dd, yyyy] = tx.date.split('/');
      return parseInt(mm) === month && parseInt(yyyy) === year;
    })
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
}

function updateBudgetUI() {
  const spent = getSpentThisMonth();
  const budget = getBudget();
  const remaining = Math.max(0, budget - spent);
  const percent = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;

  // Debug output
  console.log('planTransactions:', planTransactions);
  console.log('spent:', spent, 'budget:', budget, 'percent:', percent);

  // document.getElementById('budget-spent').textContent = `Spent: $${spent.toFixed(2)}`;
  // document.getElementById('budget-remaining').textContent = `Remaining: $${remaining.toFixed(2)}`;
  // document.getElementById('budget-total').textContent = `Budget: $${budget.toFixed(2)}`;
  document.getElementById('budget-progress-bar').style.width = percent + '%';

  // Optionally color the bar
  const bar = document.getElementById('budget-progress-bar');
  bar.style.background = percent < 80 ? 'var(--accent)' : percent < 100 ? '#ffc107' : '#ff4d4f';

  // Update tooltip
  const tooltip = document.getElementById('budget-tooltip');
  if (tooltip) {
    tooltip.textContent = `Spent: $${spent.toFixed(2)} | Remaining: $${remaining.toFixed(2)}`;
  }
}

// --- Goal Widget Logic ---
function getGoal() {
  const { month, year } = getCurrentMonthYear();
  const key = `fundify_goal_${month}_${year}`;
  const val = localStorage.getItem(key);
  return val ? parseFloat(val) : 0;
}

function setGoal(amount) {
  const { month, year } = getCurrentMonthYear();
  const key = `fundify_goal_${month}_${year}`;
  localStorage.setItem(key, amount);
}

function getMadeThisMonth() {
  const { month, year } = getCurrentMonthYear();
  return planTransactions
    .filter(tx => {
      if (tx.type !== 'Deposit') return false;
      const [mm, dd, yyyy] = tx.date.split('/');
      return parseInt(mm) === month && parseInt(yyyy) === year;
    })
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
}

function updateGoalUI() {
  const made = getMadeThisMonth();
  const goal = getGoal();
  const remaining = Math.max(0, goal - made);
  const percent = goal > 0 ? Math.min(100, (made / goal) * 100) : 0;

  // Debug output
  // console.log('planTransactions:', planTransactions);
  // console.log('made:', made, 'goal:', goal, 'percent:', percent);

  document.getElementById('goal-progress-bar').style.width = percent + '%';
  // Optionally color the bar
  const bar = document.getElementById('goal-progress-bar');
  bar.style.background = percent < 80 ? '#4caf50' : percent < 100 ? '#ffc107' : '#235FD6';

  // Update tooltip
  const tooltip = document.getElementById('goal-tooltip');
  if (tooltip) {
    tooltip.textContent = `Made: $${made.toFixed(2)} | Remaining: $${remaining.toFixed(2)}`;
  }
}

// --- DOMContentLoaded additions for goal widget ---
document.addEventListener('DOMContentLoaded', () => {
  // Set initial goal input value
  document.getElementById('goal-input').value = getGoal() || '';

  // Goal form submit
  document.getElementById('goal-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const val = parseFloat(document.getElementById('goal-input').value);
    if (!isNaN(val) && val >= 0) {
      setGoal(val);
      updateAllPlanWidgets();
    }
  });

  // Tooltip hover logic for goal
  const goalBarBg = document.querySelector('.goal-progress-bar-bg');
  const goalTooltip = document.getElementById('goal-tooltip');
  if (goalBarBg && goalTooltip) {
    goalBarBg.addEventListener('mouseenter', () => {
      goalTooltip.style.opacity = '1';
      goalTooltip.style.pointerEvents = 'auto';
      goalTooltip.style.transform = 'translateX(-50%) translateY(-8px) scale(1)';
    });
    goalBarBg.addEventListener('mouseleave', () => {
      goalTooltip.style.opacity = '';
      goalTooltip.style.pointerEvents = '';
      goalTooltip.style.transform = '';
    });
  }
});

// Update all widgets including AI prediction
function updateAllPlanWidgets() {
  updateBudgetUI();
  updateGoalUI();
  updateAIPredictiveBudget();
  renderSpendingHeatmap();
  updateWhatIfResults();
}

// Patch fetchPlanTransactions to call updateAllPlanWidgets
async function fetchPlanTransactions() {
  const email = localStorage.getItem('fundify_user_email');
  if (!email) return;
  try {
    const res = await fetch('http://127.0.0.1:8000/transactions?email=' + encodeURIComponent(email));
    const data = await res.json();
    if (data.success) {
      planTransactions = data.transactions;
    } else {
      planTransactions = [];
    }
  } catch (err) {
    planTransactions = [];
  }
  updateAllPlanWidgets();
}

document.addEventListener('DOMContentLoaded', () => {
  // Set initial budget input value
  document.getElementById('budget-input').value = getBudget() || '';
  // Fetch transactions and update UI
  fetchPlanTransactions();

  // Budget form submit
  document.getElementById('budget-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const val = parseFloat(document.getElementById('budget-input').value);
    if (!isNaN(val) && val >= 0) {
      setBudget(val);
      updateAllPlanWidgets();
    }
  });

  // Tooltip hover logic
  const barBg = document.querySelector('.budget-progress-bar-bg');
  const tooltip = document.getElementById('budget-tooltip');
  if (barBg && tooltip) {
    barBg.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
      tooltip.style.pointerEvents = 'auto';
      tooltip.style.transform = 'translateX(-50%) translateY(-8px) scale(1)';
    });
    barBg.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '';
      tooltip.style.pointerEvents = '';
      tooltip.style.transform = '';
    });
  }

  setupWhatIfSliders();
  renderSpendingHeatmap();
});

function updateAIPredictiveBudget() {
  const spent = getSpentThisMonth();
  const budget = getBudget();
  const made = getMadeThisMonth();
  const goal = getGoal();
  const now = new Date();
  const { month, year } = getCurrentMonthYear();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = now.getDate();
  const daysLeft = daysInMonth - today;
  // Avoid division by zero
  const avgDaily = today > 0 ? spent / today : 0;
  const projected = spent + avgDaily * daysLeft;
  const overBudget = projected - budget;
  const el = document.getElementById('ai-predictive-budget');
  if (el) {
    if (overBudget > 0) {
      el.textContent = '$' + Math.abs(overBudget).toFixed(2) + ' over budget';
      el.style.color = '#ff4d4f';
    } else {
      el.textContent = '$' + Math.abs(overBudget).toFixed(2) + ' under budget';
      el.style.color = '#4caf50';
    }
  }

  // Max daily spend to stay within budget
  const maxDailySpend = daysLeft > 0 ? Math.max(0, (budget - spent) / daysLeft) : 0;
  const maxDailySpendEl = document.getElementById('ai-max-daily-spend');
  if (maxDailySpendEl) maxDailySpendEl.textContent = '$' + maxDailySpend.toFixed(2);

  // Days you can spend $0 and still be under budget
  const zeroDays = avgDaily > 0 ? Math.floor((budget - spent) / avgDaily) : daysLeft;
  const zeroDaysEl = document.getElementById('ai-zero-days');
  if (zeroDaysEl) zeroDaysEl.textContent = zeroDays >= 0 ? zeroDays : 0;

  // Largest single expense this month
  const expenses = planTransactions.filter(tx => tx.type === 'Withdrawal' && (() => { const [mm, dd, yyyy] = tx.date.split('/'); return parseInt(mm) === month && parseInt(yyyy) === year; })());
  const largestExpense = expenses.length > 0 ? Math.max(...expenses.map(tx => parseFloat(tx.amount))) : 0;
  const largestExpenseEl = document.getElementById('ai-largest-expense');
  if (largestExpenseEl) largestExpenseEl.textContent = '$' + largestExpense.toFixed(2);

  // Average daily spend so far
  const avgDailySpendEl = document.getElementById('ai-avg-daily-spend');
  if (avgDailySpendEl) avgDailySpendEl.textContent = '$' + avgDaily.toFixed(2);

  // Min daily earn to reach goal
  const minDailyEarn = daysLeft > 0 ? Math.max(0, (goal - made) / daysLeft) : 0;
  const minDailyEarnEl = document.getElementById('ai-min-daily-earn');
  if (minDailyEarnEl) minDailyEarnEl.textContent = '$' + minDailyEarn.toFixed(2);

  // Projected total earned by end of month
  const avgDailyEarn = today > 0 ? made / today : 0;
  const projectedEarned = made + avgDailyEarn * daysLeft;
  const projectedEarnedEl = document.getElementById('ai-projected-earned');
  if (projectedEarnedEl) projectedEarnedEl.textContent = '$' + projectedEarned.toFixed(2);

  // Amount left to earn to hit goal
  const leftToEarn = Math.max(0, goal - made);
  const leftToEarnEl = document.getElementById('ai-left-to-earn');
  if (leftToEarnEl) leftToEarnEl.textContent = '$' + leftToEarn.toFixed(2);

  // Largest single deposit this month
  const deposits = planTransactions.filter(tx => tx.type === 'Deposit' && (() => { const [mm, dd, yyyy] = tx.date.split('/'); return parseInt(mm) === month && parseInt(yyyy) === year; })());
  const largestDeposit = deposits.length > 0 ? Math.max(...deposits.map(tx => parseFloat(tx.amount))) : 0;
  const largestDepositEl = document.getElementById('ai-largest-deposit');
  if (largestDepositEl) largestDepositEl.textContent = '$' + largestDeposit.toFixed(2);

  // Average daily earning so far
  const avgDailyEarnEl = document.getElementById('ai-avg-daily-earn');
  if (avgDailyEarnEl) avgDailyEarnEl.textContent = '$' + avgDailyEarn.toFixed(2);
}

// --- What-If Sliders & Heatmap Logic ---
function updateWhatIfResults() {
  const spent = getSpentThisMonth();
  const made = getMadeThisMonth();
  const budget = getBudget();
  const goal = getGoal();
  const now = new Date();
  const { month, year } = getCurrentMonthYear();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = now.getDate();
  const daysLeft = daysInMonth - today;

  // Get slider values
  const spendPerDay = parseFloat(document.getElementById('whatif-spend-slider').value);
  const earnPerDay = parseFloat(document.getElementById('whatif-earn-slider').value);
  document.getElementById('whatif-spend-value').textContent = `$${spendPerDay.toFixed(2)}`;
  document.getElementById('whatif-earn-value').textContent = `$${earnPerDay.toFixed(2)}`;

  // Projected spending/earning
  const projectedSpend = spent + spendPerDay * daysLeft;
  const projectedEarn = made + earnPerDay * daysLeft;
  const budgetDiff = budget - projectedSpend;
  const goalDiff = projectedEarn - goal;

  let html = '';
  html += `<div>Projected end-of-month spending: <span style="color:${budgetDiff>=0?'#4caf50':'#ff4d4f'};font-weight:700;">$${projectedSpend.toFixed(2)}</span> (${budgetDiff>=0?'$'+budgetDiff.toFixed(2)+' under budget':'$'+Math.abs(budgetDiff).toFixed(2)+' over budget'})</div>`;
  html += `<div>Projected end-of-month earning: <span style="color:${goalDiff>=0?'#4caf50':'#ff4d4f'};font-weight:700;">$${projectedEarn.toFixed(2)}</span> (${goalDiff>=0?'$'+goalDiff.toFixed(2)+' over goal':'$'+Math.abs(goalDiff).toFixed(2)+' under goal'})</div>`;
  document.getElementById('whatif-results').innerHTML = html;
}

function setupWhatIfSliders() {
  const spendSlider = document.getElementById('whatif-spend-slider');
  const earnSlider = document.getElementById('whatif-earn-slider');
  if (!spendSlider || !earnSlider) return;
  spendSlider.addEventListener('input', updateWhatIfResults);
  earnSlider.addEventListener('input', updateWhatIfResults);
  // Set initial values to current avg daily spend/earn
  const now = new Date();
  const today = now.getDate();
  spendSlider.value = today > 0 ? (getSpentThisMonth() / today).toFixed(2) : 0;
  earnSlider.value = today > 0 ? (getMadeThisMonth() / today).toFixed(2) : 0;
  updateWhatIfResults();
}

function renderSpendingHeatmap() {
  const calendar = document.getElementById('heatmap-calendar');
  if (!calendar) return;
  calendar.innerHTML = '';
  const { month, year } = getCurrentMonthYear();
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  // Gather spending per day
  const spendingByDay = {};
  planTransactions.forEach(tx => {
    if (tx.type === 'Withdrawal') {
      const [mm, dd, yyyy] = tx.date.split('/');
      if (parseInt(mm) === month && parseInt(yyyy) === year) {
        const day = parseInt(dd);
        spendingByDay[day] = (spendingByDay[day] || 0) + parseFloat(tx.amount);
      }
    }
  });
  // Find max spending for color scale
  const maxSpend = Math.max(1, ...Object.values(spendingByDay));
  // Render blank days for first week
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.className = 'heatmap-day';
    blank.style.background = 'transparent';
    calendar.appendChild(blank);
  }
  // Render days
  for (let d = 1; d <= daysInMonth; d++) {
    const amt = spendingByDay[d] || 0;
    const dayDiv = document.createElement('div');
    dayDiv.className = 'heatmap-day';
    dayDiv.textContent = d;
    dayDiv.setAttribute('data-amount', amt > 0 ? `$${amt.toFixed(2)}` : '$0.00');
    // Color scale: interpolate from #232e4a (low) to #235FD6 (mid) to #1c4daf/#0d1a3a (high)
    let color = '#232e4a';
    if (amt > 0) {
      const pct = amt / maxSpend;
      if (pct < 0.33) color = '#232e4a';
      else if (pct < 0.66) color = '#235FD6';
      else if (pct < 0.85) color = '#1c4daf';
      else color = '#0d1a3a';
    }
    dayDiv.style.background = color;
    dayDiv.style.color = amt > 0 ? '#fff' : '#bfc6e0';
    calendar.appendChild(dayDiv);
  }
}
