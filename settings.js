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
          <label>Name</label>
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
      <div class="settings-account-actions" style="margin-top:30px;display:flex;gap:16px;">
        <button id="logout-btn" class="settings-edit-btn" style="background:#444a54; color:#fff;">Log out</button>
        <button id="delete-account-btn" class="settings-cancel-btn" style="background:#ff4d4f; color:#fff;">Delete account</button>
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
    // Add logout and delete account logic
    const logoutBtn = contentDiv.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('fundify_user_email');
        window.location.href = 'sign-in.html';
      });
    }
    const deleteBtn = contentDiv.querySelector('#delete-account-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async function() {
        if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
        const email = localStorage.getItem('fundify_user_email');
        if (!email) return;
        deleteBtn.disabled = true;
        deleteBtn.textContent = 'Deleting...';
        try {
          const res = await fetch('http://localhost:8000/delete-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const data = await res.json();
          if (data.success) {
            localStorage.removeItem('fundify_user_email');
            window.location.href = 'sign-in.html';
          } else {
            alert(data.error || 'Failed to delete account.');
          }
        } catch {
          alert('Server error. Please try again.');
        }
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Delete account';
      });
    }
  }

  async function renderSecuritySection() {
    contentDiv.innerHTML = `
      <div class=\"settings-content-title\" style=\"display:flex;align-items:center;font-size:1.3rem;font-weight:600;margin-bottom:32px;\">
        <span style='display:inline-flex;align-items:center;'>
          <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20px\" viewBox=\"0 -960 960 960\" width=\"20px\" fill=\"currentColor\"><path d=\"M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z\"/></svg>
        </span>
        <span style='margin-left:14px;'>Security</span>
      </div>
      <div class=\"settings-security-fields\">\n        <div class=\"settings-field-row\">\n          <label>2-Step Verification</label>\n          <label class=\"switch\">\n            <input type=\"checkbox\" id=\"twofa-toggle\">\n            <span class=\"slider round\"></span>\n          </label>\n        </div>\n        <div id=\"twofa-message\" style=\"color:var(--text-muted);margin-top:12px;\"></div>\n        <div class=\"settings-field-row\" style=\"margin-top:32px;\">\n          <label>Require password to view transactions</label>\n          <label class=\"switch\">\n            <input type=\"checkbox\" id=\"require-password-toggle\">\n            <span class=\"slider round\"></span>\n          </label>\n        </div>\n        <div id=\"require-password-message\" style=\"color:var(--text-muted);margin-top:12px;\"></div>\n        <div class=\"settings-fundai-access-label\">Disable FundAI's access to:</div>\n        <div class=\"settings-fundai-access-group\">\n          <div class=\"settings-field-row settings-fundai-access-row\">\n            <label>Transactions</label>\n            <label class=\"switch\">\n              <input type=\"checkbox\" id=\"disable-fundai-transactions-toggle\">\n              <span class=\"slider round\"></span>\n            </label>\n          </div>\n          <div class=\"settings-field-row settings-fundai-access-row\">\n            <label>Reminders</label>\n            <label class=\"switch\">\n              <input type=\"checkbox\" id=\"disable-fundai-reminders-toggle\">\n              <span class=\"slider round\"></span>\n            </label>\n          </div>\n        </div>\n        <div id=\"disable-fundai-message\" style=\"color:var(--text-muted);margin-top:12px;\"></div>\n      </div>\n    `;

    // Fetch user info to get 2FA, require-password, and FundAI disable status
    const user = await fetchUserInfo();
    if (!user) return;
    const toggle = contentDiv.querySelector('#twofa-toggle');
    // Set toggle state based on DB value
    toggle.checked = !!user.two_factor_enabled;

    toggle.addEventListener('change', async function() {
      const msg = contentDiv.querySelector('#twofa-message');
      msg.textContent = '';
      toggle.disabled = true;
      let url = toggle.checked ? 'enable-2fa' : 'disable-2fa';
      try {
        const res = await fetch(`http://localhost:8000/${url}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
        const data = await res.json();
        if (data.success) {
          toggle.checked = url === 'enable-2fa';
          msg.textContent = toggle.checked
            ? '2-step verification is now enabled. You will be asked for a code when signing in.'
            : '2-step verification is now disabled.';
        } else {
          msg.textContent = data.error || 'Failed to update 2FA status.';
          toggle.checked = !toggle.checked; // revert
        }
      } catch {
        msg.textContent = 'Server error. Please try again.';
        toggle.checked = !toggle.checked; // revert
      }
      toggle.disabled = false;
    });

    // Require password toggle logic
    const requirePwToggle = contentDiv.querySelector('#require-password-toggle');
    requirePwToggle.checked = !!user.require_password_for_transactions;
    requirePwToggle.addEventListener('change', async function() {
      const msg = contentDiv.querySelector('#require-password-message');
      msg.textContent = '';
      requirePwToggle.disabled = true;
      try {
        const res = await fetch('http://localhost:8000/update-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, field: 'require_password_for_transactions', value: requirePwToggle.checked })
        });
        const data = await res.json();
        if (data.success) {
          msg.textContent = requirePwToggle.checked
            ? 'Password will be required to view transactions.'
            : 'Password is no longer required to view transactions.';
        } else {
          msg.textContent = data.error || 'Failed to update setting.';
          requirePwToggle.checked = !requirePwToggle.checked; // revert
        }
      } catch {
        msg.textContent = 'Server error. Please try again.';
        requirePwToggle.checked = !requirePwToggle.checked; // revert
      }
      requirePwToggle.disabled = false;
    });

    // FundAI disable toggles
    const disableTxToggle = contentDiv.querySelector('#disable-fundai-transactions-toggle');
    const disableRemToggle = contentDiv.querySelector('#disable-fundai-reminders-toggle');
    disableTxToggle.checked = !!user.disable_fundai_transactions;
    disableRemToggle.checked = !!user.disable_fundai_reminders;
    [
      { toggle: disableTxToggle, field: 'disable_fundai_transactions', label: 'transactions' },
      { toggle: disableRemToggle, field: 'disable_fundai_reminders', label: 'reminders' }
    ].forEach(({ toggle, field, label }) => {
      toggle.addEventListener('change', async function() {
        const msg = contentDiv.querySelector('#disable-fundai-message');
        msg.textContent = '';
        toggle.disabled = true;
        try {
          const res = await fetch('http://localhost:8000/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, field, value: toggle.checked })
          });
          const data = await res.json();
          if (data.success) {
            msg.textContent = toggle.checked
              ? `FundAI will not have access to your ${label}.`
              : `FundAI can now access your ${label}.`;
          } else {
            msg.textContent = data.error || `Failed to update FundAI ${label} access.`;
            toggle.checked = !toggle.checked; // revert
          }
        } catch {
          msg.textContent = 'Server error. Please try again.';
          toggle.checked = !toggle.checked; // revert
        }
        toggle.disabled = false;
      });
    });
  }

  async function renderNotificationsSection() {
    contentDiv.innerHTML = `<div class="settings-content-title" style="display:flex;align-items:center;font-size:1.3rem;font-weight:600;margin-bottom:32px;"><span style='display:inline-flex;align-items:center;'><svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20px\" viewBox=\"0 -960 960 960\" width=\"20px\" fill=\"currentColor\"><path d=\"M192-216v-72h48v-240q0-87 53.5-153T432-763v-53q0-20 14-34t34-14q20 0 34 14t14 34v53q85 16 138.5 82T720-528v240h48v72H192ZM479.79-96Q450-96 429-117.15T408-168h144q0 30-21.21 51t-51 21Z\"/></svg></span><span style='margin-left:14px;'>Notifications</span></div>
      <div class="settings-notifications-fields">
        <div class="settings-field-row">
          <label>Disable reminder notifications</label>
          <label class="switch">
            <input type="checkbox" id="disable-reminder-notifications-toggle">
            <span class="slider round"></span>
          </label>
        </div>
        <div id="notifications-message" style="color:var(--text-muted);margin-top:12px;"></div>
      </div>`;
    // Fetch user info to get notification setting
    const user = await fetchUserInfo();
    if (!user) return;
    const toggle = contentDiv.querySelector('#disable-reminder-notifications-toggle');
    // Set toggle state based on DB value
    toggle.checked = !!user.disable_reminder_notifications;
    toggle.addEventListener('change', async function() {
      const msg = contentDiv.querySelector('#notifications-message');
      msg.textContent = '';
      toggle.disabled = true;
      try {
        const res = await fetch('http://localhost:8000/update-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, field: 'disable_reminder_notifications', value: toggle.checked })
        });
        const data = await res.json();
        if (data.success) {
          msg.textContent = toggle.checked
            ? 'Reminder notifications are now disabled.'
            : 'Reminder notifications are enabled.';
        } else {
          msg.textContent = data.error || 'Failed to update notification setting.';
          toggle.checked = !toggle.checked; // revert
        }
      } catch {
        msg.textContent = 'Server error. Please try again.';
        toggle.checked = !toggle.checked; // revert
      }
      toggle.disabled = false;
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
    } else if (index === 1) {
      renderNotificationsSection();
    } else if (index === 2) {
      renderSecuritySection();
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
