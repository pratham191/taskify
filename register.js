document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const notification = document.getElementById('notification');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            resetErrors();
             const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();
            
            let isValid = true;
            if (!username) {
                showError(usernameError, 'Username is required');
                isValid = false;
            } else if (username.length < 3) {
                showError(usernameError, 'Username must be at least 3 characters');
                isValid = false;
            }
             if (!email) {
                showError(emailError, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(emailError, 'Please enter a valid email');
                isValid = false;
            }
             if (!password) {
                showError(passwordError, 'Password is required');
                isValid = false;
            } else if (password.length < 6) {
                showError(passwordError, 'Password must be at least 6 characters');
                isValid = false;
            }
             if (!confirmPassword) {
                showError(confirmPasswordError, 'Please confirm your password');
                isValid = false;
            } else if (password !== confirmPassword) {
                showError(confirmPasswordError, 'Passwords do not match');
                isValid = false;
            }
              if (isValid) {
                const result = registerUser(username, email, password);
                 if (result.success) {
                    showNotification('Registration successful! Please login.', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showNotification(result.message, 'error');
                }
            }
        });
    }
    function showError(element, message) {
        element.textContent = message;
    }
    function resetErrors() {
        usernameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        notification.textContent = '';
        notification.className = 'notification';
    }
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
    }
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}); 