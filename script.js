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

    // Area dropdown — Yandex Maps iframe
    var mapFrame = document.getElementById('yandex-map');
    var mapFade = document.getElementById('mapFade');
    var mapPopup = document.getElementById('mapPopup');
    var popupAreaName = document.getElementById('popupAreaName');
    var popupDesc = document.getElementById('popupDesc');
    var areaSelect = document.getElementById('areaSelect');

    var areas = [
        { name: 'Центральный район',          lat: '45.0355', lng: '38.9753', zoom: '13', desc: 'Центр города — парки, скверы, вывоз от жилых домов и офисов' },
        { name: 'Фестивальный район',         lat: '45.0480', lng: '39.0050', zoom: '13', desc: 'Восточный жилой район — строительный и бытовой мусор' },
        { name: 'Юбилейный район',            lat: '45.0600', lng: '39.0000', zoom: '13', desc: 'Северный жилой район — регулярный вывоз и разбор завалов' },
        { name: 'Черёмушки',                  lat: '45.0650', lng: '38.9750', zoom: '13', desc: 'Северный район — вывоз после ремонта и капремонта' },
        { name: 'Гидрострой',                 lat: '45.0120', lng: '38.9450', zoom: '13', desc: 'Южный посёлок — вывоз с частных домов' },
        { name: 'Комсомольский район',        lat: '45.0350', lng: '38.9850', zoom: '13', desc: 'Центральный район — бытовой и строительный мусор' },
        { name: 'Пашковский район',           lat: '45.0230', lng: '39.0950', zoom: '13', desc: 'Пригород на востоке — вывоз на дачах и частном секторе' },
        { name: 'Славянский район',           lat: '45.0630', lng: '38.9280', zoom: '13', desc: 'Северный район — бытовой мусор и садовые отходы' },
        { name: 'Школьный район',             lat: '45.0500', lng: '38.9700', zoom: '13', desc: 'Северо-центральный — бытовой и строительный мусор' },
        { name: 'ЗИП',                        lat: '45.0500', lng: '38.9500', zoom: '13', desc: 'Северо-запад — промышленные и бытовые отходы' },
        { name: 'ККБ',                        lat: '45.0350', lng: '38.9600', zoom: '13', desc: 'Рядом с клинической больницей — чистые территории' },
        { name: 'Энка',                       lat: '45.0580', lng: '38.9480', zoom: '13', desc: 'Северо-запад — вывоз паллет, картона, упаковки' },
        { name: 'Восточно-Кругликовский',     lat: '45.0450', lng: '39.0150', zoom: '13', desc: 'Восточный район — бытовой и строительный мусор' },
        { name: 'Западный обход',             lat: '45.0900', lng: '38.9120', zoom: '12', desc: 'Промышленная зона вдоль трассы — крупные объёмы' },
        { name: 'Музыкальный район',          lat: '45.0400', lng: '38.9650', zoom: '13', desc: 'Центр города — аккуратный вывоз вручную' },
        { name: 'Немецкая деревня',           lat: '45.0450', lng: '38.9650', zoom: '13', desc: 'Исторический район — деликатный вывоз' },
        { name: 'Микрохирургия глаза',        lat: '45.0550', lng: '38.9700', zoom: '13', desc: 'Рядом с НМИЦ — чистые подъезды и территории' },
        { name: 'СХИ',                        lat: '45.0600', lng: '38.9600', zoom: '13', desc: 'Север — вывоз от студентов и преподавателей' },
        { name: 'Панорама',                   lat: '45.0650', lng: '38.9900', zoom: '13', desc: 'Северо-восточный жилой комплекс — вывоз после отделки' },
        { name: 'Губернский район',           lat: '45.0700', lng: '38.9800', zoom: '13', desc: 'Северный район — бытовой мусор' },
        { name: 'Московский район',           lat: '45.0600', lng: '38.9500', zoom: '13', desc: 'Северо-запад — бытовой и строительный мусор' },
        { name: 'Российский район',           lat: '45.0450', lng: '38.9950', zoom: '13', desc: 'Восточный жилой комплекс — вывоз после отделки' },
        { name: 'Молодёжный район',           lat: '45.0600', lng: '38.9650', zoom: '13', desc: 'Северный район — бытовой мусор' },
        { name: 'Почтовый район',             lat: '45.0200', lng: '38.9900', zoom: '13', desc: 'Юго-восточный район — бытовой мусор' },
        { name: 'Авиагородок',                lat: '44.9850', lng: '38.9300', zoom: '13', desc: 'Рядом с аэропортом — вывоз с частных домов' },
        { name: 'Аврора',                     lat: '45.0150', lng: '38.9550', zoom: '13', desc: 'Южный жилой район — бытовой мусор' },
        { name: '9-й километр',               lat: '45.0100', lng: '38.9600', zoom: '13', desc: 'Южный район — вывоз с частных домов' },
        { name: '40 лет Победы',              lat: '45.0200', lng: '38.9500', zoom: '13', desc: 'Южный жилой район — бытовой мусор' },
        { name: '2-я Площадка',               lat: '45.0250', lng: '38.9800', zoom: '13', desc: 'Юго-восточный район — вывоз после ремонта' },
        { name: 'Витаминкомбинат',            lat: '45.0150', lng: '38.9500', zoom: '13', desc: 'Южный район — бытовой мусор' },
        { name: 'Северный',                   lat: '45.0650', lng: '38.9700', zoom: '13', desc: 'Северный жилой район — вывоз после ремонта' },
        { name: 'Ростовское шоссе',           lat: '45.0550', lng: '38.9900', zoom: '13', desc: 'Вдоль трассы на Ростов — вывоз крупных объёмов' },
        { name: 'Красная площадь',            lat: '45.0350', lng: '38.9750', zoom: '14', desc: 'Центр — вывоз от кафе, магазинов и офисов' },
        { name: 'Репино',                     lat: '45.0100', lng: '39.0200', zoom: '13', desc: 'Посёлок на востоке — вывоз с дач и участков' },
        { name: 'Горхутор',                   lat: '45.0300', lng: '39.0100', zoom: '13', desc: 'Садовое товарищество — вывоз строительного мусора' },
        { name: 'Кожзавод',                   lat: '45.0100', lng: '38.9550', zoom: '13', desc: 'Южный район — промышленные и бытовые отходы' },
        { name: 'Дубинка',                    lat: '45.0050', lng: '38.9600', zoom: '13', desc: 'Южный посёлок — вывоз с частных домов' },
        { name: 'Табачка',                    lat: '45.0100', lng: '38.9500', zoom: '13', desc: 'Южный район — вывоз с частных домов' },
        { name: 'РМЗ',                        lat: '45.0550', lng: '38.9500', zoom: '13', desc: 'Ремонтный завод — промышленные отходы' },
        { name: 'ХБК',                        lat: '45.0300', lng: '39.0000', zoom: '13', desc: 'Хлопчатобумажный комбинат — промышленные отходы' },
        { name: 'КСК',                        lat: '45.0550', lng: '38.9850', zoom: '13', desc: 'Краснодарский стадион — вывоз крупных объёмов' },
        { name: 'ТЭЦ',                        lat: '45.0600', lng: '38.9400', zoom: '13', desc: 'Тепловая электростанция — промышленные отходы' },
        { name: 'РИП',                        lat: '45.0550', lng: '38.9350', zoom: '13', desc: 'Северо-запад — промышленные отходы' },
        { name: 'Рубероидный',                lat: '45.0050', lng: '38.9500', zoom: '13', desc: 'Юго-запад — промышленные и бытовые отходы' },
        { name: 'Плодородный',                lat: '45.0400', lng: '39.0000', zoom: '13', desc: 'Восточный район — бытовой мусор' },
        { name: 'Краснодарский',              lat: '45.0300', lng: '39.0200', zoom: '13', desc: 'Пригород — вывоз с дач и частных домов' },
        { name: 'Любимово',                   lat: '45.0200', lng: '39.0400', zoom: '13', desc: 'Посёлок на востоке — вывоз с участков' },
        { name: 'Калинино',                   lat: '45.0500', lng: '39.0200', zoom: '13', desc: 'Посёлок на северо-востоке — вывоз с дач' },
        { name: 'Индустриальный',             lat: '45.0550', lng: '38.9450', zoom: '13', desc: 'Промышленная зона на севере — отходы предприятий' },
        { name: 'Знаменский',                 lat: '45.0100', lng: '38.9650', zoom: '13', desc: 'Южный район — бытовой мусор' },
        { name: 'Новознаменский',             lat: '45.0150', lng: '38.9650', zoom: '13', desc: 'Южный район — бытовой мусор' },
        { name: 'Лорис',                      lat: '45.0600', lng: '38.9800', zoom: '13', desc: 'Северо-восточный жилой комплекс — вывоз после отделки' },
        { name: 'Берёзовый',                  lat: '45.0650', lng: '38.9650', zoom: '13', desc: 'Северный район — бытовой мусор' },
        { name: 'Лазурный',                   lat: '45.0600', lng: '38.9850', zoom: '13', desc: 'Северо-восточный район — вывоз после ремонта' },
        { name: 'Колос',                      lat: '45.0650', lng: '38.9600', zoom: '13', desc: 'Северный район — бытовой мусор' },
        { name: 'Копанской',                  lat: '45.0150', lng: '38.9550', zoom: '13', desc: 'Южный район — вывоз с частных домов' },
        { name: 'Пригородный',                lat: '45.0200', lng: '38.9900', zoom: '13', desc: 'Юго-восточный пригород — бытовой мусор' },
        { name: 'Октябрьский',                lat: '45.0600', lng: '38.9550', zoom: '13', desc: 'Северный район — бытовой мусор' },
        { name: 'Победитель',                 lat: '45.0600', lng: '38.9950', zoom: '13', desc: 'Северо-восточный жилой комплекс — вывоз после отделки' },
        { name: 'Прогресс',                   lat: '45.0550', lng: '38.9750', zoom: '13', desc: 'Северный район — бытовой мусор' },
        { name: 'Учхоз Кубань',               lat: '45.0100', lng: '38.9700', zoom: '13', desc: 'Южный район — вывоз с частных домов' },
        { name: 'Поле чудес',                 lat: '45.0250', lng: '38.9850', zoom: '13', desc: 'Юго-восточный район — вывоз после ремонта' },
        { name: 'Микрорайон Жукова',          lat: '45.0650', lng: '38.9950', zoom: '13', desc: 'Северо-восточный жилой комплекс — вывоз после отделки' },
        { name: 'Европея',                    lat: '45.0650', lng: '38.9750', zoom: '13', desc: 'Северный жилой комплекс — вывоз после отделки' },
        { name: 'Катюша',                     lat: '45.0150', lng: '38.9600', zoom: '13', desc: 'Южный район — бытовой мусор' },
        { name: 'Николино Парк',              lat: '45.0300', lng: '39.0100', zoom: '13', desc: 'Восточный жилой комплекс — вывоз после отделки' },
        { name: 'Восточный район',            lat: '45.0450', lng: '39.0100', zoom: '13', desc: 'Восточный район — бытовой и строительный мусор' },
        { name: 'Южный район',                lat: '45.0150', lng: '38.9600', zoom: '13', desc: 'Южный район — бытовой мусор' },
        { name: 'Аэропорт',                   lat: '44.9800', lng: '38.9250', zoom: '13', desc: 'Рядом с аэропортом — вывоз с частных домов' },
        { name: 'Старый Центр',               lat: '45.0350', lng: '38.9750', zoom: '14', desc: 'Исторический центр — аккуратный вывоз вручную' },
        { name: 'Горогороды',                 lat: '45.0350', lng: '39.0000', zoom: '13', desc: 'Восточный район — вывоз после ремонта' }
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
    }

    if (areaSelect) {
        areaSelect.addEventListener('change', function() {
            switchArea(parseInt(areaSelect.value, 10));
        });

        popupAreaName.textContent = areas[0].name;
        popupDesc.textContent = areas[0].desc;
    }
});