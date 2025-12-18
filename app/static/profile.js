// profile.js - клиентская логика для страницы профиля и сообщений

// Простая функция переключения страниц
function showPage(pageId) {
    // Скрыть все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Показать выбранную страницу
    document.getElementById(pageId).classList.add('active');

    // Обновить заголовок страницы
    const titles = {
        'main-page': 'ТовароОбмен — Сообщество обмена вещами',
        'product-page': 'Товар — ТовароОбмен',
        'messages-page': 'Сообщения — ТовароОбмен',
        'login-page': 'Вход — ТовароОбмен',
        'register-page': 'Регистрация — ТовароОбмен',
        'profile-page': 'Профиль — ТовароОбмен'
    };
    document.title = titles[pageId] || 'ТовароОбмен';
}

// Функция проверки авторизации пользователя
async function checkAuthStatus() {
    try {
        const response = await fetch('/auth/me');
        const user = await response.json();
        
        if (response.ok && user) {
            // Пользователь авторизован
            document.getElementById('login-btn').style.display = 'none';
            document.getElementById('profile-btn').style.display = 'flex';
            
            // Обновляем информацию о пользователе
            document.getElementById('user-name').textContent = user.name || 'Пользователь';
            document.getElementById('user-score').textContent = `Доверие: ${user.trust_score || '4.4'}`;
            
            // Обновляем информацию в профиле
            document.getElementById('acc-name').textContent = user.name || 'Пользователь';
            document.getElementById('acc-email').textContent = user.email || 'email@example.com';
            document.getElementById('acc-score').textContent = `Доверие: ${user.trust_score || '4.4'} • ${user.deals_count || 0} сделок`;
            
            // Загружаем активность пользователя
            loadUserActivity(user.id);
        } else {
            // Пользователь не авторизован
            document.getElementById('login-btn').style.display = 'block';
            document.getElementById('profile-btn').style.display = 'none';
        }
    } catch (error) {
        // В случае ошибки считаем, что пользователь не авторизован
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('profile-btn').style.display = 'none';
    }
}

// Загрузка активности пользователя
async function loadUserActivity(userId) {
    try {
        const response = await fetch(`/items/user/${userId}`);
        const items = await response.json();
        
        const activityContainer = document.getElementById('acc-activity');
        activityContainer.innerHTML = '';
        
        if (items && items.length > 0) {
            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'request-item';
                itemElement.innerHTML = `
                    <strong>${item.title}</strong>
                    <small>${item.description}</small>
                `;
                activityContainer.appendChild(itemElement);
            });
        } else {
            activityContainer.innerHTML = '<div class="empty">У вас пока нет активности</div>';
        }
    } catch (error) {
        console.error('Ошибка загрузки активности пользователя:', error);
    }
}

// Загрузка сообщений пользователя
async function loadUserMessages() {
    try {
        const response = await fetch('/auth/me');
        const user = await response.json();
        
        if (response.ok && user) {
            const messagesResponse = await fetch(`/messages/user/${user.id}`);
            const messages = await messagesResponse.json();
            
            const messagesContainer = document.getElementById('messages');
            messagesContainer.innerHTML = '';
            
            if (messages && messages.length > 0) {
                messages.forEach(message => {
                    const messageElement = document.createElement('div');
                    messageElement.className = `msg ${message.sender_id === user.id ? 'you' : 'them'}`;
                    messageElement.textContent = message.content;
                    messagesContainer.appendChild(messageElement);
                });
            } else {
                messagesContainer.innerHTML = '<div class="empty">У вас пока нет сообщений</div>';
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
    }
}

// Загрузка чатов пользователя
async function loadUserConversations() {
    try {
        const response = await fetch('/auth/me');
        const user = await response.json();
        
        if (response.ok && user) {
            const convResponse = await fetch('/messages/conversations');
            const conversations = await convResponse.json();
            
            const convList = document.getElementById('conv-list');
            convList.innerHTML = '';
            
            if (conversations && conversations.length > 0) {
                conversations.forEach(conv => {
                    const convElement = document.createElement('div');
                    convElement.className = 'conv-item';
                    convElement.innerHTML = `
                        <div><strong>${conv.partner_name}</strong></div>
                        <div>${conv.last_message}</div>
                    `;
                    convElement.addEventListener('click', () => {
                        // Помечаем чат как активный
                        document.querySelectorAll('.conv-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        convElement.classList.add('active');
                        
                        // Здесь будет загрузка сообщений для выбранного чата
                        loadMessagesForConversation(conv.id);
                    });
                    convList.appendChild(convElement);
                });
            } else {
                convList.innerHTML = '<div class="empty">У вас пока нет чатов</div>';
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки чатов:', error);
    }
}

// Загрузка сообщений для конкретного чата
async function loadMessagesForConversation(conversationId) {
    try {
        const response = await fetch(`/messages/conversations/${conversationId}`);
        const conversation = await response.json();
        
        document.getElementById('thread-head').textContent = conversation.partner_name;
        
        // Загружаем сообщения для этого чата
        const messagesResponse = await fetch(`/messages?conversation_id=${conversationId}`);
        const messages = await messagesResponse.json();
        
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';
        
        if (messages && messages.length > 0) {
            messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.className = `msg ${message.sender_id === user.id ? 'you' : 'them'}`;
                messageElement.textContent = message.content;
                messagesContainer.appendChild(messageElement);
            });
        } else {
            messagesContainer.innerHTML = '<div class="empty">В этом чате пока нет сообщений</div>';
        }
    } catch (error) {
        console.error('Ошибка загрузки сообщений для чата:', error);
    }
}

// Отправка сообщения
async function sendMessage() {
    const input = document.getElementById('msg-input');
    const content = input.value.trim();
    
    if (!content) return;
    
    try {
        const response = await fetch('/auth/me');
        const user = await response.json();
        
        if (response.ok && user) {
            // В реальной реализации здесь будет отправка в конкретный чат
            // Пока просто отправляем сообщение как прямое сообщение
            const messageData = {
                recipient_id: 2, // Временный ID получателя
                content: content
            };
            
            const sendResponse = await fetch('/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            if (sendResponse.ok) {
                input.value = '';
                // Перезагружаем сообщения
                loadUserMessages();
            }
        }
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
    }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    
    // Привязываем обработчики форм авторизации
    if (typeof bindAuthForms === 'function') {
        bindAuthForms();
    }
    
    // Обработчик кнопки отправки сообщения
    document.getElementById('send-msg').addEventListener('click', sendMessage);
    
    // Обработчик нажатия Enter в поле ввода сообщения
    document.getElementById('msg-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Загружаем чаты при открытии страницы сообщений
    document.getElementById('messages-page').addEventListener('click', function() {
        if (this.classList.contains('active')) {
            loadUserConversations();
        }
    });
    
    // Кнопка "Новый" чат
    document.getElementById('new-chat').addEventListener('click', function() {
        // Временная реализация - просто очищаем чат
        document.getElementById('thread-head').textContent = 'Новый чат';
        document.getElementById('messages').innerHTML = '<div class="empty">Выберите собеседника или начните новый разговор</div>';
    });
    
    // Кнопка сохранения профиля
    document.getElementById('save-profile').addEventListener('click', async function() {
        const name = document.getElementById('input-name').value;
        const email = document.getElementById('input-email').value;
        
        if (!name || !email) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        try {
            const response = await fetch('/auth/me');
            const user = await response.json();
            
            if (response.ok && user) {
                const updateData = {
                    name: name,
                    email: email
                };
                
                const updateResponse = await fetch(`/admin/users/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                });
                
                if (updateResponse.ok) {
                    alert('Профиль успешно обновлён');
                    // Обновляем отображение информации
                    document.getElementById('acc-name').textContent = name;
                    document.getElementById('acc-email').textContent = email;
                    document.getElementById('user-name').textContent = name;
                } else {
                    alert('Ошибка при обновлении профиля');
                }
            }
        } catch (error) {
            console.error('Ошибка обновления профиля:', error);
            alert('Ошибка при обновлении профиля');
        }
    });
    
    // Кнопка выхода
    document.getElementById('logout').addEventListener('click', async function() {
        try {
            const response = await fetch('/auth/logout', {
                method: 'POST'
            });
            
            if (response.ok) {
                // Перенаправляем на главную страницу
                showPage('main-page');
                // Обновляем статус авторизации
                checkAuthStatus();
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    });
});