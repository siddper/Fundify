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