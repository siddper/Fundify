// Modal logic
const openBtn = document.getElementById('openAddModal');
const closeBtn = document.getElementById('closeAddModal');
const cancelBtn = document.getElementById('cancelAddModal');
const modalBg = document.getElementById('addModal');

if (openBtn && closeBtn && modalBg) {
  openBtn.addEventListener('click', () => {
    // Autofill date and time to today and now
    const dateInput = document.getElementById('reminder-date-input');
    const timeInput = document.getElementById('reminder-time-input');
    if (dateInput) {
      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const yyyy = today.getFullYear();
      dateInput.value = `${mm}/${dd}/${yyyy}`;
    }
    if (timeInput) {
      const now = new Date();
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      timeInput.value = `${String(h).padStart(2, '0')}:${m} ${ampm}`;
    }
    modalBg.classList.add('active');
  });
  closeBtn.addEventListener('click', () => {
    modalBg.classList.remove('active');
  });
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      modalBg.classList.remove('active');
    });
  }
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

// Custom Date Picker (reuse dashboard.js logic)
function setupCustomDatePicker() {
  const picker = document.getElementById('reminder-date-picker');
  const input = document.getElementById('reminder-date-input');
  const popup = document.getElementById('reminder-calendar-popup');
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
  popup.addEventListener('click', e => e.stopPropagation());
}
setupCustomDatePicker();

// Custom Time Picker
function setupCustomTimePicker() {
  const picker = document.getElementById('reminder-time-picker');
  const input = document.getElementById('reminder-time-input');
  const popup = document.getElementById('reminder-time-popup');
  const icon = picker ? picker.querySelector('.clock-icon') : null;
  if (!picker || !input || !popup || !icon) return;

  // Force full width for input and parent
  picker.style.width = '100%';
  input.style.width = '100%';

  function pad(n) { return n.toString().padStart(2, '0'); }
  function formatTime(h, m, ampm) {
    return `${pad(h)}:${pad(m)} ${ampm}`;
  }

  function renderTimeOptions() {
    // Parse current value if present
    let h = '', m = '', ampm = '';
    const val = input.value.trim();
    if (/^(\d{1,2}):(\d{2}) (AM|PM)$/i.test(val)) {
      const match = val.match(/(\d{1,2}):(\d{2}) (AM|PM)/i);
      h = match[1]; m = match[2]; ampm = match[3].toUpperCase();
    }
    let html = `<div style='display:flex;gap:8px;align-items:center;'>`;
    html += `<input type='text' id='time-hour' maxlength='2' inputmode='numeric' pattern='[0-9]*' placeholder='hh' value='${h}' style='width:3.5em;height:2.5em;font-size:1.3rem;border-radius:10px;border:2px solid #444;background:#23262a;color:#fff;text-align:center;margin-right:6px;box-sizing:border-box;'>`;
    html += ` : `;
    html += `<input type='text' id='time-minute' maxlength='2' inputmode='numeric' pattern='[0-9]*' placeholder='mm' value='${m}' style='width:3.5em;height:2.5em;font-size:1.3rem;border-radius:10px;border:2px solid #444;background:#23262a;color:#fff;text-align:center;margin-right:6px;box-sizing:border-box;'>`;
    html += `<input type='text' id='time-ampm' maxlength='2' placeholder='AM' value='${ampm}' style='width:3.5em;height:2.5em;font-size:1.3rem;border-radius:10px;border:2px solid #444;background:#23262a;color:#fff;text-align:center;box-sizing:border-box;text-transform:uppercase;'>`;
    html += `</div>`;
    html += `<button type='button' id='set-time-btn' style='margin-top:16px;width:100%;background:var(--accent);color:#fff;border:none;border-radius:8px;padding:12px 0;font-weight:600;cursor:pointer;font-size:1.1rem;'>Set Time</button>`;
    // Instead of popup.innerHTML = html, use the .time-popup div
    const popupDiv = document.getElementById('reminder-time-popup');
    if (popupDiv) popupDiv.innerHTML = html;

    // Validation logic
    function validateHour(val) {
      const n = parseInt(val, 10);
      return !isNaN(n) && n >= 1 && n <= 12;
    }
    function validateMinute(val) {
      const n = parseInt(val, 10);
      return !isNaN(n) && n >= 0 && n <= 59 && val.length === 2;
    }
    function validateAMPM(val) {
      return /^(AM|PM)$/i.test(val);
    }
    function clearIfInvalid(input, validator) {
      input.addEventListener('blur', () => {
        if (!validator(input.value.trim())) input.value = '';
      });
    }
    const hourInput = document.getElementById('time-hour');
    const minuteInput = document.getElementById('time-minute');
    const ampmInput = document.getElementById('time-ampm');
    clearIfInvalid(hourInput, validateHour);
    clearIfInvalid(minuteInput, validateMinute);
    clearIfInvalid(ampmInput, validateAMPM);
    ampmInput.addEventListener('input', () => {
      ampmInput.value = ampmInput.value.toUpperCase();
    });

    const setTimeBtn = document.getElementById('set-time-btn');
    [hourInput, minuteInput, ampmInput].forEach(inputEl => {
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          setTimeBtn.click();
        }
      });
    });

    setTimeBtn.onclick = () => {
      const h = hourInput.value.trim();
      const m = minuteInput.value.trim();
      const ampm = ampmInput.value.trim().toUpperCase();
      if (validateHour(h) && validateMinute(m) && validateAMPM(ampm)) {
        input.value = formatTime(h, m, ampm);
        input.classList.remove('incorrect');
        picker.classList.remove('open');
      } else {
        if (!validateHour(h)) hourInput.value = '';
        if (!validateMinute(m)) minuteInput.value = '';
        if (!validateAMPM(ampm)) ampmInput.value = '';
      }
    };
  }

  // Open on input or icon click
  function openPicker(e) {
    e.stopPropagation();
    picker.classList.toggle('open');
    if (picker.classList.contains('open')) {
      renderTimeOptions();
    }
  }
  input.addEventListener('click', openPicker);
  icon.addEventListener('click', openPicker);
  icon.setAttribute('tabindex', '-1');
  icon.setAttribute('aria-hidden', 'true');

  document.addEventListener('click', (e) => {
    if (!picker.contains(e.target)) {
      picker.classList.remove('open');
    }
  });
  popup.addEventListener('click', e => e.stopPropagation());
}
setupCustomTimePicker();

// Reminders logic
const remindersContainer = document.getElementById('reminders-container');
const addReminderForm = document.getElementById('add-reminder-form');
let editingIndex = null;

function getReminders() {
  try {
    return JSON.parse(localStorage.getItem('fundify_reminders') || '[]');
  } catch {
    return [];
  }
}
function saveReminders(reminders) {
  localStorage.setItem('fundify_reminders', JSON.stringify(reminders));
}
function renderReminders() {
  const reminders = getReminders();
  remindersContainer.innerHTML = '';
  if (reminders.length === 0) {
    remindersContainer.innerHTML = '<div style="color:var(--text-muted);font-size:1.1rem;">No reminders yet.</div>';
    return;
  }
  reminders.forEach((reminder, idx) => {
    const card = document.createElement('div');
    card.className = 'reminder-card';
    card.innerHTML = `
      <button class="delete-btn" title="Delete Reminder">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>
      </button>
      <div class="reminder-amount">$${parseFloat(reminder.amount).toFixed(2)}</div>
      <div class="reminder-date-time">${reminder.date} &bull; ${reminder.time}</div>
      <div class="reminder-description">${reminder.description}</div>
    `;
    // Delete button logic
    const delBtn = card.querySelector('.delete-btn');
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const reminders = getReminders();
      reminders.splice(idx, 1);
      saveReminders(reminders);
      renderReminders();
    });
    card.addEventListener('click', () => {
      // Autofill modal with reminder values for editing
      document.getElementById('reminder-amount').value = reminder.amount;
      document.getElementById('reminder-date-input').value = reminder.date;
      document.getElementById('reminder-time-input').value = reminder.time;
      document.getElementById('reminder-description').value = reminder.description;
      editingIndex = idx;
      modalBg.classList.add('active');
    });
    remindersContainer.appendChild(card);
  });
}
renderReminders();

if (addReminderForm) {
  // Remove 'required' attributes from all fields
  ['reminder-amount','reminder-date-input','reminder-time-input','reminder-description'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.removeAttribute('required');
  });

  // Add event listeners to remove 'incorrect' class on input/change
  ['reminder-amount','reminder-date-input','reminder-time-input','reminder-description'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => el.classList.remove('incorrect'));
      el.addEventListener('change', () => el.classList.remove('incorrect'));
      // Add Enter key submit
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addReminderForm.querySelector('.modal-action-btn').click();
        }
      });
    }
  });

  addReminderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('reminder-amount').value.trim();
    const date = document.getElementById('reminder-date-input').value.trim();
    const time = document.getElementById('reminder-time-input').value.trim();
    const description = document.getElementById('reminder-description').value.trim();
    let valid = true;
    // Remove previous error states
    ['reminder-amount','reminder-date-input','reminder-time-input','reminder-description'].forEach(id => {
      document.getElementById(id).classList.remove('incorrect');
    });
    if (!amount) { document.getElementById('reminder-amount').classList.add('incorrect'); valid = false; }
    if (!date) { document.getElementById('reminder-date-input').classList.add('incorrect'); valid = false; }
    if (!time) { document.getElementById('reminder-time-input').classList.add('incorrect'); valid = false; }
    if (!description) { document.getElementById('reminder-description').classList.add('incorrect'); valid = false; }
    if (!valid) return;
    const reminders = getReminders();
    if (editingIndex !== null) {
      // Update existing reminder
      reminders[editingIndex] = { amount, date, time, description };
      editingIndex = null;
    } else {
      reminders.push({ amount, date, time, description });
    }
    saveReminders(reminders);
    renderReminders();
    addReminderForm.reset();
    modalBg.classList.remove('active');
  });

  // Reset editingIndex when modal is closed
  if (closeBtn) closeBtn.addEventListener('click', () => { editingIndex = null; });
  if (cancelBtn) cancelBtn.addEventListener('click', () => { editingIndex = null; });
}
