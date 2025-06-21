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
        selected.textContent = 'Sort by ' + li.textContent;
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
let selectedTransactionIds = new Set();

const bulkActionsContainer = document.getElementById('bulk-actions-container');
const searchSortContainer = document.getElementById('search-sort-container');
const selectionCountEl = document.getElementById('selection-count');
const selectAllCheckbox = document.getElementById('select-all-checkbox');
const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
const bulkCopyBtn = document.getElementById('bulk-copy-btn');

function updateBulkActionsUI() {
    const count = selectedTransactionIds.size;
    if (count > 0) {
        bulkActionsContainer.style.display = 'flex';
        searchSortContainer.style.display = 'none';
        selectionCountEl.textContent = `${count} selected`;
    } else {
        bulkActionsContainer.style.display = 'none';
        searchSortContainer.style.display = 'flex';
    }

    const allVisibleCheckboxes = document.querySelectorAll('.dashboard-table tbody tr:not([style*="display: none"]) input[type="checkbox"]');
    const allVisibleAndSelected = document.querySelectorAll('.dashboard-table tbody tr:not([style*="display: none"]) input[type="checkbox"]:checked');

    if (allVisibleCheckboxes.length > 0 && allVisibleCheckboxes.length === allVisibleAndSelected.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else if (allVisibleAndSelected.length > 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    }
}

function handleSelection(e) {
    if (e.target.type !== 'checkbox') return;

    const tr = e.target.closest('tr');
    if (!tr) return;

    const transactionId = parseInt(tr.dataset.transactionId, 10);
    if (isNaN(transactionId)) return;

    if (e.target.checked) {
        selectedTransactionIds.add(transactionId);
        tr.classList.add('selected');
    } else {
        selectedTransactionIds.delete(transactionId);
        tr.classList.remove('selected');
    }
    updateBulkActionsUI();
}

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

    if (sortBy === 'date_asc') {
        sortedTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'date_desc') {
        sortedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'amount_asc') {
        sortedTransactions.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === 'amount_desc') {
        sortedTransactions.sort((a, b) => b.amount - a.amount);
    }

    renderTransactions(sortedTransactions);
}

function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    for (let i = 0; i <= a.length; i++) { matrix[0][i] = i; }
    for (let j = 0; j <= b.length; j++) { matrix[j][0] = j; }
    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,       // Insertion
                matrix[j - 1][i] + 1,       // Deletion
                matrix[j - 1][i - 1] + cost // Substitution
            );
        }
    }
    return matrix[b.length][a.length];
}

// Search functionality
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const searchTerms = searchTerm.split(/\s+/).filter(Boolean);

        const filteredTransactions = transactions.filter((tx, index) => {
            if (!searchTerm) return true;

            const fuzzyMatch = (textToSearch, pattern) => {
                const text = String(textToSearch).toLowerCase();
                if (text.includes(pattern)) return true;
                const threshold = pattern.length > 5 ? 2 : 1;
                return levenshteinDistance(text, pattern) <= threshold;
            };

            return searchTerms.every(term => {
                if (term.startsWith('#')) {
                    return String(index + 1).includes(term.substring(1));
                }
                if (term.startsWith('type:')) {
                    return fuzzyMatch(tx.type, term.substring(5).trim());
                }
                if (term.startsWith('date:')) {
                    return tx.date.toLowerCase().includes(term.substring(5).trim());
                }
                if (term.startsWith('amount:')) {
                    return String(tx.amount).toLowerCase().includes(term.substring(7).trim());
                }
                if (term.startsWith('store:') || term.startsWith('source:')) {
                    const prefixLen = term.startsWith('store:') ? 6 : 7;
                    return fuzzyMatch(tx.store, term.substring(prefixLen).trim());
                }
                if (term.startsWith('method:')) {
                    return fuzzyMatch(tx.method, term.substring(7).trim());
                }

                if (String(index + 1).includes(term)) return true;
                if (tx.date.includes(term)) return true;
                if (String(tx.amount).includes(term)) return true;
                if (fuzzyMatch(tx.type, term)) return true;
                if (fuzzyMatch(tx.store, term)) return true;
                if (fuzzyMatch(tx.method, term)) return true;
                
                return false;
            });
        });
        
        renderTransactions(filteredTransactions);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('ai-search-btn').click();
        }
    });

    const aiSearchBtn = document.getElementById('ai-search-btn');
    if (aiSearchBtn) {
        aiSearchBtn.addEventListener('click', async () => {
            const query = searchInput.value.trim();
            if (!query) {
                alert('Please enter a search query first.');
                return;
            }

            const originalBtnContent = aiSearchBtn.innerHTML;
            aiSearchBtn.innerHTML = '<div class="loader"></div>'; // Simple loader
            aiSearchBtn.disabled = true;

            try {
                const res = await fetch('http://127.0.0.1:8000/ai-search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: query,
                        transactions: transactions // Send the full list
                    })
                });

                const data = await res.json();
                
                if (res.ok) {
                    const matchingIds = new Set(data.matching_ids);
                    const filtered = transactions.filter(tx => matchingIds.has(tx.id));
                    renderTransactions(filtered);
                } else {
                    alert('AI search failed: ' + (data.error || 'Unknown error'));
                    renderTransactions(transactions); // Show all on error
                }

            } catch (err) {
                alert('An error occurred while contacting the AI search service.');
                renderTransactions(transactions);
            } finally {
                aiSearchBtn.innerHTML = originalBtnContent;
                aiSearchBtn.disabled = false;
            }
        });
    }
}

// Bulk Actions Logic
if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', () => {
        const visibleCheckboxes = document.querySelectorAll('.dashboard-table tbody tr:not([style*="display: none"]) input[type="checkbox"]');
        visibleCheckboxes.forEach(checkbox => {
            const tr = checkbox.closest('tr');
            const txId = parseInt(tr.dataset.transactionId, 10);
            if (checkbox.checked !== selectAllCheckbox.checked) {
                checkbox.checked = selectAllCheckbox.checked;
                if (selectAllCheckbox.checked) {
                    selectedTransactionIds.add(txId);
                    tr.classList.add('selected');
                } else {
                    selectedTransactionIds.delete(txId);
                    tr.classList.remove('selected');
                }
            }
        });
        updateBulkActionsUI();
    });
}

async function handleBulkDelete() {
    const ids = Array.from(selectedTransactionIds);
    if (ids.length === 0) return;

    try {
        const res = await fetch('http://127.0.0.1:8000/transactions/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: ids })
        });
        const data = await res.json();
        if (data.success) {
            selectedTransactionIds.clear();
            await fetchTransactions();
        } else {
            alert('Bulk delete failed: ' + (data.error || 'Unknown error'));
        }
    } catch (err) {
        alert('An error occurred during bulk delete.');
    }
}

async function handleBulkCopy() {
    const ids = Array.from(selectedTransactionIds);
    if (ids.length === 0) return;

    try {
        const res = await fetch('http://127.0.0.1:8000/transactions/bulk-copy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: ids })
        });
        const data = await res.json();
        if (data.success) {
            selectedTransactionIds.clear();
            await fetchTransactions();
        } else {
            alert('Bulk copy failed: ' + (data.error || 'Unknown error'));
        }
    } catch (err) {
        alert('An error occurred during bulk copy.');
    }
}

if (bulkDeleteBtn) bulkDeleteBtn.addEventListener('click', handleBulkDelete);
if (bulkCopyBtn) bulkCopyBtn.addEventListener('click', handleBulkCopy);

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
      updateBulkActionsUI();
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

async function duplicateTransaction(transactionId) {
    const originalTx = transactions.find(tx => tx.id === transactionId);
    if (!originalTx) {
        alert('Could not find the transaction to duplicate.');
        return;
    }

    const duplicatedTxPayload = {
        ...originalTx,
        email: localStorage.getItem('fundify_user_email')
    };
    delete duplicatedTxPayload.id; // Remove ID to allow DB to create a new one

    try {
        const res = await fetch('http://127.0.0.1:8000/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(duplicatedTxPayload)
        });
        const data = await res.json();
        if (data.success && data.transaction) {
            const originalIndex = transactions.findIndex(t => t.id === transactionId);
            if (originalIndex !== -1) {
                transactions.splice(originalIndex + 1, 0, data.transaction);
                renderTransactions(); // Re-render with the new local array
                updateBalance();
            } else {
                await fetchTransactions(); // Fallback if index isn't found
            }
        } else {
            alert(data.error || 'Failed to duplicate transaction.');
        }
    } catch(err) {
        alert('Server error while duplicating transaction.');
    }
}

function renderTransactions(transactionsToRender = transactions) {
  const tbody = document.querySelector('.dashboard-table tbody');
  tbody.innerHTML = '';
  transactionsToRender.forEach((tx) => {
    const tr = document.createElement('tr');
    tr.dataset.transactionId = tx.id;
    
    // Check if this transaction is selected
    if (selectedTransactionIds.has(tx.id)) {
        tr.classList.add('selected');
    }

    tr.innerHTML = `
      <td><input type="checkbox" ${selectedTransactionIds.has(tx.id) ? 'checked' : ''}></td>
      <td>${transactions.indexOf(tx) + 1}</td>
      <td>${tx.date}</td>
      <td>${tx.type}</td>
      <td>$${parseFloat(tx.amount).toFixed(2)}</td>
      <td>${tx.store}</td>
      <td>${tx.method}</td>
      <td class="transaction-menu-cell">
        <button class="transaction-menu-btn">⋮</button>
        <div class="transaction-menu-dropdown">
          <button class="edit-tx-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v120q-23 5-43 16t-37 28L480-237v157H240Zm320 0v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T903-300L683-80H560Zm263-224 37-39-37-37-38 38 38 38ZM520-600h200L520-800l200 200-200-200v200Z"/></svg>Edit</button>
          <button class="duplicate-tx-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M160-40q-33 0-56.5-23.5T80-120v-560h80v560h440v80H160Zm160-160q-33 0-56.5-23.5T240-280v-560q0-33 23.5-56.5T320-920h280l240 240v400q0 33-23.5 56.5T760-200H320Zm240-440h200L560-840v200Z"/></svg>Copy</button>
          <button class="delete-tx-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>Delete</button>
        </div>
      </td>
    `;
    
    tbody.appendChild(tr);
  });
}

function cancelEdit(tr) {
    if (!tr || !tr.classList.contains('editing')) return;
    
    // Restore the original HTML content of the cells
    const originalValues = JSON.parse(tr.dataset.originalValues);
    tr.cells[2].innerHTML = originalValues.date;
    tr.cells[3].innerHTML = originalValues.type;
    tr.cells[4].innerHTML = originalValues.amount;
    tr.cells[5].innerHTML = originalValues.store;
    tr.cells[6].innerHTML = originalValues.method;
    tr.cells[7].innerHTML = originalValues.menu;

    // Remove editing state and data attributes
    tr.classList.remove('editing');
    tr.removeAttribute('data-original-values');
}

function toggleEditMode(tr, transaction) {
    const isEditing = tr.classList.contains('editing');

    // First, cancel any other rows that are currently being edited.
    document.querySelectorAll('tr.editing').forEach(otherTr => {
        if (otherTr !== tr) {
            cancelEdit(otherTr);
        }
    });

    if (isEditing) {
        cancelEdit(tr);
        return;
    }
    
    // Enter edit mode
    tr.classList.add('editing');
    tr.dataset.transactionId = transaction.id;

    // Store original innerHTML
    tr.dataset.originalValues = JSON.stringify({
        date: tr.cells[2].innerHTML,
        type: tr.cells[3].innerHTML,
        amount: tr.cells[4].innerHTML,
        store: tr.cells[5].innerHTML,
        method: tr.cells[6].innerHTML,
        menu: tr.cells[7].innerHTML,
    });

    // Replace cells with editable components
    // Date (Cell 2)
    tr.cells[2].innerHTML = `<div class="custom-date-picker edit-datepicker"><input type="text" class="edit-input" value="${transaction.date}" readonly><span class="calendar-icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z"/></svg></span><div class="calendar-popup"></div></div>`;
    setupCustomDatePickerForRow(tr.cells[2].querySelector('.custom-date-picker'));

    // Type (Cell 3)
    tr.cells[3].innerHTML = `<div class="custom-dropdown edit-dropdown"><button type="button" class="dropdown-selected" data-value="${transaction.type}">${transaction.type}</button><ul class="dropdown-list"><li data-value="Withdrawal">Withdrawal</li><li data-value="Deposit">Deposit</li></ul></div>`;
    setupCustomDropdownForRow(tr.cells[3].querySelector('.custom-dropdown'));
    
    // Amount (Cell 4)
    tr.cells[4].innerHTML = `<input type="number" class="edit-input" value="${transaction.amount.toFixed(2)}" step="0.01">`;
    
    // Store/Source (Cell 5)
    tr.cells[5].innerHTML = `<input type="text" class="edit-input" value="${transaction.store}">`;
    
    // Method (Cell 6)
    tr.cells[6].innerHTML = `<div class="custom-dropdown edit-dropdown"><button type="button" class="dropdown-selected" data-value="${transaction.method}">${transaction.method}</button><ul class="dropdown-list"><li data-value="Credit">Credit</li><li data-value="Debit">Debit</li><li data-value="Cash">Cash</li><li data-value="Check">Check</li></ul></div>`;
    setupCustomDropdownForRow(tr.cells[6].querySelector('.custom-dropdown'));
    
    tr.cells[7].innerHTML = ''; // Clear menu cell

    tr.querySelectorAll('.edit-input').forEach(input => {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') saveTransaction(tr, transaction.id);
            if (e.key === 'Escape') cancelEdit(tr);
        });
    });

    tr.cells[4].querySelector('input').focus();
}

async function saveTransaction(tr, transactionId) {
    const dateInput = tr.cells[2].querySelector('.edit-input');
    const typeSelect = tr.cells[3].querySelector('.dropdown-selected');
    const amountInput = tr.cells[4].querySelector('input');
    const storeInput = tr.cells[5].querySelector('input');
    const methodSelect = tr.cells[6].querySelector('.dropdown-selected');

    if (!dateInput.value || !amountInput.value || !storeInput.value) {
        alert('All fields must be filled out.');
        return;
    }
    
    const updatedTx = {
        date: dateInput.value,
        type: typeSelect.dataset.value,
        amount: parseFloat(amountInput.value),
        store: storeInput.value,
        method: methodSelect.dataset.value
    };

    try {
        const res = await fetch(`http://127.0.0.1:8000/transactions/${transactionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTx)
        });
        const data = await res.json();
        if (data.success) {
            await fetchTransactions();
        } else {
            alert(data.error || 'Failed to save transaction.');
            cancelEdit(tr);
        }
    } catch(err) {
        alert('Server error while saving transaction.');
        cancelEdit(tr);
    }
}

function setupCustomDropdownForRow(dropdownEl) {
    const selected = dropdownEl.querySelector('.dropdown-selected');
    const list = dropdownEl.querySelector('.dropdown-list');
    
    selected.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const wasOpen = dropdownEl.classList.contains('open');
        
        // Close all other dropdowns
        document.querySelectorAll('.custom-dropdown.open').forEach(d => d.classList.remove('open'));
        
        if (!wasOpen) {
            const selectedRect = selected.getBoundingClientRect();
            // Position the list relative to the viewport
            list.style.top = `${selectedRect.bottom + 2}px`; // Add a small gap
            list.style.left = `${selectedRect.left}px`;
            list.style.width = `${selectedRect.width}px`;
            dropdownEl.classList.add('open');
        }
    });

    list.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            selected.textContent = li.textContent;
            selected.dataset.value = li.dataset.value;
            dropdownEl.classList.remove('open');
        });
    });
}

function setupCustomDatePickerForRow(pickerEl) {
    const input = pickerEl.querySelector('input');
    const popup = pickerEl.querySelector('.calendar-popup');

    function formatDate(date) {
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
    }

    function renderCalendar(currentDate) {
        const year = currentDate.getFullYear(), month = currentDate.getMonth();
        let html = `<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><button type='button' class='cal-prev'>&lt;</button><span style='font-weight:600;'>${currentDate.toLocaleString('default', { month: 'long' })} ${year}</span><button type='button' class='cal-next'>&gt;</button></div><div style='display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;font-size:0.95em;color:#bfc6e0;'>${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => `<span>${d}</span>`).join('')}</div><div class='calendar-grid-days'>`;
        const firstDay = new Date(year, month, 1);
        for (let i = 0; i < firstDay.getDay(); i++) html += '<span></span>';
        const lastDay = new Date(year, month + 1, 0).getDate();
        for (let d = 1; d <= lastDay; d++) {
            const thisDate = new Date(year, month, d);
            html += `<button type='button' class='cal-day' data-date='${formatDate(thisDate)}'>${d}</button>`;
        }
        html += "</div>";
        popup.innerHTML = html;
        popup.querySelector('.cal-prev').onclick = () => renderCalendar(new Date(year, month - 1, 1));
        popup.querySelector('.cal-next').onclick = () => renderCalendar(new Date(year, month + 1, 1));
        popup.querySelectorAll('.cal-day').forEach(btn => {
            btn.onclick = () => {
                input.value = btn.dataset.date;
                pickerEl.classList.remove('open');
            };
        });
    }

    const toggle = () => {
        const wasOpen = pickerEl.classList.contains('open');

        // Close all other pickers/dropdowns
        document.querySelectorAll('.custom-date-picker.open, .custom-dropdown.open').forEach(el => el.classList.remove('open'));
        
        if (!wasOpen) {
            renderCalendar(input.value ? new Date(input.value) : new Date());
            const inputRect = input.getBoundingClientRect();
            popup.style.top = `${inputRect.bottom + 2}px`;
            popup.style.left = `${inputRect.left}px`;
            pickerEl.classList.add('open');
        }
    };

    input.addEventListener('click', e => e.stopPropagation());
    pickerEl.querySelector('.calendar-icon').addEventListener('click', e => {
        e.stopPropagation();
        toggle();
    });
}

// --- Voice Recognition Logic ---
const startVoiceBtn = document.getElementById('start-voice-recognition');
const startVoiceBtnPreset = document.getElementById('start-voice-recognition-preset');
const voiceUi = document.getElementById('voice-recognition-ui');
const stopVoiceBtn = document.getElementById('stop-voice-recognition');
const cancelVoiceBtn = document.getElementById('cancel-voice-recognition');
const quickTransactionPromptEl = document.querySelector('.quick-transaction-prompt');
const quickTransactionFormEl = document.querySelector('.quick-transaction-content form');
const quickPresetPromptEl = document.querySelector('.quick-preset-prompt');
const quickPresetFormEl = document.querySelector('.quick-preset-content form');
const waveformContainer = document.getElementById('waveform-container');
const voiceStatusText = document.getElementById('voice-status-text');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let silenceTimer = null;
let currentVoiceContext = {};
let finalTranscriptForSession = '';

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
        voiceStatusText.textContent = 'Listening...';
        clearTimeout(silenceTimer);
        finalTranscriptForSession = '';
    };

    recognition.onresult = (event) => {
        // We no longer update the input field here.
        // We just build the transcript in the background and reset the silence timer.
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcriptPart + ' ';
            }
        }
        finalTranscriptForSession = finalTranscript;
        
        // Reset silence timer on any speech
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
            stopRecognition(true); // Auto-submit after 3s of silence
        }, 3000);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            voiceStatusText.textContent = 'Microphone access denied.';
        } else if (event.error === 'network') {
            voiceStatusText.textContent = 'Network error. Please check connection.';
        } else {
            voiceStatusText.textContent = 'Error. Please try again.';
        }
        clearTimeout(silenceTimer);
        // Do not auto-close UI on error, so user can see the message.
    };

    recognition.onend = () => {
        clearTimeout(silenceTimer);
        voiceUi.classList.remove('active');
    };
}

function startRecognition(context) {
    if (!SpeechRecognition) {
        alert("Sorry, your browser doesn't support voice recognition.");
        return;
    }
    currentVoiceContext = context;
    voiceUi.classList.add('active');
    if (currentVoiceContext.promptEl) {
        currentVoiceContext.promptEl.value = ''; // Clear previous text
    }
    voiceStatusText.textContent = "Listening..."; // Reset status text
    try {
        recognition.start();
    } catch (e) {
        console.error("Could not start recognition:", e);
        voiceStatusText.textContent = 'Error starting.';
    }
}

function stopRecognition(shouldSubmit) {
    if (recognition) {
        recognition.stop();
    }
    if (shouldSubmit && currentVoiceContext.promptEl) {
        currentVoiceContext.promptEl.value = finalTranscriptForSession.trim();
        if (currentVoiceContext.promptEl.value.trim() && currentVoiceContext.formEl) {
            currentVoiceContext.formEl.querySelector('button[type="submit"]').click();
        }
    }
}

if (startVoiceBtn) {
    startVoiceBtn.addEventListener('click', () => {
        startRecognition({
            promptEl: quickTransactionPromptEl,
            formEl: quickTransactionFormEl
        });
    });
}

if (startVoiceBtnPreset) {
    startVoiceBtnPreset.addEventListener('click', () => {
        startRecognition({
            promptEl: quickPresetPromptEl,
            formEl: quickPresetFormEl
        });
    });
}

if(stopVoiceBtn) stopVoiceBtn.addEventListener('click', () => stopRecognition(true));
if(cancelVoiceBtn) cancelVoiceBtn.addEventListener('click', () => stopRecognition(false));

document.addEventListener('keydown', (e) => {
    if (voiceUi.classList.contains('active')) {
        if (e.code === 'Space') {
            e.preventDefault();
            stopRecognition(true);
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            stopRecognition(false);
        }
    }
});

// Generate waveform bars
if (waveformContainer) {
    for (let i = 0; i < 50; i++) {
        const bar = document.createElement('div');
        bar.className = 'waveform-bar';
        bar.style.animationDelay = `${Math.random() * -1.2}s`;
        waveformContainer.appendChild(bar);
    }
}

// On page load, fetch transactions
fetchTransactions();
fetchPresets();

const tableBody = document.querySelector('.dashboard-table tbody');
if (tableBody) {
    tableBody.addEventListener('click', (e) => {
        const target = e.target;

        // Handle checkbox clicks for selection
        if (target.type === 'checkbox') {
            handleSelection(e);
            return; // Stop further processing for checkbox clicks
        }

        const menuBtn = target.closest('.transaction-menu-btn');
        if (menuBtn) {
            e.stopPropagation();
            const tr = menuBtn.closest('tr');
            if (tr.classList.contains('editing')) return; // Don't open menu in edit mode
            
            const dropdown = tr.querySelector('.transaction-menu-dropdown');
            const wasOpen = dropdown.classList.contains('show');

            // Close all other menus
            document.querySelectorAll('.transaction-menu-dropdown.show').forEach(d => {
                d.classList.remove('show');
            });
            
            if (!wasOpen) {
                const btnRect = menuBtn.getBoundingClientRect();
                dropdown.classList.add('show');
                dropdown.style.top = `${btnRect.bottom}px`;
                dropdown.style.left = `${btnRect.right - dropdown.offsetWidth}px`;
            }
            return;
        }

        const editBtn = target.closest('.edit-tx-btn');
        if (editBtn) {
            e.stopPropagation();
            const tr = editBtn.closest('tr');
            const transactionId = parseInt(tr.dataset.transactionId, 10);
            const transaction = transactions.find(tx => tx.id === transactionId);
            if (transaction) {
                toggleEditMode(tr, transaction);
            }
            return;
        }

        const deleteBtn = target.closest('.delete-tx-btn');
        if (deleteBtn) {
            e.stopPropagation();
            const tr = deleteBtn.closest('tr');
            const transactionId = parseInt(tr.dataset.transactionId, 10);
            if (!isNaN(transactionId)) {
                deleteTransaction(transactionId);
            }
            return;
        }

        const duplicateBtn = target.closest('.duplicate-tx-btn');
        if (duplicateBtn) {
            e.stopPropagation();
            const tr = duplicateBtn.closest('tr');
            const transactionId = parseInt(tr.dataset.transactionId, 10);
            if (!isNaN(transactionId)) {
                duplicateTransaction(transactionId);
            }
            return;
        }
    });
}

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

    // Close custom dropdowns in table rows
    const openEditDropdown = document.querySelector('tr.editing .custom-dropdown.open');
    if (openEditDropdown && !openEditDropdown.contains(e.target)) {
        openEditDropdown.classList.remove('open');
    }

    // Close custom date pickers in table rows
    const openEditDatepicker = document.querySelector('tr.editing .custom-date-picker.open');
    if (openEditDatepicker && !openEditDatepicker.contains(e.target)) {
        openEditDatepicker.classList.remove('open');
        openEditDatepicker.querySelector('.calendar-popup').style.display = 'none';
    }

    // Cancel editing if clicking outside an editing row
    const editingTr = document.querySelector('tr.editing');
    if (editingTr && !editingTr.contains(e.target)) {
        // Check if the click was inside a calendar popup that belongs to the row
        let calendarClick = false;
        if(e.target.closest('.calendar-popup')) {
           if(editingTr.querySelector('.calendar-popup').contains(e.target.closest('.calendar-popup'))) {
               calendarClick = true;
           }
        }
        if(!calendarClick) {
            cancelEdit(editingTr);
        }
    }
});