async function getOffers() {
  try {
    const response = await fetch('/api/offers');
    if (!response.ok) throw new Error('Ошибка загрузки');
    const offers = await response.json();
    
    // Сохраняем в localStorage для совместимости
    localStorage.setItem('offers', JSON.stringify(offers));
    return offers;
  } catch (error) {
    console.error('Failed to load offers:', error);
    const fallback = JSON.parse(localStorage.getItem('offers') || '[]');
    return fallback;
  }
}

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

async function render(item) {
  if (!item) {
    document.querySelector('#p-title').textContent = 'Товар не найден';
    document.querySelector('#p-desc').textContent = 'Возможно товар удалён или ссылка неверна.';
    return;
  }

  document.querySelector('#p-title').textContent = item.title;
  document.querySelector('#p-short').textContent = item.title;
  document.querySelector('#p-img').src = item.image || 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=800&auto=format&fit=crop';
  document.querySelector('#p-category').textContent = item.category + (item.likes ? ` • ${item.likes} ♥` : '');
  document.querySelector('#p-desc').textContent = item.description || item.desc;
  
  // Seller info
  document.querySelector('#seller-name').textContent = item.owner || 'Продавец';
  document.querySelector('#seller-score').textContent = 'Доверие: 4.7 • 52 сделки';
  document.querySelector('#seller-meta').textContent = `Категория: ${item.category || '—'}`;
  
  const sellerEmail = item.owner ? `${item.owner.toLowerCase().replace(/\s+/g, '')}@example.com` : 'hello@example.com';
  document.querySelector('#seller-email').textContent = sellerEmail;
  document.querySelector('#seller-email').href = 'mailto:' + sellerEmail;
  document.querySelector('#seller-phone').textContent = 'Тел: +7 (9**) ***-**-**';

  // Show location
  if (item.location) {
    const locNode = document.createElement('div');
    locNode.style = 'margin-top:8px;color:var(--muted);font-size:13px';
    locNode.textContent = 'Местоположение: ' + item.location;
    document.querySelector('#seller-phone').parentElement.appendChild(locNode);
  }

  // Mock reviews
  const revs = [
    { author: 'Ольга', text: 'Быстрый обмен, товар как в описании.' },
    { author: 'Максим', text: 'Вежливый владелец, рекомендую.' },
    { author: 'Ира', text: 'Все ок, пересылка прошла гладко.' }
  ];
  
  const reviewsEl = document.querySelector('#reviews');
  reviewsEl.innerHTML = '';
  revs.forEach(r => {
    const el = document.createElement('div');
    el.style = 'background:#fff;padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,0.04);';
    el.innerHTML = `<strong style="color:#331B15">${r.author}</strong><div style="color:var(--muted);font-size:13px">${r.text}</div>`;
    reviewsEl.appendChild(el);
  });

  // Wire buttons
  document.querySelector('#p-swap').addEventListener('click', () => {
    const want = prompt('Что вы предлагаете взамен? Описание:');
    if (want) {
      alert('Ваше предложение отправлено продавцу. Спасибо!');
    }
  });
  
  document.querySelector('#p-contact').addEventListener('click', () => {
    const email = document.querySelector('#seller-email').textContent;
    const subject = encodeURIComponent('Интерес к товару: ' + item.title);
    window.location.href = `mailto:${email}?subject=${subject}`;
  });
}

(async function init() {
  const offers = await getOffers();
  const id = getParam('id');
  const item = offers.find(i => i.id === id) || null;
  render(item);
})();