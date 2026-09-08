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
        function getCards() {
            return Array.from(track.querySelectorAll('.review-card:not(.review-card--dummy)'));
        }
        function getVisible() {
            const w = window.innerWidth;
            if (w <= 768) return 1;
            if (w <= 1024) return 2;
            return 3;
        }
        function getMaxPos() {
            return Math.max(0, getCards().length - getVisible());
        }
        function slide(dir) {
            position = Math.max(0, Math.min(position + dir, getMaxPos()));
            const card = getCards()[0];
            const gap = 24;
            const cardW = card.offsetWidth + gap;
            track.style.transform = 'translateX(-' + (position * cardW) + 'px)';
        }
        prevBtn.addEventListener('click', function() { slide(-1); });
        nextBtn.addEventListener('click', function() { slide(1); });
        window.addEventListener('resize', function() {
            position = Math.min(position, getMaxPos());
            const card = getCards()[0];
            const gap = 24;
            const cardW = card.offsetWidth + gap;
            track.style.transform = 'translateX(-' + (position * cardW) + 'px)';
        });

        // Touch swipe
        let startX = 0;
        let dragging = false;
        track.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            dragging = true;
        }, { passive: true });
        track.addEventListener('touchmove', function(e) {
            if (!dragging) return;
        }, { passive: true });
        track.addEventListener('touchend', function(e) {
            if (!dragging) return;
            dragging = false;
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                slide(diff > 0 ? 1 : -1);
            }
        });
    }
});