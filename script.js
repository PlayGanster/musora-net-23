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

    // Area buttons — Yandex Maps iframe
    var mapFrame = document.getElementById('yandex-map');
    var mapFade = document.getElementById('mapFade');
    var mapPopup = document.getElementById('mapPopup');
    var popupAreaName = document.getElementById('popupAreaName');
    var popupDesc = document.getElementById('popupDesc');
    var areasGrid = document.getElementById('areasGrid');

    var areas = [
        { name: 'Центральный',        lat: '45.0355', lng: '38.9753', zoom: '13', desc: 'Сервисный центр, парки и скверы — вывоз мусора от жилых домов и офисов' },
        { name: 'Фестивальный',       lat: '45.0100', lng: '39.0200', zoom: '13', desc: 'Новый микрорайон — вывоз строительного и бытового мусора' },
        { name: 'Юбилейный',          lat: '45.0500', lng: '39.0100', zoom: '13', desc: 'Спальный район — регулярный вывоз и разбор завалов' },
        { name: 'Прикубанский',       lat: '45.0200', lng: '38.9500', zoom: '13', desc: 'Промзона и жильё — работаем с объёмным мусором' },
        { name: 'Пашковский',         lat: '45.0000', lng: '38.9800', zoom: '13', desc: 'Пригород — вывоз на дачах и частном секторе' },
        { name: 'Западный обход',     lat: '45.0400', lng: '38.9200', zoom: '12', desc: 'Промышленная зона вдоль трассы — крупные объёмы' },
        { name: 'Музыкальный',        lat: '45.0300', lng: '38.9600', zoom: '13', desc: 'Исторический центр — аккуратный вывоз вручную' },
        { name: 'Черемушки',          lat: '45.0600', lng: '38.9800', zoom: '13', desc: 'Микрорайон у парка — вывоз после ремонта и капремонта' },
        { name: 'Комсомольский',      lat: '45.0150', lng: '39.0000', zoom: '13', desc: 'Жилой район — бытовой и строительный мусор' },
        { name: 'ГМР',                lat: '45.0250', lng: '38.9400', zoom: '13', desc: 'Заводская зона — промышленные отходы и контейнеры' },
        { name: 'Российский',         lat: '45.0450', lng: '38.9900', zoom: '13', desc: 'Новый жилой комплекс — вывоз после отделки' },
        { name: 'Славянский',         lat: '45.0550', lng: '38.9500', zoom: '13', desc: 'Тихий район у реки — бытовой мусор и садовые отходы' },
        { name: 'Энка',               lat: '45.0350', lng: '38.9300', zoom: '13', desc: 'Промзона и склады — вывоз паллет, картона, упаковки' },
        { name: 'ККБ',                lat: '45.0400', lng: '38.9600', zoom: '13', desc: 'Около больницы — чистые подъезды и территории' },
        { name: 'Гидрострой',         lat: '45.0100', lng: '38.9400', zoom: '13', desc: 'Посёлок у канала — вывоз с частных домов' },
        { name: 'Немецкая деревня',   lat: '45.0050', lng: '38.9700', zoom: '13', desc: 'Исторический район — деликатный вывоз без повреждений' },
        { name: 'Яблоновский',        lat: '44.9800', lng: '38.9900', zoom: '13', desc: 'Пригород — вывоз на дачах, участках и стройках' },
        { name: 'Новая Адыгея',       lat: '44.9700', lng: '39.0200', zoom: '13', desc: 'Микрорайон — бытовой и строительный мусор' },
        { name: 'и другие районы',    lat: '45.0355', lng: '38.9753', zoom: '11', desc: 'Работаю по всему Краснодару и пригородам' }
    ];

    function switchArea(idx) {
        var area = areas[idx];
        if (!area) return;

        mapFade.classList.add('active');
        mapPopup.classList.add('hide');

        setTimeout(function() {
            mapFrame.src = 'https://yandex.ru/map-widget/v1/?ll=' + area.lng + '%2C' + area.lat + '&z=' + area.zoom + '&l=map&coordorder=longlat';
            popupAreaName.textContent = area.name;
            popupDesc.textContent = area.desc;

            setTimeout(function() {
                mapFade.classList.remove('active');
                mapPopup.classList.remove('hide');
            }, 500);
        }, 300);

        var btns = areasGrid.querySelectorAll('.area-btn');
        btns.forEach(function(b) { b.classList.remove('active'); });
        btns[idx].classList.add('active');
    }

    if (areasGrid) {
        var btns = areasGrid.querySelectorAll('.area-btn');
        btns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(btn.getAttribute('data-idx'), 10);
                switchArea(idx);
            });
        });

        popupAreaName.textContent = areas[0].name;
        popupDesc.textContent = areas[0].desc;
    }
});