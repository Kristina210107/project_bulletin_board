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

// Функция привязки обработчиков форм авторизации
function bindAuthForms() {
    // Обработчик формы входа
    const loginBtn = document.getElementById('do-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-pass')?.value;

            if (!email || !password) {
                showNotification('Пожалуйста, заполните все поля');
                return;
            }

            try {
                await auth.login(email, password);
                // После успешного входа обновляем UI
                updateAuthUI();
                // Переключаемся на главную страницу
                window.location.href = '/web/index';
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
                window.location.href = '/web/auth';
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
                window.location.href = '/web/index';
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

// Функция показа уведомлений
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

// Запуск приложения
document.addEventListener('DOMContentLoaded', async () => {
    // Проверяем статус авторизации при загрузке страницы
    await updateAuthUI();

    // Привязываем обработчики форм авторизации
    bindAuthForms();
}
);
