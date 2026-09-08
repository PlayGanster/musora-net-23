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

    // Reviews infinite slider
    const track = document.querySelector('.reviews-track');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    if (track && prevBtn && nextBtn) {
        const originals = Array.from(track.children);
        const count = originals.length;

        // Clone cards for infinite loop
        originals.forEach(function(card) { track.appendChild(card.cloneNode(true)); });
        originals.forEach(function(card) { track.insertBefore(card.cloneNode(true), track.firstChild); });

        let index = count; // start at first real card
        let isAnimating = false;

        function getVisible() {
            var w = window.innerWidth;
            if (w <= 768) return 1;
            if (w <= 1024) return 2;
            return 3;
        }

        function slide(dir) {
            if (isAnimating) return;
            isAnimating = true;
            index += dir;
            var card = track.children[0];
            var gap = 24;
            var cardW = card.offsetWidth + gap;
            track.style.transition = 'transform 0.4s ease';
            track.style.transform = 'translateX(-' + (index * cardW) + 'px)';

            setTimeout(function() {
                isAnimating = false;
                // Reset position seamlessly when reaching clones
                if (index >= count * 2) {
                    index = count;
                    track.style.transition = 'none';
                    track.style.transform = 'translateX(-' + (index * cardW) + 'px)';
                } else if (index <= 0) {
                    index = count;
                    track.style.transition = 'none';
                    track.style.transform = 'translateX(-' + (index * cardW) + 'px)';
                }
            }, 420);
        }

        // Initial position
        (function() {
            var card = track.children[0];
            var gap = 24;
            var cardW = card.offsetWidth + gap;
            track.style.transform = 'translateX(-' + (index * cardW) + 'px)';
        })();

        prevBtn.addEventListener('click', function() { slide(-1); });
        nextBtn.addEventListener('click', function() { slide(1); });

        window.addEventListener('resize', function() {
            var card = track.children[0];
            var gap = 24;
            var cardW = card.offsetWidth + gap;
            track.style.transition = 'none';
            track.style.transform = 'translateX(-' + (index * cardW) + 'px)';
        });

        // Touch swipe
        var startX = 0;
        var dragging = false;
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
            var diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                slide(diff > 0 ? 1 : -1);
            }
        });
    }
});