// score.js - Score page functionality

// Add event listener for DOMContentLoaded (score.html)
document.addEventListener('DOMContentLoaded', () => {
  // Set score value element
  const scoreValueEl = document.querySelector('.score-value');
  // Set score positives element
  const positivesEl = document.getElementById('score-positives');
  // Set score negatives element
  const negativesEl = document.getElementById('score-negatives');
  // Set score advice element
  const adviceEl = document.getElementById('score-advice');
  // Set score ai recommendations element
  const aiRecommendationsEl = document.getElementById('score-ai-recommendations');

  // Fetch transactions
  async function fetchTransactions() {
    const email = localStorage.getItem('fundify_user_email');
    if (!email) return [];
    try {
      const res = await fetch('http://127.0.0.1:8000/transactions?email=' + encodeURIComponent(email));
      const data = await res.json();
      if (data.success) {
        return data.transactions;
      }
    } catch (err) {}
    return [];
  }

  // Analyze transactions
  function analyzeTransactions(transactions) {
    // Gather stats
    let totalSpent = 0, totalDeposited = 0, withdrawals = 0, deposits = 0;
    let storeCounts = {}, methodCounts = {}, days = new Set(), negativeDays = 0;
    let last30 = [], now = new Date();
    let dailyBalances = {}, running = 0;
    let minDate = null, maxDate = null;
    let balance = 0;
    let cashWithdrawals = 0, creditWithdrawals = 0, debitWithdrawals = 0, checkWithdrawals = 0;
    let cashDeposits = 0, creditDeposits = 0, debitDeposits = 0, checkDeposits = 0;
    let largestWithdrawal = 0, largestDeposit = 0;
    let smallestWithdrawal = Infinity, smallestDeposit = Infinity;
    let weekendSpending = 0, weekdaySpending = 0;
    let recurringStores = {}, recurringCount = 0;
    let consecutiveDays = 0, maxConsecutive = 0, prevDate = null;
    let zeroDays = 0;
    let monthlyTotals = {}, monthsActive = new Set();
    let withdrawalToDepositRatio = 0;
    let firstDate = null, lastDate = null;
    let highSpendingDays = 0, lowSpendingDays = 0;
    let depositStreak = 0, withdrawalStreak = 0, maxDepositStreak = 0, maxWithdrawalStreak = 0;
    let evenSpending = true, prevAmount = null;
    let cashOnlyDays = 0, cardOnlyDays = 0;
    let uniqueStores = new Set();
    let highFrequencyStores = 0;
    let methodDiversity = 0;
    let daysWithBothDepositAndWithdrawal = 0;
    let daysWithNoTransactions = 0;
    let last7 = [];
    let last90 = [];
    let withdrawalAmounts = [], depositAmounts = [];

    // Preprocess: sort by date ascending (for consecutive days)
    transactions.sort((a, b) => {
      const [am, ad, ay] = a.date.split('/');
      const [bm, bd, by] = b.date.split('/');
      return new Date(`${ay}-${am.padStart(2, '0')}-${ad.padStart(2, '0')}`) - new Date(`${by}-${bm.padStart(2, '0')}-${bd.padStart(2, '0')}`);
    });

    transactions.forEach(tx => {
      if (!tx.date) return;
      const [mm, dd, yyyy] = tx.date.split('/');
      const txDate = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`);
      if (!minDate || txDate < minDate) minDate = txDate;
      if (!maxDate || txDate > maxDate) maxDate = txDate;
      if (!firstDate) firstDate = txDate;
      lastDate = txDate;
      days.add(tx.date);
      monthsActive.add(`${yyyy}-${mm}`);
      uniqueStores.add(tx.store);
      if (!monthlyTotals[`${yyyy}-${mm}`]) monthlyTotals[`${yyyy}-${mm}`] = 0;
      if (!dailyBalances[tx.date]) dailyBalances[tx.date] = 0;
      if (!storeCounts[tx.store]) storeCounts[tx.store] = 0;
      storeCounts[tx.store]++;
      if (!methodCounts[tx.method]) methodCounts[tx.method] = 0;
      methodCounts[tx.method]++;
      // For last 30/7/90 days (for recent activity)
      if ((now - txDate) / (1000*60*60*24) <= 30) last30.push(tx);
      if ((now - txDate) / (1000*60*60*24) <= 7) last7.push(tx);
      if ((now - txDate) / (1000*60*60*24) <= 90) last90.push(tx);
      // Transaction type
      if (tx.type === 'Withdrawal') {
        totalSpent += parseFloat(tx.amount);
        withdrawals++;
        withdrawalAmounts.push(parseFloat(tx.amount));
        balance -= parseFloat(tx.amount);
        monthlyTotals[`${yyyy}-${mm}`] -= parseFloat(tx.amount);
        if (tx.method === 'Cash') cashWithdrawals++;
        if (tx.method === 'Credit') creditWithdrawals++;
        if (tx.method === 'Debit') debitWithdrawals++;
        if (tx.method === 'Check') checkWithdrawals++;
        if (parseFloat(tx.amount) > largestWithdrawal) largestWithdrawal = parseFloat(tx.amount);
        if (parseFloat(tx.amount) < smallestWithdrawal) smallestWithdrawal = parseFloat(tx.amount);
        if (txDate.getDay() === 0 || txDate.getDay() === 6) weekendSpending += parseFloat(tx.amount);
        else weekdaySpending += parseFloat(tx.amount);
        withdrawalStreak++;
        depositStreak = 0;
        if (withdrawalStreak > maxWithdrawalStreak) maxWithdrawalStreak = withdrawalStreak;
      } else if (tx.type === 'Deposit') {
        totalDeposited += parseFloat(tx.amount);
        deposits++;
        depositAmounts.push(parseFloat(tx.amount));
        balance += parseFloat(tx.amount);
        monthlyTotals[`${yyyy}-${mm}`] += parseFloat(tx.amount);
        if (tx.method === 'Cash') cashDeposits++;
        if (tx.method === 'Credit') creditDeposits++;
        if (tx.method === 'Debit') debitDeposits++;
        if (tx.method === 'Check') checkDeposits++;
        if (parseFloat(tx.amount) > largestDeposit) largestDeposit = parseFloat(tx.amount);
        if (parseFloat(tx.amount) < smallestDeposit) smallestDeposit = parseFloat(tx.amount);
        depositStreak++;
        withdrawalStreak = 0;
        if (depositStreak > maxDepositStreak) maxDepositStreak = depositStreak;
      }
      // Recurring stores
      recurringStores[tx.store] = (recurringStores[tx.store] || 0) + 1;
      // Daily balance
      dailyBalances[tx.date] += (tx.type === 'Deposit' ? parseFloat(tx.amount) : -parseFloat(tx.amount));
      // Even spending
      if (prevAmount !== null && Math.abs(parseFloat(tx.amount) - prevAmount) > 100) evenSpending = false;
      prevAmount = parseFloat(tx.amount);
    });

    // Calculate negative days (for no negative days)
    running = 0;
    Object.keys(dailyBalances).sort().forEach(date => {
      running += dailyBalances[date];
      if (running < 0) negativeDays++;
      if (dailyBalances[date] === 0) zeroDays++;
      if (dailyBalances[date] > 500) highSpendingDays++;
      if (dailyBalances[date] > 0 && dailyBalances[date] < 50) lowSpendingDays++;
    });

    // Consecutive days with transactions (for consistent activity)
    let sortedDays = Array.from(days).sort((a, b) => new Date(a) - new Date(b));
    prevDate = null;
    sortedDays.forEach(dateStr => {
      const [mm, dd, yyyy] = dateStr.split('/');
      const date = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`);
      if (prevDate) {
        const diff = (date - prevDate) / (1000*60*60*24);
        if (diff === 1) consecutiveDays++;
        else consecutiveDays = 1;
        if (consecutiveDays > maxConsecutive) maxConsecutive = consecutiveDays;
      } else {
        consecutiveDays = 1;
        maxConsecutive = 1;
      }
      prevDate = date;
    });

    // Recurring stores (visited > 3 times) (for healthy recurring transactions)
    highFrequencyStores = Object.values(storeCounts).filter(c => c > 3).length;
    recurringCount = Object.values(recurringStores).filter(c => c > 2).length;

    // Method diversity (for variety of payment methods)
    methodDiversity = Object.keys(methodCounts).length;

    // Withdrawal to deposit ratio (for balance of cash flow)
    withdrawalToDepositRatio = deposits > 0 ? withdrawals / deposits : 0;

    // Days with both deposit and withdrawal (for activity)
    let dayTxMap = {};
    transactions.forEach(tx => {
      if (!dayTxMap[tx.date]) dayTxMap[tx.date] = { d: 0, w: 0 };
      if (tx.type === 'Deposit') dayTxMap[tx.date].d++;
      if (tx.type === 'Withdrawal') dayTxMap[tx.date].w++;
    });
    Object.values(dayTxMap).forEach(val => {
      if (val.d > 0 && val.w > 0) daysWithBothDepositAndWithdrawal++;
      if (val.d === 0 && val.w === 0) daysWithNoTransactions++;
    });

    // Cash/card only days (for card usage)
    Object.keys(dayTxMap).forEach(date => {
      const txs = transactions.filter(tx => tx.date === date);
      const allCash = txs.every(tx => tx.method === 'Cash');
      const allCard = txs.every(tx => tx.method === 'Credit' || tx.method === 'Debit');
      if (allCash) cashOnlyDays++;
      if (allCard) cardOnlyDays++;
    });

    // Score Calculation (100 max)
    let score = 50;
    // 1. More deposits than withdrawals
    if (totalDeposited > totalSpent) score += 6;
    // 2. No negative days
    if (negativeDays === 0) score += 6;
    // 3. High method diversity
    if (methodDiversity >= 3) score += 4;
    // 4. Many unique stores
    if (uniqueStores.size > 5) score += 3;
    // 5. Recurring stores (good for bills, bad if only fast food)
    if (recurringCount > 2) score += 2;
    // 6. High frequency stores (bad if only 1-2)
    if (highFrequencyStores > 2) score += 2;
    // 7. Consistent activity (maxConsecutive)
    if (maxConsecutive > 7) score += 4;
    // 8. No zero days
    if (zeroDays === 0) score += 2;
    // 9. Weekend vs weekday balance
    if (weekendSpending < weekdaySpending) score += 2;
    // 10. Small average withdrawal
    if (withdrawals > 0 && totalSpent / withdrawals < 60) score += 3;
    // 11. Small average deposit
    if (deposits > 0 && totalDeposited / deposits < 100) score += 2;
    // 12. No large withdrawals
    if (largestWithdrawal < 500) score += 2;
    // 13. No large deposits (suggests regular income)
    if (largestDeposit < 2000) score += 2;
    // 14. High deposit streak
    if (maxDepositStreak > 3) score += 2;
    // 15. High withdrawal streak (bad)
    if (maxWithdrawalStreak > 3) score -= 2;
    // 16. Withdrawal to deposit ratio
    if (withdrawalToDepositRatio < 1.2) score += 3;
    else if (withdrawalToDepositRatio > 2) score -= 3;
    // 17. Even spending
    if (evenSpending) score += 2;
    // 18. Cash only days (bad if too many)
    if (cashOnlyDays > 5) score -= 2;
    // 19. Card only days (good)
    if (cardOnlyDays > 5) score += 2;
    // 20. Days with both deposit and withdrawal (shows activity)
    if (daysWithBothDepositAndWithdrawal > 3) score += 2;
    // 21. Months active
    if (monthsActive.size > 3) score += 2;
    // 22. High spending days (bad)
    if (highSpendingDays > 3) score -= 2;
    // 23. Low spending days (good)
    if (lowSpendingDays > 3) score += 2;
    // 24. Smallest withdrawal > 0 (no microtransactions)
    if (smallestWithdrawal > 5 && smallestWithdrawal < Infinity) score += 1;
    // 25. Smallest deposit > 0 (no microdeposits)
    if (smallestDeposit > 5 && smallestDeposit < Infinity) score += 1;
    // 26. Last 7 days activity
    if (last7.length > 2) score += 2;
    // 27. Last 30 days activity
    if (last30.length > 5) score += 2;
    // 28. Last 90 days activity
    if (last90.length > 10) score += 2;
    // 29. Deposit/withdrawal average ratio
    if (deposits > 0 && withdrawals > 0 && (totalDeposited / deposits) > (totalSpent / withdrawals)) score += 2;
    // 30. No days with no transactions (very active)
    if (daysWithNoTransactions === 0) score += 1;
    // Clamp score
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    // Positives
    const positives = [];
    if (totalDeposited > totalSpent) positives.push('You deposited more than you spent.');
    if (negativeDays === 0) positives.push('You never had a negative balance.');
    if (methodDiversity >= 3) positives.push('You use a variety of payment methods.');
    if (uniqueStores.size > 5) positives.push('You shop at a wide range of places.');
    if (recurringCount > 2) positives.push('You have healthy recurring transactions (e.g., bills, subscriptions).');
    if (highFrequencyStores > 2) positives.push('You have consistent spending at several merchants.');
    if (maxConsecutive > 7) positives.push('You have a long streak of daily activity.');
    if (zeroDays === 0) positives.push('You always have some transaction activity.');
    if (weekendSpending < weekdaySpending) positives.push('You spend less on weekends than weekdays.');
    if (withdrawals > 0 && totalSpent / withdrawals < 60) positives.push('Your average withdrawal is low.');
    if (deposits > 0 && totalDeposited / deposits < 100) positives.push('Your average deposit is low (suggests regular income).');
    if (largestWithdrawal < 500) positives.push('You avoid large withdrawals.');
    if (largestDeposit < 2000) positives.push('You avoid large, irregular deposits.');
    if (maxDepositStreak > 3) positives.push('You have a streak of regular deposits.');
    if (withdrawalToDepositRatio < 1.2) positives.push('Your withdrawal to deposit ratio is healthy.');
    if (evenSpending) positives.push('Your spending is consistent.');
    if (cardOnlyDays > 5) positives.push('You use cards for most transactions.');
    if (daysWithBothDepositAndWithdrawal > 3) positives.push('You often deposit and withdraw on the same day.');
    if (monthsActive.size > 3) positives.push('You have been active for several months.');
    if (lowSpendingDays > 3) positives.push('You have many days with low spending.');
    if (smallestWithdrawal > 5 && smallestWithdrawal < Infinity) positives.push('You avoid micro-withdrawals.');
    if (smallestDeposit > 5 && smallestDeposit < Infinity) positives.push('You avoid micro-deposits.');
    if (last7.length > 2) positives.push('You have recent transaction activity.');
    if (last30.length > 5) positives.push('You have been active in the last month.');
    if (last90.length > 10) positives.push('You have been active in the last 3 months.');
    if (deposits > 0 && withdrawals > 0 && (totalDeposited / deposits) > (totalSpent / withdrawals)) positives.push('Your average deposit is higher than your average withdrawal.');
    if (daysWithNoTransactions === 0) positives.push('You have transaction activity every day.');

    // Negatives
    const negatives = [];
    if (totalSpent > totalDeposited) negatives.push('You spent more than you deposited.');
    if (negativeDays > 0) negatives.push(`You had ${negativeDays} day(s) with a negative balance.`);
    if (methodDiversity < 2) negatives.push('You use only one payment method.');
    if (uniqueStores.size <= 2) negatives.push('Most spending is at only a few places.');
    if (recurringCount === 0) negatives.push('No recurring transactions detected.');
    if (highFrequencyStores <= 1) negatives.push('You have high spending at only one merchant.');
    if (maxConsecutive < 3) negatives.push('You have few consecutive days of activity.');
    if (zeroDays > 2) negatives.push('You have many days with no transaction activity.');
    if (weekendSpending > weekdaySpending) negatives.push('You spend more on weekends than weekdays.');
    if (withdrawals > 0 && totalSpent / withdrawals > 200) negatives.push('Your average withdrawal is very high.');
    if (deposits > 0 && totalDeposited / deposits > 2000) negatives.push('Your average deposit is very high (irregular income).');
    if (largestWithdrawal > 1000) negatives.push('You have very large withdrawals.');
    if (largestDeposit > 5000) negatives.push('You have very large, irregular deposits.');
    if (maxWithdrawalStreak > 3) negatives.push('You have a streak of many withdrawals in a row.');
    if (withdrawalToDepositRatio > 2) negatives.push('Your withdrawal to deposit ratio is high.');
    if (!evenSpending) negatives.push('Your spending is inconsistent.');
    if (cashOnlyDays > 5) negatives.push('You use cash for most transactions.');
    if (daysWithBothDepositAndWithdrawal < 2) negatives.push('You rarely deposit and withdraw on the same day.');
    if (monthsActive.size < 2) negatives.push('You have not been active for long.');
    if (highSpendingDays > 3) negatives.push('You have many days with high spending.');
    if (lowSpendingDays < 2) negatives.push('You rarely have low spending days.');
    if (smallestWithdrawal <= 5) negatives.push('You make micro-withdrawals.');
    if (smallestDeposit <= 5) negatives.push('You make micro-deposits.');
    if (last7.length < 2) negatives.push('You have little recent transaction activity.');
    if (last30.length < 3) negatives.push('You have little activity in the last month.');
    if (last90.length < 5) negatives.push('You have little activity in the last 3 months.');
    if (deposits > 0 && withdrawals > 0 && (totalDeposited / deposits) < (totalSpent / withdrawals)) negatives.push('Your average withdrawal is higher than your average deposit.');
    if (daysWithNoTransactions > 2) negatives.push('You have many days with no transactions.');

    // Advice
    const advice = [];
    if (totalSpent > totalDeposited) advice.push('Try to deposit more or reduce spending.');
    if (negativeDays > 0) advice.push('Maintain a buffer to avoid negative balances.');
    if (methodDiversity < 2) advice.push('Consider using multiple payment methods for flexibility and rewards.');
    if (uniqueStores.size <= 2) advice.push('Diversify your spending to avoid over-reliance on a few merchants.');
    if (recurringCount === 0) advice.push('Set up recurring transactions for bills and savings.');
    if (highFrequencyStores <= 1) advice.push('Avoid spending too much at a single merchant.');
    if (maxConsecutive < 3) advice.push('Try to make transactions more regularly.');
    if (zeroDays > 2) advice.push('Aim for more consistent transaction activity.');
    if (weekendSpending > weekdaySpending) advice.push('Monitor weekend spending.');
    if (withdrawals > 0 && totalSpent / withdrawals > 200) advice.push('Track large withdrawals and consider budgeting.');
    if (deposits > 0 && totalDeposited / deposits > 2000) advice.push('Try to split large deposits into smaller, regular ones.');
    if (largestWithdrawal > 1000) advice.push('Avoid very large withdrawals.');
    if (largestDeposit > 5000) advice.push('Avoid very large, irregular deposits.');
    if (maxWithdrawalStreak > 3) advice.push('Avoid making many withdrawals in a row.');
    if (withdrawalToDepositRatio > 2) advice.push('Reduce withdrawals or increase deposits to balance your cash flow.');
    if (!evenSpending) advice.push('Aim for more consistent spending habits.');
    if (cashOnlyDays > 5) advice.push('Consider using cards for better tracking and rewards.');
    if (daysWithBothDepositAndWithdrawal < 2) advice.push('Try to balance deposits and withdrawals on the same day.');
    if (monthsActive.size < 2) advice.push('Stay active for longer to improve your score.');
    if (highSpendingDays > 3) advice.push('Reduce high spending days.');
    if (lowSpendingDays < 2) advice.push('Aim for more low spending days.');
    if (smallestWithdrawal <= 5) advice.push('Avoid micro-withdrawals.');
    if (smallestDeposit <= 5) advice.push('Avoid micro-deposits.');
    if (last7.length < 2) advice.push('Increase your recent transaction activity.');
    if (last30.length < 3) advice.push('Increase your activity in the last month.');
    if (last90.length < 5) advice.push('Increase your activity in the last 3 months.');
    if (deposits > 0 && withdrawals > 0 && (totalDeposited / deposits) < (totalSpent / withdrawals)) advice.push('Try to make your average deposit higher than your average withdrawal.');
    if (daysWithNoTransactions > 2) advice.push('Try to have some transaction activity every day.');
    if (positives.length === 0) advice.push('Start tracking your finances for personalized advice!');

    return { score, positives, negatives, advice };
  }

  // Explain My Score & AI Recommendations
  async function fetchGroqExplanation(transactions, score, positives, negatives, advice) {
    // Fetch explanation from backend
    const res = await fetch('http://127.0.0.1:8000/ai-explain-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactions,
        score,
        positives,
        negatives,
        advice
      })
    });
    const data = await res.json();
    return data.explanation || 'Could not generate explanation.';
  }

  // Fetch Groq recommendations
  async function fetchGroqRecommendations(transactions, score, positives, negatives, advice) {
    // Fetch recommendations from backend
    const res = await fetch('http://127.0.0.1:8000/ai-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactions,
        score,
        positives,
        negatives,
        advice
      })
    });
    const data = await res.json();
    return data.recommendations || 'No additional recommendations.';
  }

  // Draw score progress
  function drawScoreProgress(score) {
    const canvas = document.getElementById('score-progress');
    if (!canvas) return;
    // Make the gauge taller and more elegant (130px height)
    canvas.width = 220;
    canvas.height = 130;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Elegant Fundify gradient arc (blue to green, no red)
    // Draw left (blue)
    ctx.beginPath();
    ctx.arc(110, 110, 95, Math.PI, Math.PI * 1.5, false);
    const grad1 = ctx.createLinearGradient(15, 110, 110, 15);
    grad1.addColorStop(0, '#235FD6'); // Fundify Blue
    grad1.addColorStop(1, '#235FD6'); // Fundify Blue
    ctx.strokeStyle = grad1;
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(35,95,214,0.10)';
    ctx.shadowBlur = 6;
    ctx.stroke();
    // Draw right (blue to green)
    ctx.beginPath();
    ctx.arc(110, 110, 95, Math.PI * 1.5, 0, false);
    const grad2 = ctx.createLinearGradient(110, 15, 205, 110);
    grad2.addColorStop(0, '#235FD6'); // Fundify Blue
    grad2.addColorStop(1, '#22c55e'); // Green
    ctx.strokeStyle = grad2;
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(34,197,94,0.10)';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;
    // Progress arc (overlay, accent color)
    const percent = Math.max(0, Math.min(1, score / 100));
    ctx.beginPath();
    ctx.arc(110, 110, 95, Math.PI, Math.PI + Math.PI * percent, false);
    ctx.strokeStyle = 'var(--accent)';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'var(--accent)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Render score
  function renderScore({ score, positives, negatives, advice }, transactions) {
    // Set score value
    scoreValueEl.textContent = score;
    // Draw score progress
    drawScoreProgress(score);
    // Clear positives, negatives, and advice
    positivesEl.innerHTML = '';
    negativesEl.innerHTML = '';
    adviceEl.innerHTML = '';
    // Get important positives, negatives, and advice
    const importantPositives = positives.slice(0, 5);
    const importantNegatives = negatives.slice(0, 5);
    const importantAdvice = advice.slice(0, 5);
    // Add important positives, negatives, and advice to the DOM
    importantPositives.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      positivesEl.appendChild(li);
    });
    importantNegatives.forEach(n => {
      const li = document.createElement('li');
      li.textContent = n;
      negativesEl.appendChild(li);
    });
    importantAdvice.forEach(a => {
      const li = document.createElement('li');
      li.textContent = a;
      adviceEl.appendChild(li);
    });
    // Fetch and display AI recommendations (Groq)
    const aiRecEl = document.getElementById('score-ai-recommendations');
    aiRecEl.textContent = 'Loading...';
    fetchGroqRecommendations(transactions, score, positives, negatives, advice).then(recs => {
      aiRecEl.innerHTML = '';
      if (Array.isArray(recs)) {
        recs.forEach(r => {
          const li = document.createElement('li');
          li.textContent = r;
          aiRecEl.appendChild(li);
        });
      } else {
        aiRecEl.textContent = recs;
      }
    });
  }

  // Explain My Score modal logic (Groq)
  const explainBtn = document.getElementById('explain-score-btn');
  const explainModal = document.getElementById('explain-score-modal');
  const explainText = document.getElementById('explain-score-text');
  const closeExplain = document.getElementById('close-explain-score');
  let lastScoreData = null;
  let lastTransactions = null;
  if (explainBtn && explainModal && explainText && closeExplain) {
    explainBtn.addEventListener('click', async () => {
      explainModal.style.display = 'flex';
      explainText.textContent = 'Loading...';
      if (lastScoreData && lastTransactions) {
        const explanation = await fetchGroqExplanation(
          lastTransactions,
          lastScoreData.score,
          lastScoreData.positives,
          lastScoreData.negatives,
          lastScoreData.advice
        );
        explainText.textContent = explanation;
      } else {
        explainText.textContent = 'No score data available.';
      }
    });
    closeExplain.addEventListener('click', () => {
      explainModal.style.display = 'none';
    });
    explainModal.addEventListener('click', (e) => {
      if (e.target === explainModal) explainModal.style.display = 'none';
    });
  }

  // Fetch transactions and render score
  fetchTransactions().then(transactions => {
    const analysis = analyzeTransactions(transactions);
    lastScoreData = analysis;
    lastTransactions = transactions;
    renderScore(analysis, transactions);
  });
});
