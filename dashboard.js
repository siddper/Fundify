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

// Sort dropdown stub
const sortDropdown = document.querySelector('.sort-dropdown');
if (sortDropdown) {
  sortDropdown.addEventListener('change', (e) => {
    // Implement sorting logic here
    // e.target.value
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
    html += "</div><div style='display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;margin-top:2px;'>";
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
    html += "</div><div style='display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;margin-top:2px;'>";
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

// --- Transaction List Logic ---
let transactions = [];

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
    } else {
      // Optionally show error
      transactions = [];
      renderTransactions();
    }
  } catch (err) {
    // Optionally show error
    transactions = [];
    renderTransactions();
  }
}

function renderTransactions() {
  const tbody = document.querySelector('.dashboard-table tbody');
  tbody.innerHTML = '';
  transactions.forEach((tx, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox"></td>
      <td>${idx + 1}</td>
      <td>${tx.date}</td>
      <td>${tx.type}</td>
      <td>$${parseFloat(tx.amount).toFixed(2)}</td>
      <td>${tx.store}</td>
      <td>${tx.method}</td>
    `;
    tbody.appendChild(tr);
  });
}

// On page load, fetch transactions
fetchTransactions();

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