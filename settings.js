document.addEventListener('DOMContentLoaded', function() {
  const sidebarItems = document.querySelectorAll('.settings-section-item');
  const contentDiv = document.querySelector('.settings-section-content');

  // Helper: fetch user info from backend
  async function fetchUserInfo() {
    // Assume user email is stored in localStorage
    const email = localStorage.getItem('fundify_user_email');
    if (!email) return null;
    try {
      const res = await fetch(`http://localhost:8000/user-info?email=${encodeURIComponent(email)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success) return data.user;
      return null;
    } catch {
      return null;
    }
  }

  // Helper: update user info (field: 'name', 'email', 'password')
  async function updateUserInfo(field, value) {
    const email = localStorage.getItem('fundify_user_email');
    if (!email) return false;
    try {
      const res = await fetch('http://localhost:8000/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, field, value })
      });
      const data = await res.json();
      return data.success;
    } catch {
      return false;
    }
  }

  // Render Account section
  async function renderAccountSection() {
    contentDiv.innerHTML = `<div class="settings-content-title" style="display:flex;align-items:center;font-size:1.3rem;font-weight:600;margin-bottom:32px;"><span style='display:inline-flex;align-items:center;'><svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20px\" viewBox=\"0 -960 960 960\" width=\"20px\" fill=\"currentColor\"><path d=\"M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z\"/></svg></span><span style='margin-left:14px;'>Account</span></div>`;
    const user = await fetchUserInfo();
    if (!user) {
      contentDiv.innerHTML += `<div style='color:var(--text-muted);margin-top:24px;'>Unable to load account info.</div>`;
      return;
    }
    // Render fields
    contentDiv.innerHTML += `
      <div class="settings-account-fields">
        <div class="settings-field-row" data-field="name">
          <label>First Name</label>
          <input type="text" value="${user.name || ''}" readonly />
          <button class="settings-edit-btn">Change name</button>
        </div>
        <div class="settings-field-row" data-field="email">
          <label>Email</label>
          <input type="email" value="${user.email || ''}" readonly />
          <button class="settings-edit-btn">Change email</button>
        </div>
        <div class="settings-field-row" data-field="password">
          <label>Password</label>
          <input type="password" value="********" readonly />
          <button class="settings-edit-btn">Change password</button>
        </div>
      </div>
    `;
    // Add edit logic
    contentDiv.querySelectorAll('.settings-edit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const row = btn.closest('.settings-field-row');
        const input = row.querySelector('input');
        if (btn.textContent.startsWith('Change')) {
          input.readOnly = false;
          input.focus();
          btn.textContent = 'Save';
          // Add cancel button
          let cancelBtn = row.querySelector('.settings-cancel-btn');
          if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.className = 'settings-cancel-btn';
            cancelBtn.textContent = 'Cancel';
            btn.after(cancelBtn);
            cancelBtn.addEventListener('click', () => {
              input.value = row.dataset.field === 'password' ? '********' : user[row.dataset.field] || '';
              input.readOnly = true;
              btn.textContent = `Change ${row.dataset.field}`;
              cancelBtn.remove();
            });
          }
          if (row.dataset.field === 'password') input.value = '';

          // Add Enter key handler for Save
          input.addEventListener('keydown', function handler(e) {
            if (!input.readOnly && (e.key === 'Enter' || e.keyCode === 13)) {
              btn.click();
              e.preventDefault();
            }
            // Remove handler if input becomes readonly again (after save/cancel)
            if (input.readOnly) {
              input.removeEventListener('keydown', handler);
            }
          });
        } else {
          // Save
          let newValue = input.value;
          if (row.dataset.field === 'password' && !newValue) {
            alert('Password cannot be empty.');
            return;
          }
          updateUserInfo(row.dataset.field, newValue).then(success => {
            if (success) {
              input.readOnly = true;
              btn.textContent = `Change ${row.dataset.field}`;
              const cancelBtn = row.querySelector('.settings-cancel-btn');
              if (cancelBtn) cancelBtn.remove();
              if (row.dataset.field !== 'password') user[row.dataset.field] = newValue;
              if (row.dataset.field === 'password') input.value = '********';
              if (row.dataset.field === 'email') {
                localStorage.setItem('fundify_user_email', newValue);
              }
            } else {
              alert('Failed to update.');
            }
          });
        }
      });
    });
  }

  function setActive(index) {
    sidebarItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    // Update content
    if (index === 0) {
      renderAccountSection();
    } else {
      // Update content title with icon and label
      const icon = sidebarItems[index].querySelector('.settings-section-icon').innerHTML;
      const label = sidebarItems[index].querySelector('.settings-section-label').textContent;
      contentDiv.innerHTML = `<div class="settings-content-title" style="display:flex;align-items:center;font-size:1.3rem;font-weight:600;margin-bottom:32px;"><span style='display:inline-flex;align-items:center;'>${icon}</span><span style='margin-left:14px;'>${label}</span></div>`;
    }
  }

  sidebarItems.forEach((item, idx) => {
    item.addEventListener('click', () => setActive(idx));
  });

  // Set initial
  setActive(0);
});
