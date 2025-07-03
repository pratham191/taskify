document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    const currentLocation = window.location.pathname;
    const menuItems = document.querySelectorAll('.nav-links a');
    const menuLength = menuItems.length;
    
    for (let i = 0; i < menuLength; i++) {
        if (menuItems[i].getAttribute('href') === currentLocation || 
            currentLocation.includes(menuItems[i].getAttribute('href')) && 
            menuItems[i].getAttribute('href') !== '/') {
            menuItems[i].classList.add('active');
        } else if (menuItems[i].classList.contains('active')) {
            menuItems[i].classList.remove('active');
        }
    }
}); 