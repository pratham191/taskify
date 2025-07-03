document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
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
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            resetErrors();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            let isValid = true;
            
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
            }
            
            if (isValid) {
                const result = loginUser(email, password);
                
                if (result.success) {
                     showNotification('Login successful! Redirecting...', 'success');
                    
                     setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
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
        emailError.textContent = '';
        passwordError.textContent = '';
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