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

    // Reviews slider
    const track = document.querySelector('.reviews-track');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    if (track && prevBtn && nextBtn) {
        let position = 0;
        function getVisible() {
            return 3;
        }
        function slide(dir) {
            const cards = track.children;
            const total = cards.length;
            const visible = getVisible();
            const maxPos = total - visible;
            position = Math.max(0, Math.min(position + dir, maxPos));
            const cardW = cards[0].offsetWidth + 24;
            track.style.transform = 'translateX(-' + (position * cardW) + 'px)';
        }
        prevBtn.addEventListener('click', function() { slide(-1); });
        nextBtn.addEventListener('click', function() { slide(1); });
        window.addEventListener('resize', function() {
            position = 0;
            track.style.transform = 'translateX(0)';
        });
    }
});