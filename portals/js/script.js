/* ============================================================
   script.js — Learnify Auth Prototype
   Shared JavaScript across all three pages
   ============================================================ */

/* ========== Utility Helpers ========== */

/**
 * Validate email format
 * @param {string} value
 * @returns {boolean}
 */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Validate mobile number (10+ digits, optionally prefixed with +)
 * @param {string} value
 * @returns {boolean}
 */
function isValidMobile(value) {
  return /^\+?\d{10,15}$/.test(value.trim().replace(/\s/g, ''));
}

/**
 * Check if value is a valid email OR mobile number
 * @param {string} value
 * @returns {boolean}
 */
function isValidEmailOrMobile(value) {
  return isValidEmail(value) || isValidMobile(value);
}

/**
 * Show an error message beneath an input wrapper
 * @param {HTMLElement} wrapper  - .input-wrapper element
 * @param {HTMLElement} msgEl   - .error-msg element
 * @param {string}      message - Error text
 */
function showError(wrapper, msgEl, message) {
  wrapper.classList.add('input-error');
  msgEl.textContent = message;
  msgEl.classList.add('visible');
}

/**
 * Clear error state
 * @param {HTMLElement} wrapper
 * @param {HTMLElement} msgEl
 */
function clearError(wrapper, msgEl) {
  wrapper.classList.remove('input-error');
  msgEl.classList.remove('visible');
}


/* ========== Language Dropdown ========== */
(function initLangDropdown() {
  const langBtn = document.getElementById('lang-btn');
  if (!langBtn) return;

  langBtn.addEventListener('click', function () {
    // Placeholder — a real implementation would open a dropdown
    // For prototype purposes we simply toggle an aria-expanded attribute
    const expanded = langBtn.getAttribute('aria-expanded') === 'true';
    langBtn.setAttribute('aria-expanded', String(!expanded));
  });
})();


/* ========== Verify Domain Screen ========== */
(function initVerifyDomain() {
  const form = document.getElementById('verify-form');
  if (!form) return;

  const domainInput   = document.getElementById('domain-input');
  const domainWrapper = document.getElementById('domain-wrapper');
  const domainError   = document.getElementById('domain-error');
  const continueBtn   = document.getElementById('continue-btn');

  /* Clear error on input */
  domainInput.addEventListener('input', function () {
    clearError(domainWrapper, domainError);
  });

  /* Form submission */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const value = domainInput.value.trim();

    if (!value) {
      showError(domainWrapper, domainError, 'Please enter your domain name.');
      domainInput.focus();
      return;
    }

    /* Simulate navigation to login */
    window.location.href = 'login.html';
  });

  /* Button hover / active handled purely by CSS */
})();


/* ========== Login Screen ========== */
(function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;

  /* --- Elements --- */
  const emailInput      = document.getElementById('email-input');
  const emailWrapper    = document.getElementById('email-wrapper');
  const emailError      = document.getElementById('email-error');

  const passwordInput   = document.getElementById('password-input');
  const passwordWrapper = document.getElementById('password-wrapper');
  const passwordError   = document.getElementById('password-error');

  const togglePasswordBtn = document.getElementById('toggle-password');
  const rememberMe        = document.getElementById('remember-me');
  const forgotLink        = document.getElementById('forgot-link');
  const msBtn             = document.getElementById('ms-btn');
  const loginBtn          = document.getElementById('login-btn');

  /* --- Password Visibility Toggle --- */
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', function () {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';

      /* Swap icon */
      togglePasswordBtn.innerHTML = isPassword ? getEyeOpenIcon() : getEyeClosedIcon();
      togglePasswordBtn.setAttribute(
        'aria-label',
        isPassword ? 'Hide password' : 'Show password'
      );
    });
  }

  /* --- Clear errors on input --- */
  emailInput.addEventListener('input', function () {
    clearError(emailWrapper, emailError);
  });

  passwordInput.addEventListener('input', function () {
    clearError(passwordWrapper, passwordError);
  });

  /* --- Form submission (validation) --- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;

    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      showError(emailWrapper, emailError, 'Please enter your email or mobile number.');
      valid = false;
    } else if (!isValidEmailOrMobile(emailVal)) {
      showError(emailWrapper, emailError, 'Please enter a valid email or mobile number.');
      valid = false;
    }

    const passVal = passwordInput.value;
    if (!passVal) {
      showError(passwordWrapper, passwordError, 'Please enter your password.');
      valid = false;
    }

    if (!valid) return;

    /* Prototype — log and simulate login */
    console.log('Login submitted:', { email: emailVal, remember: rememberMe ? rememberMe.checked : false });
    loginBtn.textContent = 'Logging in…';
    loginBtn.disabled = true;

    setTimeout(function () {
      loginBtn.textContent = 'Login';
      loginBtn.disabled = false;
    }, 1500);
  });

  /* --- Forgot Password navigation --- */
  if (forgotLink) {
    forgotLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'forgot-password.html';
    });
  }

  /* --- Microsoft button (prototype stub) --- */
  if (msBtn) {
    msBtn.addEventListener('click', function () {
      console.log('Sign in with Microsoft clicked');
    });
  }
})();


/* ========== Forgot Password Screen ========== */
(function initForgotPassword() {
  const form = document.getElementById('forgot-form');
  if (!form) return;

  const emailInput   = document.getElementById('fp-email-input');
  const emailWrapper = document.getElementById('fp-email-wrapper');
  const emailError   = document.getElementById('fp-email-error');
  const sendBtn      = document.getElementById('send-btn');
  const backLink     = document.getElementById('back-link');

  /* Clear error on input */
  emailInput.addEventListener('input', function () {
    clearError(emailWrapper, emailError);
  });

  /* Form submission */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const value = emailInput.value.trim();

    if (!value) {
      showError(emailWrapper, emailError, 'Please enter your email or mobile number.');
      emailInput.focus();
      return;
    }

    if (!isValidEmailOrMobile(value)) {
      showError(emailWrapper, emailError, 'Please enter a valid email or mobile number.');
      emailInput.focus();
      return;
    }

    /* Prototype — simulate send */
    sendBtn.textContent = 'Sending…';
    sendBtn.disabled = true;

    setTimeout(function () {
      sendBtn.textContent = 'Send Verification Code';
      sendBtn.disabled = false;
      console.log('Verification code sent to:', value);
    }, 1500);
  });

  /* Back to Login */
  if (backLink) {
    backLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  }
})();


/* ========== SVG Icon Helpers ========== */

/**
 * Eye-open SVG icon (show password)
 */
function getEyeOpenIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`;
}

/**
 * Eye-closed SVG icon (hide password)
 */
function getEyeClosedIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>`;
}
