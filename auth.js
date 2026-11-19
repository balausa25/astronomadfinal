// ============================================================
// ASTRONOMAD — Final Project: Authentication Simulation (FIXED)
// Author: Smail Balaussa | Group: SE-2505
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  // 1. UPDATE NAVIGATION (all pages)
  // ==========================================================
  function updateNavigation() {
    const isLoggedIn = sessionStorage.getItem('astronomad_loggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('astronomad_user'));
    
    const navLoginLinks = document.querySelectorAll('a[href="login.html"]');
    
    navLoginLinks.forEach(link => {
      if (isLoggedIn && user) {
        link.href = 'profile.html';
        link.innerHTML = `👨‍🚀 ${user.name.split(' ')[0]}`;
        link.style.color = 'var(--accent)';
      } else {
        link.href = 'login.html';
        link.innerHTML = '🔐 Login';
        link.style.color = '#fbbf24';
      }
    });

    const heroBtn = document.getElementById('heroAuthBtn');
    if (heroBtn) {
      if (isLoggedIn && user) {
        heroBtn.href = 'profile.html';
        heroBtn.innerHTML = `👨‍🚀 Go to Profile`;
        heroBtn.style.borderColor = 'var(--success)';
        heroBtn.style.color = 'var(--success)';
      } else {
        heroBtn.href = 'login.html';
        heroBtn.innerHTML = '🔐 Login';
        heroBtn.style.borderColor = '#fbbf24';
        heroBtn.style.color = '#fbbf24';
      }
    }
  }

  updateNavigation();

  // ==========================================================
  // 2. LOGIN / SIGNUP FORMS
  // ==========================================================
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const showLoginBtn = document.getElementById('showLogin');
  const showSignupBtn = document.getElementById('showSignup');

  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupForm.style.display = 'none';
      loginForm.style.display = 'block';
    });
  }

  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
    });
  }

  // --- SIGN UP  ---
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('regName');
      const emailInput = document.getElementById('regEmail');
      const passInput = document.getElementById('regPassword');
      const phoneInput = document.getElementById('regPhone'); // ЖАҢА
      
      const nameError = document.getElementById('regNameError');
      const emailError = document.getElementById('regEmailError');
      const passError = document.getElementById('regPassError');
      const phoneError = document.getElementById('regPhoneError'); // ЖАҢА
      
      nameError.textContent = '';
      emailError.textContent = '';
      passError.textContent = '';
      if (phoneError) phoneError.textContent = ''; // ЖАҢА
      
      let isValid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
      const phoneRegex = /^\+?[0-9\s\-\(\)]{10,15}$/; // ЖАҢА: Телефон форматы

      if (nameInput.value.trim() === '') {
        nameError.textContent = 'Full name is required.';
        isValid = false;
      }
      if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }
      if (!passRegex.test(passInput.value)) {
        passError.textContent = 'Password must be at least 6 characters and include a letter and a number.';
        isValid = false;
      }
      //
      if (phoneInput && !phoneRegex.test(phoneInput.value.trim())) {
        if (phoneError) phoneError.textContent = 'Please enter a valid phone number (e.g., +7 777 123 4567).';
        isValid = false;
      }

      if (isValid) {
        const user = { 
          name: nameInput.value.trim(), 
          email: emailInput.value.trim(), 
          password: passInput.value,
          phone: phoneInput ? phoneInput.value.trim() : '' // ЖАҢА: Дерекке телефонды қосу
        };
        localStorage.setItem('astronomad_user', JSON.stringify(user));
        
        if (window.showToast) {
          window.showToast('✅ Registration successful! Please log in.', 'success');
        } else {
          alert('Registration successful! Please log in.');
        }
        
        signupForm.reset();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
      }
    });
  }

  // --- LOG IN ---
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPassword');
      const emailError = document.getElementById('loginEmailError');
      const passError = document.getElementById('loginPassError');
      
      emailError.textContent = '';
      passError.textContent = '';
      
      const storedUser = JSON.parse(localStorage.getItem('astronomad_user'));
      
      if (!storedUser) {
        emailError.textContent = 'No account found. Please sign up first.';
        return;
      }

      if (storedUser.email === emailInput.value.trim() && storedUser.password === passInput.value) {
        sessionStorage.setItem('astronomad_loggedIn', 'true');
        window.location.href = 'profile.html';
      } else {
        passError.textContent = 'Incorrect email or password.';
      }
    });
  }

  // ==========================================================
  // 3. PROFILE PAGE 
  // ==========================================================
  const profileName = document.getElementById('profileName');
  if (profileName) {
    
    if (!sessionStorage.getItem('astronomad_loggedIn')) {
      window.location.href = 'login.html';
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('astronomad_user'));
    if (storedUser) {
      profileName.textContent = storedUser.name;
      const profileEmail = document.getElementById('profileEmail');
      if (profileEmail) profileEmail.textContent = storedUser.email;

      const detailName = document.getElementById('detailName');
      const detailEmail = document.getElementById('detailEmail');
      if (detailName) detailName.textContent = storedUser.name;
      if (detailEmail) detailEmail.textContent = storedUser.email;
      
      // ЖАҢА: Профильде телефонды көрсету (егер HTML-де орын болса)
      const detailPhone = document.getElementById('detailPhone');
      if (detailPhone) detailPhone.textContent = storedUser.phone || 'Not provided';
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('astronomad_loggedIn');
        window.location.href = 'index.html';
      });
    }
  }
});