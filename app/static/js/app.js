// Главный модуль приложения
const TovaroObmenApp = (() => {
    // Данные приложения
    let offers = [];
    let savedItems = JSON.parse(localStorage.getItem('saved_items') || '[]');
    let userData = JSON.parse(localStorage.getItem('user_data') || '{"name": "Анна", "trust": 4.8}');

    // DOM элементы
    const elements = {
        // Кнопки в хедере
        btnOffer: document.querySelector('.btn-offer'),
        btnMessages: document.querySelector('.btn-messages'),
        btnLogin: document.querySelectorAll('.btn-auth')[0],
        btnRegister: document.querySelectorAll('.btn-auth.primary')[0],
        btnJoin: document.querySelector('.btn-join'),
        btnHow: document.querySelector('.btn-how'),
        
        // Поиск и фильтры
        globalSearch: document.querySelector('.global-search'),
        filterSearch: document.querySelector('.filter-search'),
        nearbyCheckbox: document.querySelector('#nearby'),
        sortSelect: document.querySelector('.sort-select'),
        
        // Карточки предложений
        offersList: document.getElementById('offers-list'),
        
        // Кнопки в карточках
        exchangeButtons: null,
        saveButtons: null,
        
        // Пользователь
        userName: document.querySelector('.user-name'),
        userTrust: document.querySelector('.user-trust'),
        userAvatar: document.querySelector('.avatar')
    };

    // Инициализация приложения
    function init() {
        console.log('🚀 ТовароОбмен запущен');
        
        // Загружаем данные
        loadData();
        
        // Настраиваем пользователя
        updateUserInfo();
        
        // Привязываем обработчики событий
        bindEvents();
        
        // Рендерим предложения
        renderOffers();
        
        // Обновляем кнопки сохранения
        updateSaveButtons();
    }

    // Загрузка данных
    function loadData() {
        // Тестовые данные (в реальном приложении - запрос к API)
        offers = [
            {
                id: 1,
                title: 'Сборник советских сказок (книги)',
                description: 'В отличном состоянии, 200 страниц. Ищу детскую одежду или игрушку.',
                category: 'Книги',
                location: 'Москва, м. Чистые пруды',
                image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop',
                specs: ['200 стр.', 'Твёрдый переплёт', 'Вес 420 г'],
                owner: 'Ольга',
                likes: 18,
                isSaved: savedItems.includes(1)
            },
            {
                id: 2,
                title: 'Детская теплая куртка (110 см)',
                description: 'Пару раз носили, тёплая и чистая. Отдам в обмен на настольные игры.',
                category: 'Одежда',
                location: 'Санкт-Петербург, Приморский р-н',
                image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&auto=format&fit=crop',
                specs: ['Размер 110', 'Синтепон', 'Практически новая'],
                owner: 'Марат',
                likes: 9,
                isSaved: savedItems.includes(2)
            },
            {
                id: 3,
                title: 'Светильник настольный — рабочий',
                description: 'Ищем азы для ремонта: отвертки/клещи или помощь с мелким ремонтом.',
                category: 'Техника',
                location: 'Казань, центр',
                image: 'https://images.unsplash.com/photo-1526481280698-49b77a2b52e7?q=80&w=400&auto=format&fit=crop',
                specs: ['LED', 'Регулировка яркости', 'Потребление 6W'],
                owner: 'Екатерина',
                likes: 6,
                isSaved: savedItems.includes(3)
            },
            {
                id: 4,
                title: 'Набор керамических кружек',
                description: '6 штук, есть небольшой скол на одной.',
                category: 'Дом',
                location: 'Екатеринбург',
                image: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=400&auto=format&fit=crop',
                specs: ['6 шт.', 'Керамика', 'Скол на одной'],
                owner: 'Лена',
                likes: 4,
                isSaved: savedItems.includes(4)
            },
            {
                id: 5,
                title: 'Рюкзак городской, почти новый',
                description: 'Удобные отделения, идеален для учебы или прогулок.',
                category: 'Одежда',
                location: 'Нижний Новгород',
                image: 'https://images.unsplash.com/photo-1520975916232-04dfb3f2f6d9?q=80&w=400&auto=format&fit=crop',
                specs: ['22л', 'Влагостойкий', 'Отделение для ноутбука'],
                owner: 'Дима',
                likes: 11,
                isSaved: savedItems.includes(5)
            }
        ];
        
        console.log(`✅ Загружено ${offers.length} предложений`);
    }

    // Привязка обработчиков событий
    function bindEvents() {
        // Кнопка "Предложить вещь"
        if (elements.btnOffer) {
            elements.btnOffer.addEventListener('click', () => {
                console.log('📝 Предложить новую вещь');
                showNotification('Форма добавления предложения скоро будет доступна');
                // В реальном приложении открыть модальное окно
            });
        }

        // Кнопка "Сообщения"
        if (elements.btnMessages) {
            elements.btnMessages.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('💬 Переход к сообщениям');
                showNotification('Переходим к сообщениям...');
                // В реальном приложении перенаправление
                window.location.href = '/messages';
            });
        }

        // Кнопка "Войти"
        if (elements.btnLogin) {
            elements.btnLogin.addEventListener('click', () => {
                console.log('🔑 Вход в систему');
                const name = prompt('Введите ваше имя:', userData.name);
                if (name && name.trim()) {
                    userData.name = name.trim();
                    localStorage.setItem('user_data', JSON.stringify(userData));
                    updateUserInfo();
                    showNotification(`Добро пожаловать, ${name}!`);
                }
            });
        }

        // Кнопка "Регистрация"
        if (elements.btnRegister) {
            elements.btnRegister.addEventListener('click', () => {
                console.log('📝 Регистрация');
                const name = prompt('Придумайте имя пользователя:');
                if (name && name.trim()) {
                    userData.name = name.trim();
                    localStorage.setItem('user_data', JSON.stringify(userData));
                    updateUserInfo();
                    showNotification(`Аккаунт ${name} создан!`);
                }
            });
        }

        // Кнопка "Присоединиться"
        if (elements.btnJoin) {
            elements.btnJoin.addEventListener('click', () => {
                console.log('👥 Присоединение к сообществу');
                showNotification('🎉 Вы успешно присоединились к сообществу ТовароОбмен!');
            });
        }

        // Кнопка "Как это работает"
        if (elements.btnHow) {
            elements.btnHow.addEventListener('click', () => {
                console.log('❓ Как это работает');
                showNotification('📚 ТовароОбмен - это платформа для обмена вещами. Вы предлагаете то, что вам не нужно, и находите то, что нужно вам!');
            });
        }

        // Глобальный поиск
        if (elements.globalSearch) {
            elements.globalSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                console.log(`🔍 Поиск: ${searchTerm}`);
                filterOffers(searchTerm);
            });
        }

        // Поиск в фильтрах
        if (elements.filterSearch) {
            elements.filterSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                console.log(`🔍 Фильтр: ${searchTerm}`);
                filterOffers(searchTerm);
            });
        }

        // Чекбокс "Только поблизости"
        if (elements.nearbyCheckbox) {
            elements.nearbyCheckbox.addEventListener('change', (e) => {
                console.log(`📍 Только поблизости: ${e.target.checked}`);
                showNotification(e.target.checked ? 'Показываем только ближайшие предложения' : 'Показываем все предложения');
            });
        }

        // Сортировка
        if (elements.sortSelect) {
            elements.sortSelect.addEventListener('change', (e) => {
                console.log(`🔀 Сортировка: ${e.target.value}`);
                sortOffers(e.target.value);
            });
        }
    }

    // Обновление информации о пользователе
    function updateUserInfo() {
        if (elements.userName) {
            elements.userName.textContent = userData.name;
        }
        if (elements.userTrust) {
            elements.userTrust.textContent = `Доверие ${userData.trust}`;
        }
        if (elements.userAvatar) {
            elements.userAvatar.textContent = userData.name.charAt(0);
        }
    }

    // Рендеринг предложений
    function renderOffers() {
        if (!elements.offersList) return;
        
        elements.offersList.innerHTML = '';
        
        offers.forEach(offer => {
            const offerElement = createOfferElement(offer);
            elements.offersList.appendChild(offerElement);
        });
        
        // После рендеринга обновляем обработчики для кнопок в карточках
        updateCardButtons();
    }

    // Создание элемента предложения
    function createOfferElement(offer) {
        const div = document.createElement('div');
        div.className = 'offer-card';
        div.dataset.id = offer.id;
        
        div.innerHTML = `
            <div class="offer-image">
                <img src="${offer.image}" alt="${offer.title}" />
            </div>
            <div class="offer-content">
                <h3 class="offer-title">${offer.title}</h3>
                <p class="offer-description">${offer.description}</p>
                
                <div class="offer-specs">
                    ${offer.specs.map(spec => `<span class="spec">${spec}</span>`).join('')}
                </div>
                
                <div class="offer-meta">
                    <span class="category-tag">${offer.category}</span>
                    <span class="location">${offer.location}</span>
                </div>
                
                <div class="offer-actions">
                    <button class="btn-exchange" data-id="${offer.id}">Предложить обмен</button>
                    <button class="btn-save ${offer.isSaved ? 'saved' : ''}" data-id="${offer.id}">
                        ${offer.isSaved ? '✓ Сохранено' : 'Сохранить'}
                    </button>
                </div>
            </div>
        `;
        
        return div;
    }

    // Обновление обработчиков кнопок в карточках
    function updateCardButtons() {
        // Кнопки "Предложить обмен"
        document.querySelectorAll('.btn-exchange').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const offerId = parseInt(e.target.dataset.id);
                const offer = offers.find(o => o.id === offerId);
                if (offer) {
                    console.log(`🔄 Предложить обмен для: ${offer.title}`);
                    showNotification(`Вы предложили обмен для "${offer.title}". Владелец получит уведомление.`);
                }
            });
        });

        // Кнопки "Сохранить"
        document.querySelectorAll('.btn-save').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const offerId = parseInt(e.target.dataset.id);
                toggleSaveOffer(offerId, e.target);
            });
        });
    }

    // Переключение сохранения предложения
    function toggleSaveOffer(offerId, button) {
        const offerIndex = offers.findIndex(o => o.id === offerId);
        if (offerIndex === -1) return;
        
        const isCurrentlySaved = offers[offerIndex].isSaved;
        
        if (isCurrentlySaved) {
            // Удаляем из сохраненных
            savedItems = savedItems.filter(id => id !== offerId);
            offers[offerIndex].isSaved = false;
            button.classList.remove('saved');
            button.textContent = 'Сохранить';
            showNotification('Убрано из сохраненных');
        } else {
            // Добавляем в сохраненные
            savedItems.push(offerId);
            offers[offerIndex].isSaved = true;
            button.classList.add('saved');
            button.textContent = '✓ Сохранено';
            showNotification('Добавлено в сохраненные');
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('saved_items', JSON.stringify(savedItems));
    }

    // Обновление состояния кнопок сохранения
    function updateSaveButtons() {
        document.querySelectorAll('.btn-save').forEach(btn => {
            const offerId = parseInt(btn.dataset.id);
            const isSaved = savedItems.includes(offerId);
            
            if (isSaved) {
                btn.classList.add('saved');
                btn.textContent = '✓ Сохранено';
            } else {
                btn.classList.remove('saved');
                btn.textContent = 'Сохранить';
            }
        });
    }

    // Фильтрация предложений
    function filterOffers(searchTerm) {
        if (!searchTerm.trim()) {
            renderOffers();
            return;
        }
        
        const filtered = offers.filter(offer => 
            offer.title.toLowerCase().includes(searchTerm) ||
            offer.description.toLowerCase().includes(searchTerm) ||
            offer.category.toLowerCase().includes(searchTerm) ||
            offer.location.toLowerCase().includes(searchTerm)
        );
        
        elements.offersList.innerHTML = '';
        
        if (filtered.length === 0) {
            elements.offersList.innerHTML = `
                <div class="no-results">
                    <h3>Ничего не найдено</h3>
                    <p>Попробуйте изменить поисковый запрос</p>
                </div>
            `;
        } else {
            filtered.forEach(offer => {
                const offerElement = createOfferElement(offer);
                elements.offersList.appendChild(offerElement);
            });
            updateCardButtons();
        }
    }

    // Сортировка предложений
    function sortOffers(sortBy) {
        let sorted = [...offers];
        
        switch (sortBy) {
            case 'popular':
                sorted.sort((a, b) => b.likes - a.likes);
                break;
            case 'new':
            default:
                sorted.sort((a, b) => b.id - a.id);
                break;
        }
        
        elements.offersList.innerHTML = '';
        sorted.forEach(offer => {
            const offerElement = createOfferElement(offer);
            elements.offersList.appendChild(offerElement);
        });
        updateCardButtons();
    }

    // Показать уведомление
    function showNotification(message) {
        // Удаляем старое уведомление если есть
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) oldNotification.remove();
        
        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
        `;
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #F5A089;
            color: #331B15;
            padding: 12px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // Добавляем стили анимаций
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .btn-save.saved {
                background: #4CAF50 !important;
                color: white !important;
                border-color: #4CAF50 !important;
            }
            
            .no-results {
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
                background: white;
                border-radius: 16px;
                border: 1px solid #795F58;
            }
            
            .no-results h3 {
                color: #331B15;
                margin-bottom: 10px;
            }
            
            .no-results p {
                color: #795F58;
            }
        `;
        document.head.appendChild(style);
    }

    // Публичные методы
    return {
        init: function() {
            addStyles();
            init();
        },
        
        // Для отладки
        getOffers: () => offers,
        getUser: () => userData,
        getSavedItems: () => savedItems
    };
})();

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    TovaroObmenApp.init();
});

// Экспорт для использования в других файлах (если нужно)
window.TovaroObmenApp = TovaroObmenApp;