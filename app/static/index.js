console.log('=== ТОВАРООБМЕН ===');
console.log('Файл index.js загружен');

// Базовый путь к API (относительный — т.к. фронтенд и бэкенд на одном origin)
const API_BASE = '/items';

const app = (() => {
    let offers = [];
    let requests = [];
    let stories = [];
    let conversations = [];

    const listEl = document.getElementById('list');
    const emptyEl = document.getElementById('empty');
    const requestsEl = document.getElementById('requests');
    const storiesEl = document.getElementById('stories');
    const offerTpl = document.getElementById('offer-template');

    async function fetchOffers() {
        try {
            // 1. Загружаем товары
            const itemsRes = await fetch(API_BASE);
            if (!itemsRes.ok) throw new Error(`Ошибка загрузки товаров: HTTP ${itemsRes.status}`);
            const items = await itemsRes.json();

    // 2. Загружаем пользователей - УЛУЧШЕННАЯ ОТЛАДКА
let users = new Map();
try {
    console.log('🔄 ========== НАЧАЛО ЗАГРУЗКИ ПОЛЬЗОВАТЕЛЕЙ ==========');
    console.log('🔍 Делаю запрос к /users...');

    // Засекаем время
    const startTime = performance.now();

    // Делаем запрос с таймаутом
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const usersRes = await fetch('/users', {
        signal: controller.signal
    });

    clearTimeout(timeoutId);
    const endTime = performance.now();

    console.log(`⏱️ Время ответа: ${Math.round(endTime - startTime)}ms`);
    console.log(`📊 HTTP статус: ${usersRes.status} (${usersRes.statusText})`);
    console.log(`🔗 Полный URL: ${usersRes.url}`);
    console.log(`✅ Успешен ли запрос: ${usersRes.ok}`);

    // Показываем заголовки ответа
    console.log('📋 Заголовки ответа:');
    usersRes.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
    });

    if (usersRes.ok) {
        console.log('🎉 Запрос успешен! Читаю JSON...');
        const usersData = await usersRes.json();
        console.log(`✅ Получено пользователей: ${usersData.length}`);
        console.log('📦 Пример первого пользователя:', usersData[0]);

        usersData.forEach(user => {
            users.set(user.id, user);
        });

        console.log(`👤 Загружено в Map: ${users.size} пользователей`);
    } else {
        console.warn('⚠️ ⚠️ ⚠️ ВНИМАНИЕ: Запрос НЕ успешен!');
        console.warn(`Код ошибки: ${usersRes.status} ${usersRes.statusText}`);

        // Пробуем прочитать ошибку разными способами
        try {
            // Сначала как текст
            const errorText = await usersRes.text();
            console.warn('📝 Текст ответа (первые 500 символов):', errorText.substring(0, 500));

            // Пробуем распарсить как JSON
            if (errorText.trim().startsWith('{') || errorText.trim().startsWith('[')) {
                try {
                    const errorJson = JSON.parse(errorText);
                    console.warn('📋 JSON ошибки:', errorJson);
                } catch (jsonError) {
                    console.warn('❌ Не удалось распарсить как JSON');
                }
            }
        } catch (readError) {
            console.warn('❌ Не удалось прочитать тело ответа:', readError.message);
        }

        // Проверяем CORS
        if (usersRes.status === 0) {
            console.warn('🔒 Возможная проблема CORS или сетевой сбой');
        }
    }

    console.log('✅ ========== КОНЕЦ ЗАГРУЗКИ ПОЛЬЗОВАТЕЛЕЙ ==========');

} catch (e) {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА при загрузке пользователей:');
    console.error('Название ошибки:', e.name);
    console.error('Сообщение:', e.message);
    console.error('Тип:', typeof e);

    if (e.name === 'AbortError') {
        console.error('⏰ Таймаут запроса (больше 5 секунд)');
    }

    if (e.name === 'TypeError' && e.message.includes('Failed to fetch')) {
        console.error('🌐 Проблема с сетью или CORS');
    }

    console.error('Полный стек:', e.stack);
}

            // 3. Загружаем категории
            let categories = new Map();
            try {
                const categoriesRes = await fetch('/categories'); // Ваш endpoint для категорий
                if (categoriesRes.ok) {
                    const categoriesData = await categoriesRes.json();
                    categoriesData.forEach(category => {
                        categories.set(category.id, category);
                    });
                    console.log(`📂 Загружено ${categories.size} категорий`);
                } else {
                    console.warn('⚠️ Не удалось загрузить категории');
                }
            } catch (e) {
                console.warn('⚠️ Ошибка загрузки категорий:', e.message);
            }

            // 4. Загружаем локации (если нужно)
            let locations = new Map();
            try {
                const locationsRes = await fetch('/locations'); // Ваш endpoint для локаций
                if (locationsRes.ok) {
                    const locationsData = await locationsRes.json();
                    locationsData.forEach(location => {
                        locations.set(location.id, location);
                    });
                    console.log(`📍 Загружено ${locations.size} локаций`);
                } else {
                    console.warn('⚠️ Не удалось загрузить локации');
                }
            } catch (e) {
                console.warn('⚠️ Ошибка загрузки локаций:', e.message);
            }

            // 5. Преобразуем товары
            offers = items.map(item => {
                // Получаем пользователя
                const user = users.get(item.user_id);
                const ownerName = user ?
                    `${user.name || ''}${user.surname ? ' ' + user.surname : ''}`.trim() :
                    `Пользователь #${item.user_id}`;

                // Получаем категорию
                const category = categories.get(item.category_id);
                const categoryName = category ?
                    category.name || category.title || `Категория ${item.category_id}` :
                    `Категория ${item.category_id}`;

                // Получаем локацию
                const location = locations.get(item.location_id);
                const locationName = location ?
                    location.name || location.city || `Локация ${item.location_id}` :
                    `Локация #${item.location_id}`;

                return {
                    id: item.id,
                    title: item.title || 'Без названия',
                    desc: item.description || '',
                    category: categoryName,
                    owner: ownerName,
                    likes: item.likes || 0,
                    condition: item.condition || 'Не указано',
                    location: locationName,
                    createdAt: item.created_at || new Date().toISOString(),
                    isUserAdded: false,

                    // Сохраняем ID для будущих запросов
                    userId: item.user_id,
                    locationId: item.location_id,
                    categoryId: item.category_id
                };
            });

            // 6. Отладка
            if (offers.length > 0) {
                console.log('✅ ПЕРВЫЙ ТОВАР ПОСЛЕ ОБРАБОТКИ:');
                console.log('  Название:', offers[0].title);
                console.log('  Владелец:', offers[0].owner);
                console.log('  Категория:', offers[0].category);
                console.log('  Локация:', offers[0].location);
            }

            renderOffers();
        } catch (e) {
            console.error('Ошибка загрузки товаров с сервера:', e);
            showNotification('Сервер недоступен. Загружаем демо-данные...');
            seedDemoOffers();
            renderOffers();
        }
    }

    // // === ДЕМО-ТОВАРЫ (только для отладки) ===
    // function seedDemoOffers() {
    //     offers = [
    //         {
    //             id: 'demo-1',
    //             title: 'Сборник советских сказок',
    //             desc: 'В отличном состоянии, 200 страниц. Ищу детскую одежду или игрушку.',
    //             category: 'Книги',
    //             owner: 'Ольга',
    //             likes: 18,
    //             img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
    //             specs: ['200 стр.', 'Твёрдый переплёт', 'Вес 420 г'],
    //             location: 'Москва, м. Чистые пруды',
    //             createdAt: new Date().toISOString(),
    //             isUserAdded: false
    //         },
    //         {
    //             id: 'demo-2',
    //             title: 'Детская теплая куртка (110 см)',
    //             desc: 'Пару раз носили, тёплая и чистая. Отдам в обмен на настольные игры.',
    //             category: 'Одежда',
    //             owner: 'Марат',
    //             likes: 9,
    //             img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
    //             specs: ['Размер 110', 'Синтепон', 'Практически новая'],
    //             location: 'Санкт-Петербург, Приморский р-н',
    //             createdAt: new Date().toISOString(),
    //             isUserAdded: false
    //         }
    //     ];
    // }

     // === ИНИЦИАЛИЗАЦИЯ ЗАПРОСОВ И ИСТОРИЙ (локально) ===
     function seedRequestsAndStories() {
        function nanoid(size = 21) {
            const alphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
             let id = '';
             let i = size;
            while (i--) id += alphabet[(Math.random() * 64) | 0];
             return id;
         }

         requests = [
             { id: nanoid(), title: 'Нужен детский стульчик', owner: 'Марина', note: 'до 2 лет' },
             { id: nanoid(), title: 'Ищу книги по программированию', owner: 'Алексей', note: 'Python, JavaScript' }
         ];

         stories = [
            { id: nanoid(), text: 'Мария обменяла книги на детскую одежду для сына.' },
             { id: nanoid(), text: 'Сергей нашёл через обмен инструменты для ремонта.' }
        ];
     }

    // === ОТПРАВКА НОВОГО ТОВАРА ===
    async function submitNewItem(formData) {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Неизвестная ошибка сервера');
        }
        return await res.json();
    }

    // === МОДАЛКА ДОБАВЛЕНИЯ ТОВАРА ===
    function openAddProductModal() {
        const root = document.getElementById('modal-root');
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true" style="max-width: 600px;">
                <h3 style="color: #331B15;">➕ Добавить новый товар</h3>
                <p style="color: var(--muted); margin-bottom: 20px;">Заполните информацию о товаре</p>

                <!-- ТАК ДОЛЖНО БЫТЬ ПО ВАШЕЙ БД -->
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Название товара *</label>
                    <input class="input" id="add-title" placeholder="Например: Книга 'Мастер и Маргарита'" />
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Описание товара *</label>
                    <textarea class="input" id="add-desc" placeholder="Опишите состояние товара, что вы хотите получить взамен..." rows="4"></textarea>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Состояние товара *</label>
                    <select class="input" id="add-condition">
                        <option value="">Выберите состояние</option>
                        <option value="new">Новое</option>
                        <option value="excellent">Отличное</option>
                        <option value="good">Хорошее</option>
                        <option value="satisfactory">Удовлетворительное</option>
                        <option value="needs_repair">Требует ремонта</option>
                    </select>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Категория *</label>
                    <select class="input" id="add-category">
                        <option value="">Выберите категорию</option>
                        <option value="1">Книги</option>
                        <option value="2">Одежда</option>
                        <option value="3">Техника</option>
                        <option value="4">Дом</option>
                        <option value="5">Мебель</option>
                        <option value="6">Детское</option>
                        <option value="7">Спорт</option>
                        <option value="8">Инструменты</option>
                        <option value="9">Развлечения</option>
                        <option value="10">Коллекции</option>
                        <option value="11">Другое</option>
                    </select>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Локация *</label>
                    <select class="input" id="add-location">
                        <option value="">Выберите локацию</option>
                        <option value="1">Москва</option>
                        <option value="2">Санкт-Петербург</option>
                        <option value="3">Новосибирск</option>
                        <option value="4">Екатеринбург</option>
                        <option value="5">Казань</option>
                    </select>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Характеристики (через запятую)</label>
                    <input class="input" id="add-specs" placeholder="Например: 200 стр., твердый переплет, отличное состояние" />
                </div>

                <!-- ПОЛЕ user_id СКРЫТОЕ (пока используем ID 1) -->
                <input type="hidden" id="add-user-id" value="1" />

                <div class="modal-actions" style="margin-top: 30px;">
                    <button id="cancel-add" class="save-btn" style="margin-right: 10px;">Отмена</button>
                    <button id="submit-add" class="primary">Добавить товар</button>
                </div>
            </div>
        `;

        root.appendChild(backdrop);

        function close() { backdrop.remove(); }
        backdrop.querySelector('#cancel-add').addEventListener('click', close);
        backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

        backdrop.querySelector('#submit-add').addEventListener('click', async () => {
            // СБОР ДАННЫХ С ФОРМЫ
            const title = backdrop.querySelector('#add-title').value.trim();
            const description = backdrop.querySelector('#add-desc').value.trim();
            const condition = backdrop.querySelector('#add-condition').value;
            const category_id = backdrop.querySelector('#add-category').value;
            const location_id = backdrop.querySelector('#add-location').value;
            const user_id = backdrop.querySelector('#add-user-id').value;
            const specsInput = backdrop.querySelector('#add-specs').value.trim();

            // ВАЛИДАЦИЯ ПО ВАШЕЙ БД
            if (!title || !description || !condition || !category_id || !location_id) {
                showNotification('Заполните все обязательные поля (отмечены *)');
                return;
            }

            // ПРЕОБРАЗОВАНИЕ ХАРАКТЕРИСТИК
            const specs = specsInput ?
                specsInput.split(',').map(s => s.trim()).filter(s => s) :
                [];

            // ФОРМИРОВАНИЕ ОБЪЕКТА ПО ВАШЕЙ БД
            const newOfferData = {
                title: title,                    // str - ОБЯЗАТЕЛЬНО
                description: description,        // str - ОБЯЗАТЕЛЬНО
                condition: condition,            // str - ОБЯЗАТЕЛЬНО
                user_id: parseInt(user_id),      // int - ОБЯЗАТЕЛЬНО (пока 1)
                category_id: parseInt(category_id), // int - ОБЯЗАТЕЛЬНО
                location_id: parseInt(location_id), // int - ОБЯЗАТЕЛЬНО
            };

            console.log('Отправляемые данные:', newOfferData); // для отладки

            try {
                await submitNewItem(newOfferData);
                showNotification('Товар успешно добавлен!');
                close();
                await fetchOffers(); // Обновляем список товаров
            } catch (e) {
                console.error('Ошибка добавления товара:', e);
                showNotification('Ошибка: ' + e.message);
            }
        });
    }

    function renderOffers(list = offers) {
        if (!listEl) return;
        listEl.innerHTML = '';
        if (list.length === 0) {
            emptyEl.hidden = false;
            return;
        }
        emptyEl.hidden = true;
        const displayList = list.slice(0, 30);

        displayList.forEach(o => {
            const node = offerTpl.content.cloneNode(true);
            const card = node.querySelector('.card');

            const title = node.querySelector('.title');
            const desc = node.querySelector('.desc');
            const specsEl = node.querySelector('.specs');
            const category = node.querySelector('.category');
            const owner = node.querySelector('.owner');
            const locationEl = node.querySelector('.location');
            const likes = node.querySelector('.likes');
            const swapBtn = node.querySelector('.swap-btn');
            const saveBtn = node.querySelector('.save-btn');

            title.textContent = o.title;
            desc.textContent = o.desc;
            category.textContent = o.category;
            owner.textContent = o.owner;
            likes.textContent = o.likes;

            specsEl.innerHTML = '';
            if (Array.isArray(o.specs) && o.specs.length) {
                o.specs.slice(0, 4).forEach(s => {
                    const li = document.createElement('li');
                    li.textContent = s;
                    specsEl.appendChild(li);
                });
            }

            locationEl.textContent = o.location ? `Местоположение: ${o.location}` : '';

            // === ДОБАВЬТЕ ЭТУ СТРОКУ ЕСЛИ УБРАЛИ КАРТИНКИ ===
            // Если вы убрали картинки - удалите или закомментируйте эти строки:
            // img.src = o.img;
            // img.alt = o.title;

            // === ОБРАБОТЧИК КЛИКА НА КАРТОЧКУ (у вас уже есть, проверьте) ===
            card.dataset.id = o.id;
            card.style.cursor = 'pointer';

            // Этот обработчик уже есть в вашем коде - ОСТАВЬТЕ ЕГО!
            card.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                openProductDetail(o);
            });

            swapBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openExchangeModal(o);
            });

            saveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleSave(o, card);
            });

            listEl.appendChild(node);
        });

        updateItemsCounter(list.length);

        if (list.length > 30) {
            const moreMsg = document.createElement('div');
            moreMsg.className = 'more-message';
            moreMsg.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 20px; color: var(--muted);';
            moreMsg.innerHTML = `<p>Показано 30 из ${list.length} товаров. Используйте поиск для уточнения.</p>`;
            listEl.appendChild(moreMsg);
        }
    }
    function updateItemsCounter(count) {
        let counterEl = document.getElementById('items-counter');
        if (!counterEl) {
            const toolbar = document.querySelector('.toolbar');
            if (toolbar) {
                counterEl = document.createElement('div');
                counterEl.id = 'items-counter';
                counterEl.style.cssText = 'font-size: 14px; color: var(--muted); margin-top: 5px;';
                toolbar.appendChild(counterEl);
            }
        }
        if (counterEl) counterEl.textContent = `Найдено товаров: ${count}`;
    }

    function renderRequests() {
        if (requestsEl) requestsEl.innerHTML = requests.map(r =>
            `<div class="request-item" data-id="${r.id}"><strong>${r.title}</strong><br><small>${r.owner} • ${r.note}</small></div>`
        ).join('');
    }

    function renderStories() {
        if (storiesEl) storiesEl.innerHTML = stories.map(s =>
            `<div class="story-item">${s.text}</div>`
        ).join('');
    }

    function toggleSave(offer, card) {
        card.classList.toggle('saved');
        showNotification(card.classList.contains('saved') ? 'Сохранено' : 'Удалено из сохранённых');
    }

    function openExchangeModal(offer) {
        showNotification('Обмен пока не реализован на бэкенде');
    }

    function openProductDetail(product) {
        showNotification('Детали товара: ' + product.title);
    }

    function showNotification(text) {
        const n = document.createElement('div');
        n.style.cssText = `
            position: fixed; right: 18px; bottom: 18px;
            background: var(--primary-bg); color: var(--primary-text);
            padding: 12px 16px; border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            z-index: 9999; font-weight: 500; font-size: 14px;
            max-width: 300px; transform: translateY(20px); opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
        `;
        n.textContent = text;
        document.body.appendChild(n);
        setTimeout(() => { n.style.transform = 'translateY(0)'; n.style.opacity = '1'; }, 10);
        setTimeout(() => { n.style.transform = 'translateY(20px)'; n.style.opacity = '0'; setTimeout(() => n.remove(), 300); }, 3000);
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
    }

    function bind() {
        document.getElementById('new-offer-btn')?.addEventListener('click', openAddProductModal);
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const q = e.target.value.trim().toLowerCase();
                const filtered = offers.filter(o =>
                    (o.title + ' ' + o.desc + ' ' + o.category).toLowerCase().includes(q)
                );
                renderOffers(filtered);
            });
        }
    }

    // === ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ ===
    async function init() {
        console.log("✅ Функция init() запущена"); // ← добавьте
    console.log("seedRequestsAndStories существует?", typeof seedRequestsAndStories); // ← добавьте
        console.log("Инициализация приложения...");
        seedRequestsAndStories(); // ← исправлено
        await fetchOffers();
        bind();
        renderRequests();
        renderStories();

        // Загрузка профиля (локально)
        const profile = JSON.parse(localStorage.getItem('profile') || '{}');
if (profile.name) {
    // Обновляем данные в шапке
    const userNameEl = document.getElementById('user-name');
    const userScoreEl = document.getElementById('user-score');

    if (userNameEl) userNameEl.textContent = profile.name;
    if (userScoreEl) userScoreEl.textContent = `Доверие: ${profile.score || '4.4'}`;

    // Показываем кнопку профиля
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) profileBtn.style.display = 'flex';

    // Скрываем кнопку входа
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) loginContainer.style.display = 'none';
} else {
    // Если нет профиля, показываем кнопку входа
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) loginContainer.style.display = 'flex';
}
    }
    return { init };
})();
// === АВТОМАТИЧЕСКИЙ ЗАПУСК ===
(function() {
    console.log('🔄 Проверяю доступность модуля...');

    // Функция для запуска
    function runApp() {
        // Если app существует локально (внутри модуля)
        if (typeof init === 'function') {
            console.log('✅ Найдена локальная функция init, запускаю...');
            init().catch(console.error);
        }
        // Если app существует глобально
        else if (window.app && typeof window.app.init === 'function') {
            console.log('✅ Найдена window.app.init, запускаю...');
            window.app.init().catch(console.error);
        }
        // Если ничего не найдено
        else {
            console.error('❌ Не удалось найти функцию инициализации');
            console.log('Доступные глобальные переменные:', Object.keys(window).filter(k => !k.startsWith('_')));
        }
    }

    // Запускаем при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runApp);
    } else {
        runApp();
    }
})();
// === ГЛОБАЛЬНЫЙ ЭКСПОРТ ===
// Этот код должен быть ПОСЛЕДНИМ в файле
console.log('📦 Экспортирую модуль в window.app...');
window.app = app;

// Автоматический запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 DOM загружен, запускаю приложение...');
        if (window.app && window.app.init) {
            window.app.init().catch(err => console.error('Ошибка запуска:', err));
        }
    });
} else {
    console.log('📄 DOM уже загружен, запускаю сразу...');
    if (window.app && window.app.init) {
        window.app.init().catch(err => console.error('Ошибка запуска:', err));
    }
}
// === ФУНКЦИЯ ОТКРЫТИЯ СТРАНИЦЫ ТОВАРА ===
function openProductDetail(product) {
    console.log('📖 Открываю товар:', product);

    // 1. Сохраняем товар для использования на странице товара
    localStorage.setItem('currentProduct', JSON.stringify(product));

    // 2. Показываем страницу товара
    // Если у вас есть система страниц:
    showPage('product-page');

    // ИЛИ если у вас одностраничное приложение:
    // window.location.href = `/product.html?id=${product.id}`;

    // 3. Заполняем данные на странице товара (если она уже загружена)
    fillProductPage(product);
}
