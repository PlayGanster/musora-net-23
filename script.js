document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    function openMenu() {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    burgerBtn.addEventListener('click', openMenu);
    mobileMenuClose.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);

    // Закрытие меню при клике по ссылке
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });
});