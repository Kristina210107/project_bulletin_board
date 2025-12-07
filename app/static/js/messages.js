const KEY = 'conversations';
const PROFILE_KEY = 'profile';

function q(sel) { return document.querySelector(sel); }

function loadConvs() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function saveConvs(c) {
  localStorage.setItem(KEY, JSON.stringify(c));
}

function meName() {
  const p = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  return p.name || 'Вы';
}

function renderList(selectedId) {
  const convs = loadConvs();
  const wrap = q('#conv-list');
  wrap.innerHTML = '';
  
  convs.forEach(c => {
    const partner = c.participants.find(p => p !== meName()) || c.participants[0] || 'Чат';
    const el = document.createElement('div');
    el.className = 'conv-item';
    if (c.id === selectedId) el.classList.add('active');
    
    const last = c.messages && c.messages.length ? 
      c.messages[c.messages.length - 1].text.slice(0, 60) : 'Нет сообщений';
    
    el.innerHTML = `<div style="font-weight:600">${partner}</div><div style="font-size:13px;color:var(--muted)">${last}</div>`;
    el.addEventListener('click', () => openThread(c.id));
    wrap.appendChild(el);
  });
}

function openThread(id) {
  const convs = loadConvs();
  const c = convs.find(x => x.id === id);
  if (!c) return;
  
  q('#thread-head').textContent = (c.participants.find(p => p !== meName()) || 'Чат');
  const msgs = q('#messages');
  msgs.innerHTML = '';
  
  (c.messages || []).forEach(m => {
    const el = document.createElement('div');
    el.className = 'msg ' + (m.from === meName() ? 'you' : 'them');
    el.style.alignSelf = m.from === meName() ? 'flex-end' : 'flex-start';
    el.innerHTML = `<div style="font-size:13px">${escapeHtml(m.text)}</div><div style="font-size:11px;color:var(--muted);margin-top:6px">${new Date(m.ts).toLocaleString()}</div>`;
    msgs.appendChild(el);
  });
  
  q('#messages').scrollTop = q('#messages').scrollHeight;
  q('#send-msg').dataset.cid = id;
  renderList(id);
}

function startNewChat() {
  const name = prompt('Имя собеседника (например, Ольга):');
  if (!name) return;
  
  const convs = loadConvs();
  const existing = convs.find(c => c.participants.includes(name) && c.participants.includes(meName()));
  if (existing) {
    openThread(existing.id);
    return;
  }
  
  const id = 'c_' + Date.now();
  const obj = {
    id,
    participants: [meName(), name],
    messages: [{
      from: meName(),
      text: 'Привет! Я начал(а) чат с вами.',
      ts: Date.now()
    }]
  };
  
  convs.push(obj);
  saveConvs(convs);
  renderList(id);
  openThread(id);
}

function sendMessage() {
  const text = q('#msg-input').value.trim();
  if (!text) return;
  
  const cid = q('#send-msg').dataset.cid;
  if (!cid) {
    alert('Выберите чат или создайте новый');
    return;
  }
  
  const convs = loadConvs();
  const c = convs.find(x => x.id === cid);
  if (!c) return;
  
  c.messages.push({
    from: meName(),
    text,
    ts: Date.now()
  });
  
  saveConvs(convs);
  q('#msg-input').value = '';
  openThread(cid);
  
  // Store activity
  const act = JSON.parse(localStorage.getItem('activity') || '[]');
  act.push(`Отправлено сообщение в чат с ${c.participants.find(p => p !== meName())}`);
  localStorage.setItem('activity', JSON.stringify(act));
}

function escapeHtml(s) {
  return String(s).replace(/[&<>\"']/g, function(c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' })[c];
  });
}

document.addEventListener('DOMContentLoaded', () => {
  q('#new-chat').addEventListener('click', startNewChat);
  q('#send-msg').addEventListener('click', sendMessage);
  
  q('#msg-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Init sample conversation if none
  let convs = loadConvs();
  if (convs.length === 0) {
    const starter = {
      id: 'c_init',
      participants: [meName(), 'Ольга'],
      messages: [
        { from: 'Ольга', text: 'Привет! Я отвечу на ваш запрос.', ts: Date.now() - 1000 * 60 * 60 },
        { from: meName(), text: 'Спасибо — как с вами связаться?', ts: Date.now() }
      ]
    };
    convs.push(starter);
    saveConvs(convs);
  }
  
  renderList();
});