document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    const authLinks = document.getElementById('auth-links');
    const logoutLink = document.getElementById('logout-link');
    const dashboardLink = document.getElementById('dashboard-link');

    if (currentUser) {
        if (authLinks) authLinks.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        if (dashboardLink) dashboardLink.style.display = 'block';

        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = currentUser.username;
        }
        const currentPath = window.location.pathname;
        if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        if (authLinks) authLinks.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'none';
        const currentPath = window.location.pathname;
        if (currentPath.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }
}
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

function registerUser(username, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return {
            success: false,
            message: 'Email already registered'
        };
    }
    const newUser = {
        id: generateUserId(),
        username,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return {
        success: true,
        message: 'Registration successful'
    };
}
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }
    const currentUser = {
        id: user.id,
        username: user.username,
        email: user.email
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    return {
        success: true,
        message: 'Login successful',
        user: currentUser
    };
}
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
function generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
}); 