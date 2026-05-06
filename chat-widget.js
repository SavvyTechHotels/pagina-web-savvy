(function () {
  'use strict';

  var WIDGET_ID = 'savvy-chat-widget';
  var API_URL = '/api/chat';
  var WELCOME = '¡Hola! Soy el asistente de Savvy Tech Hotels. ¿En qué puedo ayudarte?';

  var msgs = [];
  var isOpen = false;
  var isBusy = false;

  function init() {
    if (document.getElementById(WIDGET_ID)) return;

    var style = document.createElement('style');
    style.textContent = '@keyframes sav-dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}';
    document.head.appendChild(style);

    var root = document.createElement('div');
    root.id = WIDGET_ID;
    root.innerHTML = html();
    document.body.appendChild(root);

    document.getElementById('sav-btn').addEventListener('click', toggle);
    document.getElementById('sav-close').addEventListener('click', closeChat);
    document.getElementById('sav-send').addEventListener('click', send);
    document.getElementById('sav-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });

    addMsg('bot', WELCOME);
  }

  function html() {
    return '' +
      '<button id="sav-btn" aria-label="Chat con Savvy"' +
      ' style="position:fixed;bottom:20px;right:20px;z-index:9997;' +
      'width:56px;height:56px;border-radius:50%;border:none;' +
      'background:#0e4159;cursor:pointer;' +
      'box-shadow:0 4px 20px rgba(14,65,89,.4);' +
      'display:flex;align-items:center;justify-content:center;' +
      'transition:transform .2s,box-shadow .2s;"' +
      ' onmouseover="this.style.transform=\'scale(1.08)\'"' +
      ' onmouseout="this.style.transform=\'scale(1)\'">' +
      '<span id="sav-btn-icon" class="material-symbols-outlined" style="color:#fff;font-size:24px;">chat</span>' +
      '</button>' +

      '<div id="sav-panel"' +
      ' style="display:none;position:fixed;bottom:88px;right:20px;z-index:9997;' +
      'width:min(340px,calc(100vw - 40px));' +
      'background:#fff;border-radius:12px;' +
      'box-shadow:0 8px 40px rgba(0,0,0,.16);' +
      'font-family:\'Montserrat\',sans-serif;' +
      'flex-direction:column;overflow:hidden;">' +

        '<div style="background:#0e4159;padding:14px 16px;display:flex;align-items:center;gap:10px;">' +
          '<div style="width:8px;height:8px;background:#4ade80;border-radius:50%;flex-shrink:0;"></div>' +
          '<div style="flex:1;min-width:0;">' +
            '<p style="margin:0;font-size:13px;font-weight:600;color:#fff;letter-spacing:-.01em;">Savvy Assistant</p>' +
            '<p style="margin:0;font-size:11px;color:rgba(255,255,255,.6);">Responde al instante</p>' +
          '</div>' +
          '<button id="sav-close" aria-label="Cerrar chat"' +
          ' style="background:rgba(255,255,255,.1);border:none;cursor:pointer;' +
          'width:28px;height:28px;border-radius:4px;flex-shrink:0;' +
          'display:flex;align-items:center;justify-content:center;' +
          'color:#fff;transition:background .2s;"' +
          ' onmouseover="this.style.background=\'rgba(255,255,255,.2)\'"' +
          ' onmouseout="this.style.background=\'rgba(255,255,255,.1)\'">' +
            '<span class="material-symbols-outlined" style="font-size:16px;">close</span>' +
          '</button>' +
        '</div>' +

        '<div id="sav-msgs"' +
        ' style="overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;' +
        'min-height:180px;max-height:300px;background:#f8fafc;">' +
        '</div>' +

        '<div style="padding:12px 14px;border-top:1px solid #e2e8f0;background:#fff;display:flex;gap:8px;align-items:center;">' +
          '<input id="sav-input" type="text" placeholder="Escribe tu pregunta…" autocomplete="off"' +
          ' style="flex:1;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:6px;' +
          'font-family:\'Montserrat\',sans-serif;font-size:13px;color:#0f172a;' +
          'outline:none;transition:border-color .2s;min-width:0;"' +
          ' onfocus="this.style.borderColor=\'#0e4159\'"' +
          ' onblur="this.style.borderColor=\'#e2e8f0\'" />' +
          '<button id="sav-send" aria-label="Enviar"' +
          ' style="width:36px;height:36px;background:#0e4159;border:none;border-radius:6px;' +
          'cursor:pointer;flex-shrink:0;display:flex;align-items:center;' +
          'justify-content:center;transition:background .2s;"' +
          ' onmouseover="this.style.background=\'#0a3347\'"' +
          ' onmouseout="this.style.background=\'#0e4159\'">' +
            '<span class="material-symbols-outlined" style="color:#fff;font-size:18px;">send</span>' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  function toggle() { isOpen ? closeChat() : openChat(); }

  function openChat() {
    isOpen = true;
    document.getElementById('sav-panel').style.display = 'flex';
    document.getElementById('sav-btn-icon').textContent = 'close';
    setTimeout(function () {
      document.getElementById('sav-input').focus();
      scrollBottom();
    }, 50);
  }

  function closeChat() {
    isOpen = false;
    document.getElementById('sav-panel').style.display = 'none';
    document.getElementById('sav-btn-icon').textContent = 'chat';
  }

  function renderMd(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  function addMsg(role, text) {
    var isBot = role === 'bot';
    var container = document.getElementById('sav-msgs');
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;' + (isBot ? 'justify-content:flex-start' : 'justify-content:flex-end');
    var bubble = document.createElement('div');
    bubble.style.cssText = [
      'max-width:84%',
      'padding:9px 12px',
      'border-radius:' + (isBot ? '4px 10px 10px 10px' : '10px 4px 10px 10px'),
      'font-size:13px',
      'line-height:1.55',
      'background:' + (isBot ? '#fff' : '#0e4159'),
      'color:' + (isBot ? '#0f172a' : '#fff'),
      isBot ? 'box-shadow:0 1px 4px rgba(0,0,0,.07)' : '',
      isBot ? '' : 'white-space:pre-wrap',
      'word-break:break-word'
    ].filter(Boolean).join(';');
    if (isBot) {
      bubble.innerHTML = renderMd(text);
    } else {
      bubble.textContent = text;
    }
    row.appendChild(bubble);
    container.appendChild(row);
    scrollBottom();
  }

  function showTyping() {
    var container = document.getElementById('sav-msgs');
    var el = document.createElement('div');
    el.id = 'sav-typing';
    el.style.cssText = 'display:flex;justify-content:flex-start;';
    el.innerHTML = '<div style="background:#fff;border-radius:4px 10px 10px 10px;padding:10px 14px;box-shadow:0 1px 4px rgba(0,0,0,.07);display:flex;gap:5px;align-items:center;">' +
      ['0s', '0.18s', '0.36s'].map(function (d) {
        return '<span style="width:6px;height:6px;background:#94a3b8;border-radius:50%;display:inline-block;animation:sav-dot .7s ' + d + ' infinite;"></span>';
      }).join('') +
      '</div>';
    container.appendChild(el);
    scrollBottom();
  }

  function hideTyping() {
    var el = document.getElementById('sav-typing');
    if (el) el.remove();
  }

  function scrollBottom() {
    var el = document.getElementById('sav-msgs');
    if (el) el.scrollTop = el.scrollHeight;
  }

  async function send() {
    if (isBusy) return;
    var input = document.getElementById('sav-input');
    var text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMsg('user', text);
    msgs.push({ role: 'user', content: text });

    isBusy = true;
    document.getElementById('sav-send').disabled = true;
    showTyping();

    try {
      var res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, honeypot: '' })
      });
      var data = await res.json();
      var reply = (data && data.reply) ? data.reply : 'Lo siento, no pude procesar tu pregunta.';
      hideTyping();
      addMsg('bot', reply);
      msgs.push({ role: 'assistant', content: reply });
    } catch (_) {
      hideTyping();
      addMsg('bot', 'Ha ocurrido un error de conexión. Por favor, inténtalo de nuevo.');
    }

    isBusy = false;
    document.getElementById('sav-send').disabled = false;
    input.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
