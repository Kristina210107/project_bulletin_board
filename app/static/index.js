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

    // === ЗАГРУЗКА ТОВАРОВ С СЕРВЕРА ===
    async function fetchOffers() {
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            offers = data.map(item => ({
                id: item.id,
                title: item.title,
                desc: item.description || '',
                category: item.category?.name || item.category_id?.toString() || 'Другое',
                owner: item.owner?.name || 'Аноним',
                likes: item.likes || 0,
                img: item.image_url || 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=800&auto=format&fit=crop',
                specs: Array.isArray(item.specs) ? item.specs : (item.specs ? [item.specs] : []),
                location: item.location?.name || 'Не указано',
                createdAt: item.created_at || new Date().toISOString(),
                isUserAdded: false
            }));

            renderOffers();
        } catch (e) {
            console.error('Ошибка загрузки товаров с сервера:', e);
            showNotification('Сервер недоступен. Загружаем демо-данные...');
            seedDemoOffers(); // Fallback
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

    // // === ИНИЦИАЛИЗАЦИЯ ЗАПРОСОВ И ИСТОРИЙ (локально) ===
    // function seedRequestsAndStories() {
    //     function nanoid(size = 21) {
    //         const alphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
    //         let id = '';
    //         let i = size;
    //         while (i--) id += alphabet[(Math.random() * 64) | 0];
    //         return id;
    //     }

    //     requests = [
    //         { id: nanoid(), title: 'Нужен детский стульчик', owner: 'Марина', note: 'до 2 лет' },
    //         { id: nanoid(), title: 'Ищу книги по программированию', owner: 'Алексей', note: 'Python, JavaScript' }
    //     ];

    //     stories = [
    //         { id: nanoid(), text: 'Мария обменяла книги на детскую одежду для сына.' },
    //         { id: nanoid(), text: 'Сергей нашёл через обмен инструменты для ремонта.' }
    //     ];
    // }

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
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Название товара *</label>
                    <input class="input" id="add-title" placeholder="Например: Книга 'Мастер и Маргарита'" />
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
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Описание товара *</label>
                    <textarea class="input" id="add-desc" placeholder="Опишите состояние товара, что вы хотите получить взамен..." rows="4"></textarea>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Местоположение</label>
                    <input class="input" id="add-location" placeholder="Город, район или метро" />
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #331B15;">Характеристики (через запятую)</label>
                    <input class="input" id="add-specs" placeholder="Например: 200 стр., твердый переплет, отличное состояние" />
                </div>
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
            const title = backdrop.querySelector('#add-title').value.trim();
            const category_id = backdrop.querySelector('#add-category').value;
            const desc = backdrop.querySelector('#add-desc').value.trim();
            const location = backdrop.querySelector('#add-location').value.trim();
            const specsInput = backdrop.querySelector('#add-specs').value.trim();

            if (!title || !category_id || !desc) {
                showNotification('Заполните все обязательные поля');
                return;
            }

            const specs = specsInput ? specsInput.split(',').map(s => s.trim()).filter(s => s) : [];

            const newOfferData = {
                title,
                description: desc,
                category_id: parseInt(category_id),
                location_id: 1, // временно
                image_url: '',
                specs
            };

            try {
                await submitNewItem(newOfferData);
                showNotification('Товар успешно добавлен!');
                close();
                await fetchOffers();
            } catch (e) {
                console.error(e);
                showNotification('Ошибка: ' + e.message);
            }
        });
    }

    // === РЕНДЕР, ПОИСК, УВЕДОМЛЕНИЯ и др. ===
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
            const img = node.querySelector('.item-img');
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

            img.src = o.img;
            img.alt = o.title;

            card.dataset.id = o.id;
            card.style.cursor = 'pointer';
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
        console.log('Инициализация приложения...');
        seedRequestsAndStories();
        await fetchOffers();
        bind();
        renderRequests();
        renderStories();

        // Загрузка профиля (локально)
        const profile = JSON.parse(localStorage.getItem('profile') || '{}');
        if (profile.name) {
            document.getElementById('user-name')?.textContent = profile.name;
            document.getElementById('user-score')?.textContent = `Доверие: ${profile.score || '4.4'}`;
            document.getElementById('acc-name')?.textContent = profile.name;
            document.getElementById('acc-email')?.textContent = profile.email || 'email@example.com';
            document.getElementById('acc-score')?.textContent = `Доверие: ${profile.score || '4.4'} • ${profile.deals || 0} сделок`;
        }
    }

    return { init };
})();

// === АВТОРИЗАЦИЯ ===
const auth = (() => {
    // Базовый путь к API авторизации
    const AUTH_BASE = '/auth';

    // Функция для входа
    async function login(email, password) {
        try {
            const response = await fetch(`${AUTH_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Ошибка входа');
            }

            // Сохраняем токен в cookie (сервер это делает)
            showNotification('Успешный вход!');
            
            // Обновляем профиль в localStorage
            const profile = JSON.parse(localStorage.getItem('profile') || '{}');
            profile.email = email;
            localStorage.setItem('profile', JSON.stringify(profile));
            
            return data;
        } catch (error) {
            console.error('Ошибка входа:', error);
            showNotification(`Ошибка: ${error.message}`);
            throw error;
        }
    }

    // Функция для регистрации
    async function register(name, email, password) {
        try {
            const response = await fetch(`${AUTH_BASE}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Ошибка регистрации');
            }

            showNotification('Регистрация успешна! Теперь вы можете войти.');
            return data;
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            showNotification(`Ошибка: ${error.message}`);
            throw error;
        }
    }

    // Функция для получения информации о текущем пользователе
    async function getMe() {
        try {
            const response = await fetch(`${AUTH_BASE}/me`);
            
            if (!response.ok) {
                throw new Error('Пользователь не авторизован');
            }

            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Ошибка получения данных пользователя:', error);
            return null;
        }
    }

    // Функция для выхода
    async function logout() {
        try {
            const response = await fetch(`${AUTH_BASE}/logout`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Ошибка при выходе');
            }

            // Очищаем локальные данные
            localStorage.removeItem('profile');
            
            showNotification('Вы вышли из системы');
            return response.json();
        } catch (error) {
            console.error('Ошибка выхода:', error);
            showNotification(`Ошибка: ${error.message}`);
            throw error;
        }
    }

    return {
        login,
        register,
        getMe,
        logout
    };
})();

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Функция привязки обработчиков форм авторизации
function bindAuthForms() {
    // Обработчик формы входа
    const loginBtn = document.getElementById('do-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-pass')?.value || document.getElementById('login-email').value.trim(); // временно для тестирования
            
            if (!email || !password) {
                showNotification('Пожалуйста, заполните все поля');
                return;
            }

            try {
                await auth.login(email, password);
                // После успешного входа обновляем UI
                updateAuthUI();
                // Переключаемся на главную страницу
                showPage('main-page');
            } catch (error) {
                // Обработка ошибки происходит внутри auth.login
            }
        });
    }

    // Обработчик формы регистрации
    const registerBtn = document.getElementById('do-register');
    if (registerBtn) {
        registerBtn.addEventListener('click', async () => {
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-pass').value;
            
            if (!name || !email || !password) {
                showNotification('Пожалуйста, заполните все поля');
                return;
            }

            try {
                await auth.register(name, email, password);
                // После успешной регистрации переключаемся на страницу входа
                showPage('login-page');
            } catch (error) {
                // Обработка ошибки происходит внутри auth.register
            }
        });
    }

    // Обработчик кнопки выхода
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await auth.logout();
                // После выхода обновляем UI
                updateAuthUI();
                // Переключаемся на главную страницу
                showPage('main-page');
            } catch (error) {
                // Обработка ошибки происходит внутри auth.logout
            }
        });
    }
}

// Функция обновления UI в зависимости от статуса авторизации
// Функция обновления UI в зависимости от статуса авторизации
async function updateAuthUI() {
    try {
        const response = await fetch('/auth/me');
        const user = await response.json();
        
        if (response.ok && user) {
            // Пользователь авторизован
            const loginContainer = document.querySelector('.login-container');
            const profileContainer = document.querySelector('.profile-container');
            
            if (loginContainer) loginContainer.style.display = 'none';
            if (profileContainer) profileContainer.style.display = 'flex';
            
            // Обновляем информацию о пользователе
            const userName = document.getElementById('user-name');
            const userScore = document.getElementById('user-score');
            
            if (userName) userName.textContent = user.name || 'Пользователь';
            if (userScore) userScore.textContent = `Доверие: ${user.trust_score || '4.4'}`;
            
            // Также показываем профиль в хедере
            const profileBtn = document.getElementById('profile-btn');
            if (profileBtn) profileBtn.style.display = 'flex';
        } else {
            // Пользователь не авторизован
            const loginContainer = document.querySelector('.login-container');
            const profileContainer = document.querySelector('.profile-container');
            
            if (loginContainer) loginContainer.style.display = 'flex';
            if (profileContainer) profileContainer.style.display = 'none';
            
            // Скрываем профиль в хедере
            const profileBtn = document.getElementById('profile-btn');
            if (profileBtn) profileBtn.style.display = 'none';
        }
    } catch (error) {
        // В случае ошибки считаем, что пользователь не авторизован
        const loginContainer = document.querySelector('.login-container');
        const profileContainer = document.querySelector('.profile-container');
        
        if (loginContainer) loginContainer.style.display = 'flex';
        if (profileContainer) profileContainer.style.display = 'none';
        
        // Скрываем профиль в хедере
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) profileBtn.style.display = 'none';
    }
}