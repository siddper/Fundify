// Modal logic
const openBtn = document.getElementById('openAddModal');
const closeBtn = document.getElementById('closeAddModal');
const modalBg = document.getElementById('addModal');
if (openBtn && closeBtn && modalBg) {
  openBtn.addEventListener('click', () => {
    modalBg.classList.add('active');
  });
  closeBtn.addEventListener('click', () => {
    modalBg.classList.remove('active');
  });
  modalBg.addEventListener('click', (e) => {
    if (e.target === modalBg) {
      modalBg.classList.remove('active');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBg.classList.remove('active');
    }
  });
}

// Quick Transaction form handler
const quickTransactionForm = document.querySelector('.quick-transaction-content form');
const quickTransactionPrompt = document.querySelector('.quick-transaction-prompt');
const aiMessageContainer = document.querySelector('.quick-transaction-content .ai-message-container');

if (quickTransactionForm) {
  quickTransactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const promptText = quickTransactionPrompt.value;
    const email = localStorage.getItem('fundify_user_email');
    if (!promptText.trim() || !email) return;

    // Reset and hide message container on new submission
    aiMessageContainer.style.display = 'none';
    aiMessageContainer.className = 'ai-message-container';

    const submitBtn = quickTransactionForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    quickTransactionPrompt.disabled = true;

    try {
      const res = await fetch('http://127.0.0.1:8000/quick-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, email: email })
      });
      const data = await res.json();
      if (data.success) {
        await fetchTransactions();
        quickTransactionForm.querySelector('.quick-transaction-prompt').value = '';
        modalBg.classList.remove('active');
      } else if (data.clarification_needed) {
        aiMessageContainer.textContent = data.message;
        aiMessageContainer.classList.add('clarification');
        aiMessageContainer.style.display = 'block';
      } else {
        aiMessageContainer.textContent = data.error || 'Could not process transaction.';
        aiMessageContainer.classList.add('error');
        aiMessageContainer.style.display = 'block';
      }
    } catch (err) {
      aiMessageContainer.textContent = 'A server error occurred. Please try again.';
      aiMessageContainer.classList.add('error');
      aiMessageContainer.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      quickTransactionPrompt.disabled = false;
    }
  });
}

if (quickTransactionPrompt && quickTransactionForm) {
  quickTransactionPrompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      quickTransactionForm.querySelector('button[type="submit"]').click();
    }
  });
}

// Quick Preset form handler
const quickPresetForm = document.querySelector('.quick-preset-content form');
const quickPresetPrompt = document.querySelector('.quick-preset-prompt');
const quickPresetAiMessageContainer = document.querySelector('.quick-preset-content .ai-message-container');

if (quickPresetForm) {
  quickPresetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const promptText = quickPresetPrompt.value;
    const email = localStorage.getItem('fundify_user_email');
    if (!promptText.trim() || !email) return;

    quickPresetAiMessageContainer.style.display = 'none';
    quickPresetAiMessageContainer.className = 'ai-message-container';

    const submitBtn = quickPresetForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    quickPresetPrompt.disabled = true;

    try {
      const res = await fetch('http://127.0.0.1:8000/quick-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, email: email })
      });
      const data = await res.json();
      if (data.success) {
        await fetchPresets();
        quickPresetForm.reset();
        document.querySelector('.transaction-option').click();
      } else if (data.clarification_needed) {
        quickPresetAiMessageContainer.textContent = data.message;
        quickPresetAiMessageContainer.classList.add('clarification');
        quickPresetAiMessageContainer.style.display = 'block';
      } else {
        quickPresetAiMessageContainer.textContent = data.error || 'Could not process preset.';
        quickPresetAiMessageContainer.classList.add('error');
        quickPresetAiMessageContainer.style.display = 'block';
      }
    } catch (err) {
      quickPresetAiMessageContainer.textContent = 'A server error occurred. Please try again.';
      quickPresetAiMessageContainer.classList.add('error');
      quickPresetAiMessageContainer.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      quickPresetPrompt.disabled = false;
    }
  });
}

if (quickPresetPrompt && quickPresetForm) {
  quickPresetPrompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      quickPresetForm.querySelector('button[type="submit"]').click();
    }
  });
}

const modalCancelButtons = document.querySelectorAll('.modal-cancel-btn');
if (modalCancelButtons.length > 0 && modalBg) {
  modalCancelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modalBg.classList.remove('active');
    });
  });
}

// Sidebar manual resizing only, min width 100px
const sidebar = document.querySelector('.sidebar');
const resizeHandle = document.querySelector('.sidebar-resize-handle');
let isResizing = false;
let startX = 0;
let startWidth = 0;
const minSidebarWidth = 200;
const maxSidebarWidth = 400;
const SIDEBAR_WIDTH_KEY = 'fundify_sidebar_width';

// Load sidebar width from localStorage on page load
const savedWidth = parseInt(localStorage.getItem(SIDEBAR_WIDTH_KEY), 10);
if (!isNaN(savedWidth) && savedWidth >= minSidebarWidth && savedWidth <= maxSidebarWidth) {
  sidebar.style.width = savedWidth + 'px';
  sidebar.style.minWidth = savedWidth + 'px';
  sidebar.style.maxWidth = savedWidth + 'px';
}

if (resizeHandle && sidebar) {
  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = sidebar.offsetWidth;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    let newWidth = startWidth + (e.clientX - startX);
    if (newWidth < minSidebarWidth) newWidth = minSidebarWidth;
    if (newWidth > maxSidebarWidth) newWidth = maxSidebarWidth;
    sidebar.style.width = newWidth + 'px';
    sidebar.style.minWidth = newWidth + 'px';
    sidebar.style.maxWidth = newWidth + 'px';
    // Save to localStorage
    localStorage.setItem(SIDEBAR_WIDTH_KEY, newWidth);
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}

// Filter chip removal
const filterChips = document.querySelectorAll('.chip-close');
filterChips.forEach(chip => {
  chip.addEventListener('click', (e) => {
    e.target.parentElement.remove();
  });
});

// Filter add button stub
const filterAddBtn = document.querySelector('.filter-add-btn');
if (filterAddBtn) {
  filterAddBtn.addEventListener('click', () => {
    alert('Show filter add popup (to be implemented)');
  });
}

// Add-option selection logic
const addOptionButtons = document.querySelectorAll('.add-options button');
const modalContentDivs = {
  'transaction-option': document.querySelector('.add-transaction-content'),
  'quick-transaction-option': document.querySelector('.quick-transaction-content'),
  'preset-option': document.querySelector('.add-preset-content'),
  'quick-preset-option': document.querySelector('.quick-preset-content'),
};

function showOnlyContent(className) {
  Object.values(modalContentDivs).forEach(div => {
    if (div) div.style.display = 'none';
  });
  if (modalContentDivs[className]) {
    modalContentDivs[className].style.display = 'block';
  }
}

// Set default: Add Transaction
let chosenOption = '';
showOnlyContent('transaction-option');
addOptionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    addOptionButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    chosenOption = btn.textContent;
    showOnlyContent(btn.classList[0]);
  });
});

// --- Custom Dropdown Logic ---
function setupCustomDropdown(dropdownId, selectedId, listId) {
  const dropdown = document.getElementById(dropdownId);
  const selected = document.getElementById(selectedId);
  const list = document.getElementById(listId);
  if (!dropdown || !selected || !list) return;

  selected.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  list.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', (e) => {
      // For sort dropdown, prepend 'Sort by '
      if (dropdownId === 'sort-dropdown') {
        selected.textContent = 'Sort by ' + li.textContent.toLowerCase();
        sortTransactions(li.dataset.value);
      } else {
        selected.textContent = li.textContent;
      }
      selected.dataset.value = li.dataset.value;
      dropdown.classList.remove('open');
      list.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
      li.classList.add('selected');
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
}
setupCustomDropdown('custom-type-dropdown', 'custom-type-selected', 'custom-type-list');
setupCustomDropdown('custom-method-dropdown', 'custom-method-selected', 'custom-method-list');
setupCustomDropdown('sort-dropdown', 'sort-selected', 'sort-list');

// --- Custom Date Picker Logic ---
function setupCustomDatePicker() {
  const picker = document.getElementById('custom-date-picker');
  const input = document.getElementById('custom-date-input');
  const popup = document.getElementById('calendar-popup');
  if (!picker || !input || !popup) return;

  function formatDate(date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  function renderCalendar(selectedDate) {
    const today = new Date();
    const year = selectedDate ? selectedDate.getFullYear() : today.getFullYear();
    const month = selectedDate ? selectedDate.getMonth() : today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let html = `<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'>
      <button type='button' class='cal-prev'>&lt;</button>
      <span style='font-weight:600;'>${firstDay.toLocaleString('default', { month: 'long' })} ${year}</span>
      <button type='button' class='cal-next'>&gt;</button>
    </div>`;
    html += "<div style='display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;font-size:0.95em;color:#bfc6e0;'>";
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => html += `<span>${d}</span>`);
    html += "</div><div class='calendar-grid-days'>";
    for (let i = 0; i < firstDay.getDay(); i++) html += '<span></span>';
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const thisDate = new Date(year, month, d);
      const isToday = thisDate.toDateString() === today.toDateString();
      html += `<button type='button' class='cal-day' data-date='${formatDate(thisDate)}' style='background:${isToday ? '#23262a' : 'transparent'};color:${isToday ? 'var(--accent)' : 'var(--text)'};border-radius:6px;padding:6px 0;border:none;cursor:pointer;'>${d}</button>`;
    }
    html += "</div>";
    popup.innerHTML = html;
    popup.querySelector('.cal-prev').onclick = () => {
      renderCalendar(new Date(year, month - 1, 1));
    };
    popup.querySelector('.cal-next').onclick = () => {
      renderCalendar(new Date(year, month + 1, 1));
    };
    popup.querySelectorAll('.cal-day').forEach(btn => {
      btn.onclick = () => {
        input.value = btn.dataset.date;
        input.classList.remove('incorrect');
        picker.classList.remove('open');
      };
    });
  }

  // Open calendar
  input.addEventListener('click', (e) => {
    e.stopPropagation();
    picker.classList.toggle('open');
    if (picker.classList.contains('open')) {
      const val = input.value ? new Date(input.value) : new Date();
      renderCalendar(val);
    }
  });
  picker.querySelector('.calendar-icon').addEventListener('click', (e) => {
    e.stopPropagation();
    picker.classList.toggle('open');
    if (picker.classList.contains('open')) {
      const val = input.value ? new Date(input.value) : new Date();
      renderCalendar(val);
    }
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!picker.contains(e.target)) {
      picker.classList.remove('open');
    }
  });
}
setupCustomDatePicker();

// Add custom dropdowns and date picker for Add Preset form
setupCustomDropdown('custom-preset-type-dropdown', 'custom-preset-type-selected', 'custom-preset-type-list');
setupCustomDropdown('custom-preset-method-dropdown', 'custom-preset-method-selected', 'custom-preset-method-list');
function setupCustomPresetDatePicker() {
  const picker = document.getElementById('custom-preset-date-picker');
  const input = document.getElementById('custom-preset-date-input');
  const popup = document.getElementById('custom-preset-calendar-popup');
  if (!picker || !input || !popup) return;
  function formatDate(date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
  function renderCalendar(selectedDate) {
    const today = new Date();
    const year = selectedDate ? selectedDate.getFullYear() : today.getFullYear();
    const month = selectedDate ? selectedDate.getMonth() : today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let html = `<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'>
      <button type='button' class='cal-prev'>&lt;</button>
      <span style='font-weight:600;'>${firstDay.toLocaleString('default', { month: 'long' })} ${year}</span>
      <button type='button' class='cal-next'>&gt;</button>
    </div>`;
    html += "<div style='display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;font-size:0.95em;color:#bfc6e0;'>";
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => html += `<span>${d}</span>`);
    html += "</div><div class='calendar-grid-days'>";
    for (let i = 0; i < firstDay.getDay(); i++) html += '<span></span>';
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const thisDate = new Date(year, month, d);
      const isToday = thisDate.toDateString() === today.toDateString();
      html += `<button type='button' class='cal-day' data-date='${formatDate(thisDate)}' style='background:${isToday ? '#23262a' : 'transparent'};color:${isToday ? 'var(--accent)' : 'var(--text)'};border-radius:6px;padding:6px 0;border:none;cursor:pointer;'>${d}</button>`;
    }
    html += "</div>";
    popup.innerHTML = html;
    popup.querySelector('.cal-prev').onclick = () => {
      renderCalendar(new Date(year, month - 1, 1));
    };
    popup.querySelector('.cal-next').onclick = () => {
      renderCalendar(new Date(year, month + 1, 1));
    };
    popup.querySelectorAll('.cal-day').forEach(btn => {
      btn.onclick = () => {
        input.value = btn.dataset.date;
        input.classList.remove('incorrect');
        picker.classList.remove('open');
      };
    });
  }
  input.addEventListener('click', (e) => {
    e.stopPropagation();
    picker.classList.toggle('open');
    if (picker.classList.contains('open')) {
      const val = input.value ? new Date(input.value) : new Date();
      renderCalendar(val);
    }
  });
  picker.querySelector('.calendar-icon').addEventListener('click', (e) => {
    e.stopPropagation();
    picker.classList.toggle('open');
    if (picker.classList.contains('open')) {
      const val = input.value ? new Date(input.value) : new Date();
      renderCalendar(val);
    }
  });
  document.addEventListener('click', (e) => {
    if (!picker.contains(e.target)) {
      picker.classList.remove('open');
    }
  });
}
setupCustomPresetDatePicker();

// Prevent calendar popup from closing when clicking inside it
// (for both main and preset calendar popups)
document.querySelectorAll('.calendar-popup').forEach(popup => {
  popup.addEventListener('click', e => e.stopPropagation());
});

// --- Preset Logic ---
let presets = [];

const presetsContainer = document.getElementById('presets-container');
const presetForm = document.querySelector('.preset-form');

async function fetchPresets() {
    const email = localStorage.getItem('fundify_user_email');
    if (!email) return;
    try {
        const res = await fetch('http://127.0.0.1:8000/presets?email=' + encodeURIComponent(email));
        const data = await res.json();
        if (data.success) {
            presets = data.presets;
            renderPresets();
        }
    } catch (err) {
        console.error("Failed to fetch presets:", err);
    }
}

async function deletePreset(presetId, index) {
    try {
        const res = await fetch(`http://127.0.0.1:8000/presets/${presetId}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if(data.success) {
            presets.splice(index, 1);
            renderPresets();
        } else {
            alert(data.error || 'Failed to delete preset.');
        }
    } catch (err) {
        alert('Server error while deleting preset.');
    }
}

function renderPresets() {
  if (!presetsContainer) return;
  presetsContainer.innerHTML = '';
  if (presets.length === 0) {
      presetsContainer.style.display = 'none';
      return;
  }
  presetsContainer.style.display = 'flex';
  presets.forEach((preset, index) => {
    const presetButton = document.createElement('button');
    presetButton.type = 'button';
    presetButton.className = 'preset-chip';
    presetButton.textContent = preset.name;
    presetButton.dataset.index = index;
    presetButton.addEventListener('click', () => {
      applyPreset(index);
    });
    presetButton.addEventListener('dblclick', () => {
        deletePreset(preset.id, index);
    });
    presetsContainer.appendChild(presetButton);
  });
}

function applyPreset(index) {
  const preset = presets[index];
  if (!preset) return;

  // Autofill the 'Add Transaction' form
  const typeBtn = document.getElementById('custom-type-selected');
  const dateInput = document.getElementById('custom-date-input');
  const amountInput = document.getElementById('amount');
  const storeInput = document.getElementById('store');
  const methodBtn = document.getElementById('custom-method-selected');

  typeBtn.textContent = preset.type;
  dateInput.value = preset.date;
  amountInput.value = preset.amount;
  storeInput.value = preset.store;
  methodBtn.textContent = preset.method;

  // Remove any validation errors
  [typeBtn, dateInput, amountInput, storeInput, methodBtn].forEach(el => {
      if(el) el.classList.remove('incorrect');
  });
}

if (presetForm) {
    presetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('preset-name');
        const typeBtn = document.getElementById('custom-preset-type-selected');
        const dateInput = document.getElementById('custom-preset-date-input');
        const amountInput = document.getElementById('preset-amount');
        const methodBtn = document.getElementById('custom-preset-method-selected');
        const storeInput = document.getElementById('preset-store');

        const inputs = [nameInput, typeBtn, dateInput, amountInput, methodBtn, storeInput];
        inputs.forEach(el => { if(el) el.classList.remove('incorrect')});
        
        let isValid = true;
        if (!nameInput.value.trim()) { nameInput.classList.add('incorrect'); isValid = false; }
        if (!amountInput.value.trim()) { amountInput.classList.add('incorrect'); isValid = false; }
        if (!storeInput.value.trim()) { storeInput.classList.add('incorrect'); isValid = false; }
        if (!dateInput.value.trim()) { dateInput.classList.add('incorrect'); isValid = false; }
        if (methodBtn.textContent.trim() === 'Method') { methodBtn.classList.add('incorrect'); isValid = false; }

        if (!isValid) return;

        const newPresetPayload = {
            name: nameInput.value.trim(),
            type: typeBtn.textContent.trim(),
            date: dateInput.value.trim(),
            amount: amountInput.value.trim(),
            method: methodBtn.textContent.trim(),
            store: storeInput.value.trim(),
            email: localStorage.getItem('fundify_user_email')
        };

        try {
            const res = await fetch('http://127.0.0.1:8000/presets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPresetPayload)
            });
            const data = await res.json();
            if (data.success) {
                await fetchPresets(); // Re-fetch to get the new list with ID
                // Reset and switch back to the 'Add Transaction' view
                presetForm.reset();
                document.getElementById('custom-preset-type-selected').textContent = 'Withdrawal';
                document.getElementById('custom-preset-method-selected').textContent = 'Method';
                document.querySelector('.transaction-option').click();
            } else {
                alert(data.error || 'Failed to save preset.');
            }
        } catch (err) {
            alert('A server error occurred while saving the preset.');
        }
    });

    // Remove 'incorrect' class on input change
    const nameInput = document.getElementById('preset-name');
    const dateInput = document.getElementById('custom-preset-date-input');
    const amountInput = document.getElementById('preset-amount');
    const storeInput = document.getElementById('preset-store');
    [nameInput, dateInput, amountInput, storeInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => input.classList.remove('incorrect'));
        }
    });

    const typeBtn = document.getElementById('custom-preset-type-selected');
    const typeList = document.getElementById('custom-preset-type-list');
    if (typeList) {
        typeList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => typeBtn.classList.remove('incorrect'));
        });
    }

    const methodBtn = document.getElementById('custom-preset-method-selected');
    const methodList = document.getElementById('custom-preset-method-list');
    if (methodList) {
        methodList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => methodBtn.classList.remove('incorrect'));
        });
    }
}

// --- Transaction List Logic ---
let transactions = [];

function updateBalance() {
    const balanceAmountEl = document.getElementById('current-balance-amount');
    if (!balanceAmountEl) return;

    const balance = transactions.reduce((acc, tx) => {
        if (tx.type === 'Deposit') {
            return acc + parseFloat(tx.amount);
        } else { // Withdrawal
            return acc - parseFloat(tx.amount);
        }
    }, 0);

    balanceAmountEl.textContent = `$${balance.toFixed(2)}`;

    balanceAmountEl.classList.remove('safe', 'warning', 'danger');
    if (balance > 100) {
        balanceAmountEl.classList.add('safe');
    } else if (balance > 0) {
        balanceAmountEl.classList.add('warning');
    } else {
        balanceAmountEl.classList.add('danger');
    }
}

function sortTransactions(sortBy = 'default') {
    let sortedTransactions = [...transactions];

    if (sortBy === 'date') {
        // Sort by date ascending (oldest first)
        sortedTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'amount') {
        // Sort by amount ascending (lowest first)
        sortedTransactions.sort((a, b) => a.amount - b.amount);
    }

    renderTransactions(sortedTransactions);
}

// Fetch transactions from backend
async function fetchTransactions() {
  const email = localStorage.getItem('fundify_user_email');
  if (!email) return; // Not logged in
  try {
    const res = await fetch('http://127.0.0.1:8000/transactions?email=' + encodeURIComponent(email));
    const data = await res.json();
    if (data.success) {
      transactions = data.transactions;
      renderTransactions(); 
      updateBalance();
    } else {
      // Optionally show error
      transactions = [];
      renderTransactions();
      updateBalance();
    }
  } catch (err) {
    // Optionally show error
    transactions = [];
    renderTransactions();
    updateBalance();
  }
}

async function deleteTransaction(transactionId) {
    try {
        const res = await fetch(`http://127.0.0.1:8000/transactions/${transactionId}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if(data.success) {
            await fetchTransactions(); // This will re-fetch, re-render, and update balance
        } else {
            alert(data.error || 'Failed to delete transaction.');
        }
    } catch (err) {
        alert('Server error while deleting transaction.');
    }
}

function renderTransactions(transactionsToRender = transactions) {
  const tbody = document.querySelector('.dashboard-table tbody');
  tbody.innerHTML = '';
  transactionsToRender.forEach((tx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox"></td>
      <td>${transactions.indexOf(tx) + 1}</td>
      <td>${tx.date}</td>
      <td>${tx.type}</td>
      <td>$${parseFloat(tx.amount).toFixed(2)}</td>
      <td>${tx.store}</td>
      <td>${tx.method}</td>
      <td class="transaction-menu-cell">
        <button class="transaction-menu-btn">⋮</button>
        <div class="transaction-menu-dropdown">
          <button class="delete-tx-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>
          Delete
          </button>
        </div>
      </td>
    `;
    
    const menuBtn = tr.querySelector('.transaction-menu-btn');
    const dropdown = tr.querySelector('.transaction-menu-dropdown');
    const deleteBtn = tr.querySelector('.delete-tx-btn');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other dropdowns
        document.querySelectorAll('.transaction-menu-dropdown.show').forEach(d => {
            if (d !== dropdown) d.classList.remove('show');
        });
        dropdown.classList.toggle('show');
    });

    deleteBtn.addEventListener('click', () => {
        deleteTransaction(tx.id);
    });

    tbody.appendChild(tr);
  });
}

// On page load, fetch transactions
fetchTransactions();
fetchPresets();

const addTransactionForm = document.querySelector('.transaction-form');
if (addTransactionForm) {
  // Remove 'incorrect' class on input/change for text/number fields
  const dateInput = document.getElementById('custom-date-input');
  const amountInput = document.getElementById('amount');
  const storeInput = document.getElementById('store');
  [dateInput, amountInput, storeInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => input.classList.remove('incorrect'));
      input.addEventListener('change', () => input.classList.remove('incorrect'));
    }
  });
  // Remove 'incorrect' class on custom dropdowns when an option is selected
  const typeBtn = document.getElementById('custom-type-selected');
  const methodBtn = document.getElementById('custom-method-selected');
  const typeList = document.getElementById('custom-type-list');
  const methodList = document.getElementById('custom-method-list');
  if (typeList) {
    typeList.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => typeBtn.classList.remove('incorrect'));
    });
  }
  if (methodList) {
    methodList.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => methodBtn.classList.remove('incorrect'));
    });
  }
  addTransactionForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    // Get values from form
    const typeBtn = document.getElementById('custom-type-selected');
    const dateInput = document.getElementById('custom-date-input');
    const amountInput = document.getElementById('amount');
    const storeInput = document.getElementById('store');
    const methodBtn = document.getElementById('custom-method-selected');
    let valid = true;
    // Remove previous error states
    [typeBtn, dateInput, amountInput, storeInput, methodBtn].forEach(el => el.classList.remove('incorrect'));
    // Validate and mark incorrect
    if (!typeBtn.textContent.trim()) { typeBtn.classList.add('incorrect'); valid = false; }
    if (!dateInput.value.trim()) { dateInput.classList.add('incorrect'); valid = false; }
    if (!amountInput.value.trim()) { amountInput.classList.add('incorrect'); valid = false; }
    if (!storeInput.value.trim()) { storeInput.classList.add('incorrect'); valid = false; }
    if (!methodBtn.textContent.trim() || methodBtn.textContent.trim() === 'Method') { methodBtn.classList.add('incorrect'); valid = false; }
    if (!valid) return;
    const tx = {
      type: typeBtn.textContent.trim(),
      date: dateInput.value.trim(),
      amount: amountInput.value.trim(),
      store: storeInput.value.trim(),
      method: methodBtn.textContent.trim(),
      email: localStorage.getItem('fundify_user_email')
    };
    // Save to backend if logged in
    if (tx.email) {
      try {
        const res = await fetch('http://127.0.0.1:8000/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tx)
        });
        const data = await res.json();
        if (data.success) {
          // Refetch transactions from backend
          await fetchTransactions();
        } else {
          // Optionally show error
          alert(data.error || 'Failed to add transaction.');
        }
      } catch (err) {
        alert('Server error. Please try again.');
      }
    } else {
      // Fallback: in-memory only
      tx.id = Date.now();
      transactions.push(tx);
      renderTransactions();
    }
    // Optionally, reset form
    addTransactionForm.reset();
    typeBtn.textContent = 'Withdrawal';
    methodBtn.textContent = 'Method';
    dateInput.value = '';
    // Close modal
    if (modalBg) modalBg.classList.remove('active');
  });
}

document.addEventListener('click', (e) => {
    const openDropdown = document.querySelector('.transaction-menu-dropdown.show');
    if (openDropdown && !openDropdown.parentElement.contains(e.target)) {
        openDropdown.classList.remove('show');
    }
});