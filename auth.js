// Register form handler
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = registerForm.querySelector('#name').value.trim();
    const email = registerForm.querySelector('#email').value.trim();
    const password = registerForm.querySelector('#password').value;
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
    successDiv.textContent = '';
    successDiv.style.display = 'none';

    // Custom validation
    if (!name) {
      errorDiv.textContent = 'Please enter your name.';
      errorDiv.style.display = 'block';
      return;
    }
    if (!email) {
      errorDiv.textContent = 'Please enter your email address.';
      errorDiv.style.display = 'block';
      return;
    }
    // Simple email regex
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      errorDiv.textContent = 'Please enter a valid email address.';
      errorDiv.style.display = 'block';
      return;
    }
    if (!password) {
      errorDiv.textContent = 'Please enter a password.';
      errorDiv.style.display = 'block';
      return;
    }
    if (password.length < 6) {
      errorDiv.textContent = 'Password must be at least 6 characters.';
      errorDiv.style.display = 'block';
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!data.success) {
        errorDiv.textContent = data.error || 'Registration failed.';
        errorDiv.style.display = 'block';
      } else {
        errorDiv.style.display = 'none';
        successDiv.textContent = 'Account created! Redirecting...';
        successDiv.style.display = 'block';
        setTimeout(() => {
          successDiv.style.display = 'none';
          window.location.href = 'sign-in.html';
        }, 2000);
      }
    } catch (err) {
      errorDiv.textContent = 'Server error. Please try again.';
      errorDiv.style.display = 'block';
    }
  });
}

// Login form handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('#email').value.trim();
    const password = loginForm.querySelector('#password').value;
    const errorDiv = document.getElementById('login-error');
    const successDiv = document.getElementById('login-success');
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
    successDiv.textContent = '';
    successDiv.style.display = 'none';

    // Custom validation
    if (!email) {
      errorDiv.textContent = 'Please enter your email address.';
      errorDiv.style.display = 'block';
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      errorDiv.textContent = 'Please enter a valid email address.';
      errorDiv.style.display = 'block';
      return;
    }
    if (!password) {
      errorDiv.textContent = 'Please enter your password.';
      errorDiv.style.display = 'block';
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success) {
        errorDiv.textContent = data.error || 'Login failed.';
        errorDiv.style.display = 'block';
      } else {
        errorDiv.style.display = 'none';
        successDiv.textContent = 'Signed in! Redirecting...';
        successDiv.style.display = 'block';
        setTimeout(() => {
          successDiv.style.display = 'none';
          window.location.href = 'dashboard.html';
        }, 1500);
      }
    } catch (err) {
      errorDiv.textContent = 'Server error. Please try again.';
      errorDiv.style.display = 'block';
    }
  });
}

// Password feedback rules
function validatePassword(password, name, email) {
  const feedback = [];
  let valid = true;
  // Not contain name or email
  const lower = password.toLowerCase();
  if (name && lower.includes(name.toLowerCase())) {
    feedback.push({msg: 'Cannot contain your name', ok: false});
    valid = false;
  } else if (email && lower.includes(email.toLowerCase().split('@')[0])) {
    feedback.push({msg: 'Cannot contain your email address', ok: false});
    valid = false;
  } else {
    feedback.push({msg: 'Cannot contain your name or email address', ok: true});
  }
  // At least 8 characters
  if (password.length >= 8) {
    feedback.push({msg: 'At least 8 characters', ok: true});
  } else {
    feedback.push({msg: 'At least 8 characters', ok: false});
    valid = false;
  }
  // Contains number or symbol
  if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push({msg: 'Contains a number or symbol', ok: true});
  } else {
    feedback.push({msg: 'Contains a number or symbol', ok: false});
    valid = false;
  }
  // Strength
  let strength = 'weak';
  if (valid && password.length >= 12) strength = 'strong';
  else if (valid) strength = 'medium';
  return {feedback, strength};
}

// Real-time password feedback for create-account.html
const registerForm2 = document.getElementById('register-form');
if (registerForm2) {
  const passwordInput = registerForm2.querySelector('#password');
  const nameInput = registerForm2.querySelector('#name');
  const emailInput = registerForm2.querySelector('#email');
  const feedbackDiv = document.getElementById('password-feedback');
  passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length == 0){
      feedbackDiv.style.display = 'none';
    }
    else {
      feedbackDiv.style.display = 'flex';
    }
    const {feedback, strength} = validatePassword(passwordInput.value, nameInput.value, emailInput.value);
    let html = `<div class='pw-strength pw-${strength}'>Password strength: ${strength}</div>`;
    html += '<ul class="pw-rules">';
    feedback.forEach(f => {
      html += `<li class='${f.ok ? 'ok' : 'bad'}'>${f.ok ? '•' : '•'} ${f.msg}</li>`;
    });
    html += '</ul>';
    feedbackDiv.innerHTML = html;
    feedbackDiv.style.display = passwordInput.value ? 'block' : 'none';
  });
}

// SVGs for password visibility
const eyeSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/></svg>`;
const eyeOffSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M792-56 624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM480-320q11 0 20.5-1t20.5-4L305-541q-3 11-4 20.5t-1 20.5q0 75 52.5 127.5T480-320Zm292 18L645-428q7-17 11-34.5t4-37.5q0-75-52.5-127.5T480-680q-20 0-37.5 4T408-664L306-766q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302ZM587-486 467-606q28-5 51.5 4.5T559-574q17 18 24.5 41.5T587-486Z"/></svg>`;

function setupPasswordToggle(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const pwInput = form.querySelector('#password');
  const toggleBtn = form.querySelector('#toggle-password');
  if (pwInput && toggleBtn) {
    toggleBtn.innerHTML = eyeSVG;
    toggleBtn.addEventListener('click', () => {
      if (pwInput.type === 'password') {
        pwInput.type = 'text';
        toggleBtn.setAttribute('aria-label', 'Hide password');
        toggleBtn.innerHTML = eyeOffSVG;
      } else {
        pwInput.type = 'password';
        toggleBtn.setAttribute('aria-label', 'Show password');
        toggleBtn.innerHTML = eyeSVG;
      }
    });
  }
}
setupPasswordToggle('register-form');
setupPasswordToggle('login-form'); 